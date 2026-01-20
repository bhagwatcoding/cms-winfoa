import "server-only";
import { headers } from "next/headers";
import { User, IUser, ActivityLog } from "@/models";
import { ActionType, ResourceType } from "@/types";
import connectDB from "@/lib/db"; // Your DB connector

// Configuration
const GOD_SUBDOMAIN = "god"; // e.g., god.example.com

export class UserService {
  /**
   * Helper: Checks if current request is from God Subdomain
   */
  private static async isGodMode(): Promise<boolean> {
    const headerStore = await headers();
    const host = headerStore.get("host") || ""; // e.g. "god.myapp.com"
    return host.startsWith(`${GOD_SUBDOMAIN}.`);
  }

  /**
   * 1. GET ALL USERS
   * Logic:
   * - Normal Domain: Returns only { isDeleted: false }
   * - God Domain: Returns ALL users (Active + Deleted)
   */
  static async getAllUsers() {
    await connectDB();
    const isGod = await this.isGodMode();

    // Query Filter
    const query = isGod ? {} : { isDeleted: false };

    return User.find(query).select("-password").lean();
  }

  /**
   * 2. DELETE USER (Soft Delete)
   * Logic: Sets isDeleted = true. Does NOT remove from DB.
   */
  static async deleteUser(actorId: string, targetUserId: string) {
    await connectDB();

    // Prevent deleting the God User himself
    const target = await User.findById(targetUserId);
    if (target?.isGod) throw new Error("Cannot delete a God user");

    // Perform Soft Delete
    const updatedUser = await User.findByIdAndUpdate(targetUserId, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: actorId,
    });

    // Log Activity
    await ActivityLog.create({
      actorId,
      action: ActionType.SOFT_DELETE,
      resource: ResourceType.USER,
      resourceId: targetUserId,
      details: "User deleted their account (Soft Delete)",
    });

    return updatedUser;
  }

  /**
   * 3. RESTORE USER (God Mode Only)
   * Logic: Only accessible via God Subdomain
   */
  static async restoreUser(actorId: string, targetUserId: string) {
    await connectDB();

    if (!(await this.isGodMode())) {
      throw new Error("Unauthorized: Only God Subdomain can restore users");
    }

    await User.findByIdAndUpdate(targetUserId, {
      isDeleted: false,
      $unset: { deletedAt: 1, deletedBy: 1 }, // Remove fields
    });

    await ActivityLog.create({
      actorId,
      action: ActionType.RESTORE,
      resource: ResourceType.USER,
      resourceId: targetUserId,
      details: "God restored this user",
    });
  }
}
