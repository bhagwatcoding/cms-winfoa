import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { DeviceType, DeviceTypeLabels } from '@/core/db/enums';
import { SESSION } from '@/config';

/**
 * THE ULTIMATE HEADER STORE - FINAL VERSION
 * Features: Complete abstraction, Private Constants, Dev-Mode Fallbacks,
 * Middleware support, and Coordinate formatting.
 */
// ==========================================
// HEADER STORE IN USE INTERFACE
// ==========================================
export interface Coordinates {
  lat: number;
  lang: number;
}

export interface Metadata {
  network: {
    ip: string;
    forwarded: string;
    proto: string;
  };
  location: {
    country: string;
    city: string;
    region: string;
    timezone: string;
  };
  device: {
    isMobile: boolean;
    isBot: boolean;
    userAgent: string;
  };
  content: {
    type: string;
    isJson: boolean;
    isForm: boolean;
    isMultipart: boolean;
    isText: boolean;
    isXml: boolean;
    isHtml: boolean;
  };
}

// ==========================================
// HEADER STORE METHODS
// ==========================================

export class HeaderStore {
  /**
   * GET CLIENT COORDINATES FROM HEADERS
   */
  // --- Private Constants (No Magic Strings) ---
  private static readonly KEYS = {
    CORDS: {
      LANG: 'x-vercel-ip-longitude',
      LAT: 'x-vercel-ip-latitude',
    },
    LOCATION: {
      COUNTRY: 'x-vercel-ip-country',
      COUNTRY_CODE: 'x-vercel-ip-country-code',
      ISP: 'x-vercel-ip-isp',
      CITY: 'x-vercel-ip-city',
      REGION: 'x-vercel-ip-country-region',
      TIMEZONE: 'x-vercel-ip-timezone',
    },
    IP: {
      FORWARDED: 'x-forwarded-for',
      REAL: 'x-real-ip',
    },
    PROTO: 'x-forwarded-proto',
    AUTH: 'authorization',
    USER_AGENT: 'user-agent',
    DEVICE: 'x-device-type',
    OS: 'x-os-type',
    BROWSER: 'x-browser-type',
    DEVICE_ID: 'x-device-id',
    ACCEPT_LANG: 'accept-language',
    REFERER: 'referer',
    HOST: 'host',
    ORIGIN: 'origin',
    COOKIE: 'cookie',
  } as const;

  private static readonly AUTH = {
    BEARER: 'Bearer',
    BASIC: 'Basic',
    COOKIES: {
      NAME: this.KEYS.COOKIE,
      VALUE: SESSION.COOKIE.NAME,
    },
  } as const;

  // --- Default Mock Data for Localhost ---
  private static readonly DEF = {
    LAT: 28.6139,
    LNG: 77.209,
    COUNTRY: 'IN',
    COUNTRY_CODE: 'IN',
    CITY: 'New Delhi (Localhost)',
    TZ: 'Asia/Kolkata',
    IP: '127.0.0.1',
    ISP: 'Unknown',
    LANG: 'en-US',
    COOKIE: SESSION.COOKIE.NAME,
  } as const;

  private static readonly CONTENT = {
    SELF: 'Content-Type',
    TYPE: {
      JSON: 'application/json',
      XML: 'application/xml',
      HTML: 'text/html',
      TEXT: 'text/plain',
      FORM: 'application/x-www-form-urlencoded',
      MULTIPART: 'multipart/form-data',
    },
  } as const;

  private static isDev = process.env.NODE_ENV === 'development';

  /**
   * CORE ENGINE: Switches between Next.js headers() and manual NextRequest
   */
  private static async header(req?: NextRequest | Headers) {
    if (req) return 'headers' in req ? req.headers : req;
    try {
      return await headers();
    } catch {
      return new Headers();
    }
  }
  /**
   * GENERIC GETTER
   */
  static async get(key: string, req?: NextRequest): Promise<string | null> {
    const store = await this.header(req);
    return store.get(key);
  }

  // ---------------------------------------------------------
  // 1. GEOLOCATION & COORDINATES
  // ---------------------------------------------------------

  /**
   * GET CLIENT COORDINATES FROM HEADERS
   */
  static async coordinates(req?: NextRequest): Promise<Coordinates | null> {
    const lat = await this.get(this.KEYS.CORDS.LANG, req);
    const lon = await this.get(this.KEYS.CORDS.LAT, req);

    const cords = (lat: string | number, lon: string | number): Coordinates => {
      return { lat: parseFloat(lat as string), lang: parseFloat(lon as string) };
    };

    if (lat && lon) return cords(lat, lon);

    if (this.isDev) return cords(this.DEF.LAT, this.DEF.LNG);
    return null;
  }

