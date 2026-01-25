/**
 * God Subdomain Actions
 * Server actions for god/super-admin functionality
 */

'use server';

import { connectDB } from '@/lib/db';
import { requireRole } from '@/core/auth';
import { User } from '@/models';

export async function getSystemStats() {
  await requireRole(['super-admin', 'god']);
  await connectDB();

  const [totalUsers, activeUsers] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    User.countDocuments({ status: 'active', isDeleted: false }),
  ]);

  return {
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
    },
  };
}

export async function getAllUsers(params?: { page?: number; limit?: number }) {
  await requireRole(['super-admin', 'god']);
  await connectDB();

  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({ isDeleted: false }).select('-password').skip(skip).limit(limit).lean(),
    User.countDocuments({ isDeleted: false }),
  ]);

  return {
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
