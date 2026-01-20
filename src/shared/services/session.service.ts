import "server-only";
import { cookies } from "next/headers";
import { User, Session } from "@/models"; // Ensure User model imports correctly
import { DataSealer } from "@/lib/sealer";
import { RequestDetective } from "@/lib/detector";
import { LoginMethod, RiskLevel, SessionStatus, ISecurityInfo } from "@/types";
import connectDB from "@/lib/db";
import { SESSION } from "@/config";

const COOKIE_NAME = SESSION.COOKIE.NAME;

export class SessionService {
  /**
   * 🧠 SMART LOGIN SESSION
   * Detects Device, Location, and calculates Risk
   */
  static async createSession(
    userId: string,
    method: LoginMethod = LoginMethod.PASSWORD,
  ) {
    await connectDB();

    // 1. Gather Intelligence
    const deviceInfo = await RequestDetective.getDeviceInfo();
    const geoInfo = await RequestDetective.getGeoInfo();

    // 2. Risk Calculation Engine
    const { riskScore, riskLevel } = await this.calculateRisk(
      userId,
      deviceInfo,
      geoInfo,
    );

    // 3. Generate Secure Token
    const token = DataSealer.generateID(64); // Increased entropy
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // 4. Save Session to DB
    const session = await Session.create({
      userId,
      token,
      expiresAt,
      deviceInfo,
      // 🆕 Geo Info save kar rahe hain (Schema update required below)
      geoInfo,
      securityInfo: {
        loginMethod: method,
        riskScore,
        riskLevel,
        isVerified: riskLevel !== RiskLevel.CRITICAL, // Critical needs extra verify
        failedAttempts: 0,
        mfaVerified: false, // Default false
      },
      status: SessionStatus.ACTIVE,
    });

    // 5. Update User's Known Devices (History)
    await this.updateUserHistory(userId, deviceInfo, geoInfo);

    // 6. Set Cookie
    const sealedVal = DataSealer.sealCookie(COOKIE_NAME, token);
    (await cookies()).set(COOKIE_NAME, sealedVal, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return session;
  }

  // --- Private Advanced Logic ---

  /**
   * 🚨 Risk Engine
   * Calculates how "dangerous" this login is.
   */
  private static async calculateRisk(userId: string, device: any, geo: any) {
    let score = 0;

    // Fetch user to check history
    const user = await User.findById(userId).select(
      "loginHistory trustedDevices",
    );

    // Check 1: Is this a known device?
    const isKnownDevice = user?.trustedDevices?.includes(device.deviceId);
    if (!isKnownDevice) score += 30; // New device = Medium Risk

    // Check 2: Is this a Bot?
    if (device.isBot) score += 50;

    // Check 3: Geo Velocity (Impossible Travel)
    // (Simplification: If last login was 'India' and now 'USA' in 1 hour)
    const lastLogin = user?.loginHistory?.[0]; // Assuming sorted desc
    if (
      lastLogin &&
      lastLogin.country !== geo.countryCode &&
      geo.countryCode !== "LO"
    ) {
      score += 60; // High Risk: Country changed
    }

    // Determine Level
    let level = RiskLevel.LOW;
    if (score > 20) level = RiskLevel.MEDIUM;
    if (score > 50) level = RiskLevel.HIGH;
    if (score > 80) level = RiskLevel.CRITICAL;

    return { riskScore: score, riskLevel: level };
  }

  /**
   * 📝 Update User History
   * Keeps track of IPs and Devices for future risk analysis
   */
  private static async updateUserHistory(
    userId: string,
    device: any,
    geo: any,
  ) {
    await User.findByIdAndUpdate(userId, {
      $push: {
        // We only keep last 10 logins to save DB space
        loginHistory: {
          $each: [
            {
              ip: geo.ip,
              country: geo.countryCode,
              device: device.device,
              loginAt: new Date(),
            },
          ],
          $slice: -10,
        },
      },
      $addToSet: { trustedDevices: device.deviceId }, // Add to trusted list if unique
    });
  }
}