  static async country(req?: NextRequest): Promise<string> {
    const country = await this.get(this.KEYS.LOCATION.COUNTRY, req);
    if (!country && this.isDev) return this.DEF.COUNTRY;
    return country || 'Unknown';
  }

  static async countryCode(req?: NextRequest): Promise<string> {
    const countryCode = await this.get(this.KEYS.LOCATION.COUNTRY_CODE, req);
    if (!countryCode && this.isDev) return this.DEF.COUNTRY_CODE;
    return countryCode || 'Unknown';
  }

  static async city(req?: NextRequest): Promise<string> {
    const city = await this.get(this.KEYS.LOCATION.CITY, req);
    if (!city && this.isDev) return this.DEF.CITY;
    return city || 'Unknown';
  }

  static async timezone(req?: NextRequest): Promise<string> {
    const tz = await this.get(this.KEYS.LOCATION.TIMEZONE, req);
    if (!tz && this.isDev) return this.DEF.TZ;
    return tz || 'UTC';
  }

  // ---------------------------------------------------------
  // 2. NETWORK & SECURITY
  // ---------------------------------------------------------

  static async ip(req?: NextRequest): Promise<string> {
    const store = await this.header(req);
    const forwarded = store.get(this.KEYS.IP.FORWARDED);
    const ip = forwarded ? forwarded.split(',')[0].trim() : store.get(this.KEYS.IP.REAL);

    if (!ip && this.isDev) return this.DEF.IP;
    return ip || '0.0.0.0';
  }

  static async isp(req?: NextRequest): Promise<string> {
    const isp = await this.get(this.KEYS.LOCATION.ISP, req);
    if (!isp && this.isDev) return this.DEF.ISP;
    return isp || 'Unknown';
  }

  static async bearerToken(req?: NextRequest): Promise<string | null> {
    const auth = await this.get(this.KEYS.AUTH, req);
    return auth?.startsWith('Bearer ') ? auth.substring(7) : null;
  }

  static async isSecure(req?: NextRequest): Promise<boolean> {
    const proto = await this.get(this.KEYS.PROTO, req);
    return proto === 'https' || (this.isDev && true);
  }

  // ---------------------------------------------------------
  // 3. DEVICE INTELLIGENCE (Optimized for Enterprise Enums)
  // ---------------------------------------------------------

  static async userAgent(req?: NextRequest): Promise<string | undefined> {
    return (await this.get(this.KEYS.USER_AGENT, req)) || undefined;
  }

  static async device(req?: NextRequest): Promise<string | undefined> {
    return (await this.get(this.KEYS.DEVICE, req)) || undefined;
  }

  static async os(req?: NextRequest): Promise<string | undefined> {
    return (await this.get(this.KEYS.OS, req)) || undefined;
  }

  static async browser(req?: NextRequest): Promise<string | undefined> {
    return (await this.get(this.KEYS.BROWSER, req)) || undefined;
  }

