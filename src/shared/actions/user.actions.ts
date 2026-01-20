"use server";

import { User } from "@/models";
import { ActivityLogger } from "@/services/activity.service";
import { ActionType, ResourceType } from "@/types";
import connectDB from "@/lib/db";

export async function updateUserRole(
  adminId: string,
  targetUserId: string,
  newRole: string,
) {
  await connectDB();

  // 1. Fetch current state (for audit trail)
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw new Error("User not found");

  const oldRole = targetUser.role;

  // 2. Perform Update
  targetUser.role = newRole;
  await targetUser.save();

  // 3. TRACK ACTIVITY 🛡️
  await ActivityLogger.log(
    adminId, // Who did it?
    ActionType.UPDATE, // What action?
    ResourceType.USER, // On what resource?
    `Changed role for ${targetUser.email}`, // Human readable
    targetUserId, // Target ID
    {
      // Metadata (Snapshots)
      field: "role",
      before: oldRole,
      after: newRole,
    },
  );

  return { success: true };
}
