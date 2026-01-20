"use server";

import { UserService } from "@/services/user.service";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// 1. Fetch Users (Auto-detects God Mode)
export async function getUsersAction() {
  try {
    const users = await UserService.getAllUsers();

    // Check if we are in God Mode to return extra metadata for UI
    const headerStore = await headers();
    const isGod = headerStore.get("x-god-mode") === "true";

    return { success: true, data: users, isGod };
  } catch {
    return { success: false, error: "Failed to fetch users" };
  }
}

// 2. Delete User (Standard Soft Delete)
export async function deleteUserAction(targetUserId: string) {
  // In a real app, get 'currentUserId' from your session
  const currentUserId = "65a000000000000000000001";

  try {
    await UserService.deleteUser(currentUserId, targetUserId);
    revalidatePath("/"); // Refresh the UI
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error.message };
  }
}

// 3. Restore User (God Only)
export async function restoreUserAction(targetUserId: string) {
  const currentUserId = "65a000000000000000000001";

  try {
    await UserService.restoreUser(currentUserId, targetUserId);
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error.message }; // Will fail if not on God domain
  }
}
