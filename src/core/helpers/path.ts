import { NextRequest } from 'next/server';
import { env } from '@/config/env';

export const path = <T extends NextRequest>(r: T) => {
  const { pathname } = r.nextUrl;
  const host = r.headers.get('host') || '';
  const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;
  const subdomain = host.replace(`.${rootDomain}`, '');
  return {
    rootDomain,
    subdomain,
    url: r.nextUrl,
    name: pathname,
    host,
    start: (path: string) => pathname.startsWith(path),
    end: (path: string) => pathname.endsWith(path),
  };
};
