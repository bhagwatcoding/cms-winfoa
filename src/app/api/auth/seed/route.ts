import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import Role from '@/models/core/Role';
import bcrypt from 'bcryptjs';
import { seedDefaultRoles } from '@/shared/actions/roles/seed';
import { UserStatus } from '@/core/types';

export async function GET() {
  try {
    await connectDB();

    // 1. Seed Roles first
    await seedDefaultRoles();

    // 2. Seed God User
    const email = 'god@admin.com';
    const password = 'Admin@123'; // Meets complexity requirements

    // Find God Role
    const godRole = await Role.findOne({ slug: 'god' });
    if (!godRole) throw new Error('God Role not found even after seeding');

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);

      user = await User.create({
        firstName: 'Mr',
        lastName: 'God',
        email,
        password: hashedPassword,
        roleId: godRole._id, // Link to Role
        isGod: true, // God Mode
        status: UserStatus.Active,
        emailVerified: true,
        customPermissions: ['*:*'], // Wildcard permission just in case
      });

      return NextResponse.json({
        message: '✅ God User Created',
        credentials: { email, password },
      });
    }

    // Ensure existing user has correct role/god status
    user.roleId = godRole._id;
    user.isGod = true;
    await user.save();

    return NextResponse.json({
      message: 'ℹ️ God User already exists (Updated Permissions)',
      credentials: { email, password: '[HIDDEN]' },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
