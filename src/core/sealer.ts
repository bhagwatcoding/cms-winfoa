"use server";

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { SESSION } from "@/config";
// Load secrets from .env
const SECRETS = SESSION.SECRET.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (SECRETS.length === 0)
  throw new Error("DataSealer: SESSION_SECRET is missing in .env");

export class DataSealer {
  private static SECRETS: typeof SECRETS;
  private static ALGORITHM: "sha256";
  private static ENCODING: "base64url";
  /**
   * Seal a value (Sign it).
   * Output: `value.signature`
   */
  static seal(value: string): string {
    const signature = createHmac(this.ALGORITHM, SECRETS[0])
      .update(value)
      .digest(this.ENCODING);
    return `${value}.${signature}`;
  }

  /**
   * Unseal and Verify a value (Supports Key Rotation).
   */
  static unseal(sealedValue: string | undefined | null): string | null {
    if (!sealedValue) return null;

    const lastDot = sealedValue.lastIndexOf(".");
    if (lastDot < 1) return null;

    const value = sealedValue.slice(0, lastDot);
    const signature = sealedValue.slice(lastDot + 1);

    let providedBuf: Buffer;
    try {
      providedBuf = Buffer.from(signature, this.ENCODING);
    } catch {
      return null;
    }

    // Check against all secrets (Rotation)
    for (const secret of SECRETS) {
      const expected = createHmac(this.ALGORITHM, secret)
        .update(value)
        .digest(this.ENCODING);
      const expectedBuf = Buffer.from(expected, this.ENCODING);

      if (
        providedBuf.length === expectedBuf.length &&
        timingSafeEqual(providedBuf, expectedBuf)
      ) {
        return value;
      }
    }

    return null;
  }

  static sealCookie(name: string, value: string): string {
    return this.seal(`${name}=${value}`);
  }

  static unsealCookie(
    name: string,
    sealedValue: string | undefined,
  ): string | null {
    const unsealed = this.unseal(sealedValue);
    const prefix = `${name}=`;
    return unsealed?.startsWith(prefix) ? unsealed.slice(prefix.length) : null;
  }

  static generateID(length = 32): string {
    return randomBytes(length).toString(this.ENCODING);
  }
}
