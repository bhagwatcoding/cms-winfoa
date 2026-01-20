import "server-only";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import { Session, ISession } from "@/models";
import { DataSealer } from "@/lib/sealer";
import {
  DeviceType,
  LoginMethod,
  RiskLevel,
  SessionStatus,
  ResourceType,
  ActionType,
  LABEL,
} from "@/types";
import { SESSION } from "@/config";
import { ActivityLogger } from "@/services/activity.service";

export class SessionService {
  private static COOKIE_NAME = SESSION.COOKIE.NAME;
  private static SESSION_DURATION = SESSION.DURATION.MAX_AGE;

  /**
   * Creates a session, saves to DB, sets the Cookie.
   */
  static async createSession(
    userId: string,
    userAgentStr: string = "",
    ip: string = "",
  ) {
    await connectDB();

    // 1. Generate Token for DB
    const token = DataSealer.generateID(48);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.SESSION_DURATION);

    // 2. Save to MongoDB
    const session = await Session.create({
      userId,
      token,
      expiresAt,
      userAgent: userAgentStr,
      ipAddress: ip,
      deviceInfo: this.parseUA(userAgentStr),
      securityInfo: {
        loginMethod: LoginMethod.PASSWORD,
        riskLevel: RiskLevel.LOW,
        failedAttempts: 0,
      },
    });

    await ActivityLogger.log(
      userId,
      ActionType.LOGIN,
      ResourceType.SESSION,
      "User logged in via Password",
      session._id.toString(),
      { device: DeviceType, method: "PASSWORD" },
    );

    // 3. Seal Cookie (Name Binding: 'auth_session=token')
    const sealedValue = DataSealer.sealCookie(this.COOKIE_NAME, token);

    // 4. Set Cookie
    (await cookies()).set(this.COOKIE_NAME, sealedValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return session;
  }

  /**
   * Verifies cookie and retrieves Session from DB
   */
  static async getCurrentSession(): Promise<ISession | null> {
    await connectDB();
    const cookieStore = await cookies();
    const sealedValue = cookieStore.get(this.COOKIE_NAME)?.value;

    // 1. Unseal (Crypto Check)
    const rawToken = DataSealer.unsealCookie(this.COOKIE_NAME, sealedValue);
    if (!rawToken) return null;

    // 2. DB Check
    const session = await Session.findOne({ token: rawToken }).populate(
      "userId",
    );

    // 3. Logic Check (Expiry/Status)
    if (!session || !session.isValid()) {
      return null;
    }

    return session;
  }

  /**
   * Logout user
   */
  static async logout() {
    await connectDB();
    const session = await this.getCurrentSession();

    if (session) {
      session.status = SessionStatus.LOGGED_OUT;
      session.isActive = false;
      await session.save();
    }

    (await cookies()).delete(this.COOKIE_NAME);
  }

  // --- Private Helpers ---
  private static parseUA(uaString: string) {
    const ua = uaString.toLowerCase();
    let type = DeviceType.UNKNOWN;

    if (ua.includes("mobile")) type = DeviceType.MOBILE;
    else if (ua.includes("tablet") || ua.includes("ipad"))
      type = DeviceType.TABLET;
    else if (
      ua.includes("windows") ||
      ua.includes("mac") ||
      ua.includes("linux")
    )
      type = DeviceType.DESKTOP;

    const unknownLabel = LABEL.DeviceType[DeviceType.UNKNOWN];
    return {
      type,
      isMobile: type === DeviceType.MOBILE || type === DeviceType.TABLET,
      browser: unknownLabel, // Use a library like 'ua-parser-js' for real parsing
      os: unknownLabel,
      device: unknownLabel,
    };
  }
}
