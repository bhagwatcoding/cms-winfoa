'use server';

import { connectDB } from '@/core/db';
import { User, Session } from '@/models';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getDashboardUrlForRole } from '@/core/helpers';
import { getErrorMessage } from '@/core/utils';
// import type { SignupData } from '@/core/utils/interface'; // Removed

interface SignupData {
  name?: string;
  email: string;
  password: string;
  phone?: string;
}

import Role from '@/models/core/Role';
import { SESSION } from '@/config';
import { UserStatus } from '@/core/db/enums';
import { IUser } from '@/core/db/interfaces';

export async function signupUser(data: SignupData) {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return {
        success: false,
        error: 'Email already registered',
      };
    }

    // 1. Force DEFAULT 'user' role for all new signups
    // Security: Never blindly trust data.role from client
    const defaultRole = await Role.findOne({ slug: 'user' });

    // If 'user' role doesn't exist (e.g. not created in God portal yet),
    // we must block signup or create it. Ideally, block and warn admin.
    let roleId;
    if (!defaultRole) {
      // Fallback: Create basic user role if missing (Self-healing)
      const newRole = await Role.create({
        name: 'User',
        slug: 'user',
        description: 'Basic user access',
        permissions: [],
        isSystem: true,
        priority: 10,
      });
      // Use the newly created role
      roleId = newRole._id;
    } else {
      roleId = defaultRole._id;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = (await User.create({
      firstName: data.name?.split(' ')[0] || 'User',
      lastName: data.name?.split(' ').slice(1).join(' ') || '',
      email: data.email,
      password: hashedPassword,
      phone: data.phone || '',
      roleId: roleId, // Link to Role Document
      status: UserStatus.Active,
      isGod: false, // Explicitly false
      // joinedAt is handled by timestamps
    })) as unknown as IUser;

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Session.create({
      userId: user._id,
      token: sessionToken,
      expiresAt,
    });

    // Set cookie (match proxy's expected cookie name: auth_session)
    (await cookies()).set(SESSION.COOKIE.NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
      domain:
        process.env.NODE_ENV === 'production'
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
    });

    // Get role-based dashboard URL
    const redirectUrl = getDashboardUrlForRole('user'); // Always user dashboard

    return {
      success: true,
      redirectUrl,
      user: {
        id: user._id.toString(),
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        role: 'user',
      },
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || 'Signup failed',
    };
  }
}

function generateSessionToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}
