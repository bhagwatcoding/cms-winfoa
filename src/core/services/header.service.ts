import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { cache } from 'react'; // Optimization: Request-level caching
import { DeviceType, DeviceTypeLabels } from '@/core/db/enums';
import { SESSION } from '@/config';

// ==========================================
// 1. DOMAIN MODELS & TYPES
// ==========================================
export interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  countryCode: string;
  region: string;
  timezone: string;
}

export interface DeviceContext {
  type: DeviceType;
  label: string;
  userAgent: string;
  isBot: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface NetworkContext {
  clientIp: string;
  isProxy: boolean;
  protocol: 'http' | 'https';
  host: string | null;
}

export interface RequestMetadata {
  network: NetworkContext;
  geo: GeoLocation;
  device: DeviceContext;
  auth: {
    bearerToken: string | null;
    hasSessionCookie: boolean;
  };
  context: {
    language: string;
    isDevelopment: boolean;
    timestamp: string;
  };
}

// ==========================================
// 2. THE HEADER SERVICE (CORE)
// ==========================================
export class HeaderService {
  private static readonly IS_DEV = process.env.NODE_ENV === 'development';

  // Private Dictionary for Header Keys (No Magic Strings)
  private static readonly HEADERS = {
    GEO: {
      LAT: 'x-vercel-ip-latitude',
      LON: 'x-vercel-ip-longitude',
      COUNTRY: 'x-vercel-ip-country',
      COUNTRY_CODE: 'x-vercel-ip-country-code',
      CITY: 'x-vercel-ip-city',
      REGION: 'x-vercel-ip-country-region',
      TZ: 'x-vercel-ip-timezone',
    },
    NET: {
      FORWARDED: 'x-forwarded-for',
      REAL_IP: 'x-real-ip',
      PROTO: 'x-forwarded-proto',
      HOST: 'host',
    },
    CLIENT: {
      UA: 'user-agent',
      LANG: 'accept-language',
      AUTH: 'authorization',
    },
  } as const;

  /**
   * RESOLVER: Unifies headers from different Next.js contexts
   */
  private static async resolveHeaders(source?: NextRequest | Headers): Promise<Headers> {
    if (source instanceof Headers) return source;
    if (source?.headers instanceof Headers) return source.headers;
    try {
      return await headers();
    } catch {
      return new Headers();
    }
  }

  // ---------------------------------------------------------
  // 3. ANALYTICS & EXTRACTION LOGIC
  // ---------------------------------------------------------

  /**
   * COMPREHENSIVE METADATA:
   * Wrapped in React 'cache' to ensure it only runs ONCE per request.
   */
  static getMetadata = cache(async (source?: NextRequest | Headers): Promise<RequestMetadata> => {
    const store = await HeaderService.resolveHeaders(source);

    // Run extractions in parallel for maximum efficiency
    const [ipData, geoData, deviceData] = await Promise.all([
      HeaderService.resolveNetwork(store),
      HeaderService.resolveGeo(store),
      HeaderService.resolveDevice(store),
    ]);

    const authHeader = store.get(this.HEADERS.CLIENT.AUTH);
    const cookieHeader = store.get('cookie') || '';

    return {
      network: ipData,
      geo: geoData,
      device: deviceData,
      auth: {
        bearerToken: authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null,
        hasSessionCookie: cookieHeader.includes(SESSION.COOKIE.NAME),
      },
      context: {
        language: store.get(this.HEADERS.CLIENT.LANG)?.split(',')[0] || 'en-US',
        isDevelopment: this.IS_DEV,
        timestamp: new Date().toISOString(),
      },
    };
  });

  private static async resolveNetwork(store: Headers): Promise<NetworkContext> {
    const forwarded = store.get(this.HEADERS.NET.FORWARDED);
    const protocol = (store.get(this.HEADERS.NET.PROTO) as 'http' | 'https') || 'http';

    return {
      clientIp: forwarded
        ? forwarded.split(',')[0].trim()
        : store.get(this.HEADERS.NET.REAL_IP) || '0.0.0.0',
      isProxy: !!forwarded && forwarded.includes(','),
      protocol: this.IS_DEV ? 'https' : protocol,
      host: store.get(this.HEADERS.NET.HOST),
    };
  }

  private static async resolveGeo(store: Headers): Promise<GeoLocation> {
    const get = (key: string) => store.get(key);

    return {
      latitude: parseFloat(get(this.HEADERS.GEO.LAT) || '0'),
      longitude: parseFloat(get(this.HEADERS.GEO.LON) || '0'),
      city: get(this.HEADERS.GEO.CITY) || (this.IS_DEV ? 'Localhost' : 'Unknown'),
      country: get(this.HEADERS.GEO.COUNTRY) || 'Unknown',
      countryCode: get(this.HEADERS.GEO.COUNTRY_CODE) || 'XX',
      region: get(this.HEADERS.GEO.REGION) || 'Unknown',
      timezone: get(this.HEADERS.GEO.TZ) || 'UTC',
    };
  }

  private static async resolveDevice(store: Headers): Promise<DeviceContext> {
    const ua = store.get(this.HEADERS.CLIENT.UA) || '';
    const lowerUA = ua.toLowerCase();

    let type = DeviceType.Desktop;

    if (/bot|spider|googlebot|crawler/i.test(lowerUA)) type = DeviceType.Bot;
    else if (/ipad|tablet|(android(?!.*mobile))/i.test(lowerUA)) type = DeviceType.Tablet;
    else if (/mobile|iphone|android|iemobile/i.test(lowerUA)) type = DeviceType.Mobile;

    return {
      type,
      label: DeviceTypeLabels[type],
      userAgent: ua,
      isBot: type === DeviceType.Bot,
      isMobile: type === DeviceType.Mobile,
      isTablet: type === DeviceType.Tablet,
      isDesktop: type === DeviceType.Desktop,
    };
  }
}
