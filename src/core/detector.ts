import "server-only";
import { headers } from "next/headers";
import { DeviceType, IDeviceInfo, IGeoInfo } from "@/types";
import { HeaderStore } from "./utils/headerStore.utils";

export class RequestDetective {
  /**
   * Request Headers se Device Info extract karta hai
   */
  static async getDeviceInfo(): Promise<IDeviceInfo> {
    const ua = HeaderStore.get("user-agent") || "";



    // Basic Parsing Logic (Advanced ke liye 'ua-parser-js' use karein)
    const isMobile = /mobile|android|iphone|ipad/i.test(ua);
    const isTablet = /ipad|tablet/i.test(ua);
    const isBot = /bot|crawl|spider|googlebot/i.test(ua);

    let type = DeviceType.Desktop;
    if (isTablet) type = DeviceType.Tablet;
    else if (isMobile) type = DeviceType.Mobile;
    else if (isBot) type = DeviceType.Bot;

    // Browser Detection
    let browser = "Unknown";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    // OS Detection
    let os = "Unknown";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";

    // Create a unique Device Fingerprint (Hash of robust attributes)
    // Isse hum "Remembered Devices" track kar sakte hain
    const fingerprintRaw = `${ua}-${headers().get("accept-language")}-${headers().get("sec-ch-ua-platform")}`;
    const deviceId = Buffer.from(fingerprintRaw)
      .toString("base64")
      .slice(0, 24);

    return {
      type,
      isMobile,
      isBot,
      browser,
      os,
      device: "Generic Device", // Specific model detection needs huge library
      deviceId, // Unique ID for this browser profile
      clientMeta: {
        language: headers().get("accept-language")?.split(",")[0] || "en",
        referrer: headers().get("referer") || undefined,
      },
    };
  }

  /**
   * IP Address se Location nikalta hai (Mock Implementation)
   * Real app me 'geoip-lite' ya 'maxmind' DB use karein
   */
  static async getGeoInfo(): Promise<IGeoInfo> {
    const headerStore = await headers();

    // Cloudflare/Vercel headers se real IP nikalna
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0] ||
      headerStore.get("x-real-ip") ||
      "127.0.0.1";

    // Simulating Lookup (Replace this with real DB call)
    // Example: const geo = geoip.lookup(ip);
    const isLocal = ip === "127.0.0.1" || ip.startsWith("192.168");

    return {
      ip,
      country: isLocal ? "Localhost" : "Unknown Country",
      countryCode: isLocal ? "LO" : "XX",
      city: isLocal ? "Dev City" : "Unknown City",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      coordinates: { lat: 0, long: 0 },
      isp: "Unknown ISP",
    };
  }
}
