import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { DeviceType, DeviceTypeLabels } from '@/core/db/enums';
import { SESSION } from '@/config';

// ==========================================
// 1. STRONGLY TYPED INTERFACES
// ==========================================
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HeaderMetadata {
  network: {
    ip: string;
    isSecure: boolean;
    protocol: string;
    host: string | null;
  };
  geo: {
    city: string;
    country: string;
    countryCode: string;
    region: string;
    timezone: string;
    coordinates: Coordinates;
  };
  device: {
    type: DeviceType;
    label: string;
    userAgent: string | null;
    isBot: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  auth: {
    token: string | null;
    type: 'Bearer' | 'Basic' | null;
    hasSessionCookie: boolean;
  };
  content: {
    contentType: string | null;
    isJson: boolean;
    language: string;
  };
  env: {
    isDev: boolean;
    timestamp: string;
  };
}

// ==========================================
// 2. THE ULTIMATE HEADER SERVICE
// ==========================================
export class HeaderService {
  private static readonly IS_DEV = process.env.NODE_ENV === 'development';

  // Private Constants for Header Keys
  private static readonly KEYS = {
    VERCEL_GEO: {
      LAT: 'x-vercel-ip-latitude',
      LNG: 'x-vercel-ip-longitude',
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
      ORIGIN: 'origin',
    },
    CLIENT: {
      UA: 'user-agent',
      LANG: 'accept-language',
      AUTH: 'authorization',
      CONTENT_TYPE: 'content-type',
    },
  } as const;

  /**
   * Internal Resolver: Unifies NextRequest and Next.js Headers
   */
  private static async getStore(req?: NextRequest | Headers): Promise<Headers> {
    if (req instanceof Headers) return req;
    if (req?.headers instanceof Headers) return req.headers;
    try {
      return await headers();
    } catch {
      return new Headers();
    }
  }

  // ---------------------------------------------------------
  // NETWORK & SECURITY
  // ---------------------------------------------------------

  static async getIp(req?: NextRequest | Headers): Promise<string> {
    const store = await this.getStore(req);
    const forwarded = store.get(this.KEYS.NET.FORWARDED);
    if (forwarded) return forwarded.split(',')[0].trim();

    const realIp = store.get(this.KEYS.NET.REAL_IP);
    if (realIp) return realIp;

    return this.IS_DEV ? '127.0.0.1' : '0.0.0.0';
  }

  // ---------------------------------------------------------
  // GEOLOCATION (With Professional Fallbacks)
  // ---------------------------------------------------------

  static async getGeo(req?: NextRequest | Headers) {
    const store = await this.getStore(req);

    const lat = store.get(this.KEYS.VERCEL_GEO.LAT);
    const lng = store.get(this.KEYS.VERCEL_GEO.LNG);

    return {
      city: store.get(this.KEYS.VERCEL_GEO.CITY) || (this.IS_DEV ? 'Localhost' : 'Unknown'),
      country: store.get(this.KEYS.VERCEL_GEO.COUNTRY) || (this.IS_DEV ? 'India' : 'Unknown'),
      countryCode: store.get(this.KEYS.VERCEL_GEO.COUNTRY_CODE) || (this.IS_DEV ? 'IN' : 'XX'),
      region: store.get(this.KEYS.VERCEL_GEO.REGION) || 'Unknown',
      timezone: store.get(this.KEYS.VERCEL_GEO.TZ) || 'UTC',
      coordinates: {
        lat: lat ? parseFloat(lat) : this.IS_DEV ? 28.6139 : 0,
        lng: lng ? parseFloat(lng) : this.IS_DEV ? 77.209 : 0,
      },
    };
  }

  // ---------------------------------------------------------
  // DEVICE INTELLIGENCE (Optimized Logic)
  // ---------------------------------------------------------

  static async getDevice(req?: NextRequest | Headers) {
    const store = await this.getStore(req);
    const ua = store.get(this.KEYS.CLIENT.UA) || '';
    const lowerUA = ua.toLowerCase();

    let type = DeviceType.Desktop;

    if (/bot|googlebot|crawler|spider|robot/i.test(lowerUA)) {
      type = DeviceType.Bot;
    } else if (/ipad|tablet|(android(?!.*mobile))/i.test(lowerUA)) {
      type = DeviceType.Tablet;
    } else if (/android|iphone|ipod|blackberry|iemobile/i.test(lowerUA)) {
      type = DeviceType.Mobile;
    }

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

  // ---------------------------------------------------------
  // AUTHENTICATION & CONTENT
  // ---------------------------------------------------------

  static async getAuth(req?: NextRequest | Headers) {
    const store = await this.getStore(req);
    const authHeader = store.get(this.KEYS.CLIENT.AUTH);
    const cookieHeader = store.get('cookie') || '';

    let type: 'Bearer' | 'Basic' | null = null;
    let token: string | null = null;

    if (authHeader) {
      const [authType, authToken] = authHeader.split(' ');
      if (authType === 'Bearer' || authType === 'Basic') {
        type = authType;
        token = authToken;
      }
    }

    return {
      type,
      token,
      hasSessionCookie: cookieHeader.includes(SESSION.COOKIE.NAME),
    };
  }

  // ---------------------------------------------------------
  // MASTER AGGREGATOR (The Metadata Engine)
  // ---------------------------------------------------------

  static async getMetadata(req?: NextRequest | Headers): Promise<HeaderMetadata> {
    const store = await this.getStore(req);

    // Run all critical extractions in parallel for maximum performance
    const [ip, geo, device, auth] = await Promise.all([
      this.getIp(store),
      this.getGeo(store),
      this.getDevice(store),
      this.getAuth(store),
    ]);

    const contentType = store.get(this.KEYS.CLIENT.CONTENT_TYPE);

    return {
      network: {
        ip,
        isSecure: store.get(this.KEYS.NET.PROTO) === 'https' || this.IS_DEV,
        protocol: store.get(this.KEYS.NET.PROTO) || 'http',
        host: store.get(this.KEYS.NET.HOST),
      },
      geo,
      device,
      auth,
      content: {
        contentType,
        isJson: contentType?.includes('application/json') ?? false,
        language: store.get(this.KEYS.CLIENT.LANG)?.split(',')[0] || 'en-US',
      },
      env: {
        isDev: this.IS_DEV,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