  /**
   * Device ko detect karke seedha Enum Number return karta hai.
   * Ye database indexing ke liye sabse best approach hai.
   */
  static async deviceType(req?: NextRequest): Promise<DeviceType> {
    const ua = await this.userAgent(req);
    if (!ua) return DeviceType.Unknown;

    const lowerUA = ua.toLowerCase();

    // 1. Bot Detection (Security First)
    if (/bot|googlebot|crawler|spider|robot|crawling/i.test(lowerUA)) return DeviceType.Bot;

    // 2. Tablet Detection
    if (/ipad|tablet|(android(?!.*mobile))/i.test(lowerUA)) return DeviceType.Tablet;

    // 3. Mobile Detection
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua))
      return DeviceType.Mobile;

    // Default to Desktop
    return DeviceType.Desktop;
  }

  static async deviceTypeLabel(req?: NextRequest): Promise<string> {
    const type = await this.deviceType(req);
    if (!type) return DeviceTypeLabels[DeviceType.Unknown];
    return DeviceTypeLabels[type];
  }

  /**
   * Boolean Helpers (Internal logic ya UI conditional rendering ke liye)
   */
  static async isMobile(req?: NextRequest): Promise<boolean> {
    return (await this.deviceType(req)) === DeviceType.Mobile;
  }

  static async isTablet(req?: NextRequest): Promise<boolean> {
    return (await this.deviceType(req)) === DeviceType.Tablet;
  }

  static async isDesktop(req?: NextRequest): Promise<boolean> {
    return (await this.deviceType(req)) === DeviceType.Desktop;
  }

  static async isBot(req?: NextRequest): Promise<boolean> {
    return (await this.deviceType(req)) === DeviceType.Bot;
  }

  static async deviceId(req?: NextRequest): Promise<string> {
    return (await this.get(this.KEYS.DEVICE_ID, req)) || '';
  }

  // ---------------------------------------------------------
  // 4. LOCALIZATION
  // ---------------------------------------------------------

  static async referer(req?: NextRequest): Promise<string | null> {
    return await this.get(this.KEYS.REFERER, req);
  }

  static async host(req?: NextRequest): Promise<string | null> {
    return await this.get(this.KEYS.HOST, req);
  }
  static async origin(req?: NextRequest): Promise<string | null> {
    return await this.get(this.KEYS.ORIGIN, req);
  }

  static async language(req?: NextRequest): Promise<string> {
    const lang = await this.get(this.KEYS.ACCEPT_LANG, req);
    if (!lang && this.isDev) return this.DEF.LANG;
    return lang ? lang.split(',')[0] : 'en-US';
  }

  // ---------------------------------------------------------
  // 5. CONTENT TYPES
  // ---------------------------------------------------------

  static async contentType(req?: NextRequest): Promise<string | null> {
    return await this.get(this.CONTENT.SELF, req);
  }

  private static async contentTypeOf(cType: string, req?: NextRequest): Promise<boolean> {
    const ct = await this.contentType(req);
    return ct?.includes(cType) ?? false;
  }

  static async isJson(req?: NextRequest): Promise<boolean> {
    return this.contentTypeOf(this.CONTENT.TYPE.JSON, req);
  }

  static async isForm(req?: NextRequest): Promise<boolean> {
    return this.contentTypeOf(this.CONTENT.TYPE.FORM, req);
  }

  static async isMultipart(req?: NextRequest): Promise<boolean> {
    return this.contentTypeOf(this.CONTENT.TYPE.MULTIPART, req);
  }

  static async isText(req?: NextRequest): Promise<boolean> {
    return this.contentTypeOf(this.CONTENT.TYPE.TEXT, req);
  }

  static async isXml(req?: NextRequest): Promise<boolean> {
    return this.contentTypeOf(this.CONTENT.TYPE.XML, req);
  }

  static async isHtml(req?: NextRequest): Promise<boolean> {
    return this.contentTypeOf(this.CONTENT.TYPE.HTML, req);
  }

  static async isBearer(req?: NextRequest): Promise<boolean> {
    return this.contentTypeOf(this.AUTH.BEARER, req);
  }

  static async isBasic(req?: NextRequest): Promise<boolean> {
    return this.contentTypeOf(this.AUTH.BASIC, req);
  }

  static async cookies(req?: NextRequest): Promise<boolean> {
    const auth = await this.get(this.AUTH.COOKIES.NAME, req);
    return auth?.startsWith(this.AUTH.COOKIES.NAME) ?? false;
  }

  static async cookiesValue(req?: NextRequest): Promise<string | null> {
    return await this.get(this.AUTH.COOKIES.NAME, req);
  }

  // ---------------------------------------------------------
  // 5. MASTER SUMMARY
  // ---------------------------------------------------------

  static async metadata(req?: NextRequest) {
    return {
      network: {
        ip: await this.ip(req),
        isp: await this.isp(req),
        bearerToken: await this.bearerToken(req),
        cookies: await this.cookies(req),
        cookiesValue: await this.cookiesValue(req),
        isSecure: await this.isSecure(req),
      },
      geo: {
        city: await this.city(req),
        country: await this.country(req),
        coordinates: await this.coordinates(req),
        timezone: await this.timezone(req),
      },
      device: {
        isMobile: await this.isMobile(req),
        isBot: await this.isBot(req),
        ua: await this.userAgent(req),
      },
      auth: {
        token: await this.bearerToken(req),
        lang: await this.language(req),
      },
      content: {
        type: await this.contentType(req),
        isJson: await this.isJson(req),
        isForm: await this.isForm(req),
        isMultipart: await this.isMultipart(req),
        isText: await this.isText(req),
        isXml: await this.isXml(req),
        isHtml: await this.isHtml(req),
      },
      meta: {
        isDev: this.isDev,
        timestamp: new Date().toISOString(),
      },
      cookies: {
        name: this.AUTH.COOKIES.NAME,
        value: await this.cookiesValue(req),
        isCookies: await this.cookies(req),
        isBearer: await this.isBearer(req),
        isBasic: await this.isBasic(req),
      },
      deviceType: {
        type: await this.deviceType(req),
        typeLabel: await this.deviceTypeLabel(req),
        isMobile: await this.isMobile(req),
        isTablet: await this.isTablet(req),
        isDesktop: await this.isDesktop(req),
        isBot: await this.isBot(req),
      },
    };
  }
}
