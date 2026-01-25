// lib/proxy/index.ts
import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from './config';
import { limiter } from './limiter';
import { Security } from './security';
import { Logger } from './logger';
import { ProxyUtils } from './utils';
import { AppRouter } from './router';

export class ProxyHandler {
  static async execute(req: NextRequest): Promise<NextResponse> {
    const path = req.nextUrl.pathname;
    const ip = Security.getIP(req);

    // 1. PERFORMANCE: Skip Static Assets
    if (ProxyUtils.isStaticAsset(path)) {
      return NextResponse.next();
    }

    // 2. SECURITY: WAF Check
    if (!Security.runWAF(req)) {
      Logger.warn('WAF Blocked Request', {
        ip,
        path,
        ua: req.headers.get('user-agent'),
      });
      console.log('WAF Blocked Request', {
        ip,
        path,
        ua: req.headers.get('user-agent'),
      });
      return new NextResponse('Access Denied', { status: 403 });
    }

    // 3. SCALABILITY: Rate Limiting
    if (CONFIG.ENABLE_RATE_LIMIT) {
      const limit = await limiter.check(ip);
      if (!limit.success) {
        Logger.warn('Rate Limit Exceeded', { ip });
        const res = new NextResponse('Too Many Requests', { status: 429 });
        res.headers.set('Retry-After', String(limit.resetAfter));
        return res;
      }
    }

    // 4. CORE: Routing Logic
    const hostname = req.headers.get('host') || '';
    const subdomain = ProxyUtils.parseSubdomain(hostname);

    let response: NextResponse;
    try {
      response = await AppRouter.handle(req, subdomain);
    } catch (err) {
      Logger.error('Routing Error', { error: err });
      response = new NextResponse('Internal Error', { status: 500 });
    }

    // 5. FINALIZE: Add Security Headers
    Security.applyHeaders(response);

    // 6. OBSERVABILITY: Log Request
    // Logger.info("Request Served", {
    //   method: req.method,
    //   path,
    //   subdomain: subdomain || "root",
    //   status: response.status,
    //   duration: `${Date.now() - start}ms`,
    // });

    return response;
  }
}
