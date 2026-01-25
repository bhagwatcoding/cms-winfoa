import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Session } from '@/models';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SESSION, VALIDATION } from '@/config';
import { HeaderStore } from '@/core/helpers/headerStore.healper';
import { LoginMethod, RiskLevel, SessionStatus } from '@/shared/types';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password, name, phone, role } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          error: 'Email, password, and name are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = VALIDATION.REGEX.EMAIL;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < VALIDATION.LENGTH.MIN.PASSWORD) {
      return NextResponse.json(
        {
          error: 'Password must be at least 6 characters',
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        {
          error: 'Email already registered',
        },
        { status: 400 }
      );
    }

    // Map UI roles to DB roles
    let userRole = 'student';
    if (role === 'center' || role === 'Center Admin') userRole = 'center';
    else if (role === 'staff' || role === 'Employee') userRole = 'staff';
    else if (role === 'student' || role === 'Student') userRole = 'student';

    // Prevent creating super-admin via public API
    if (role === 'super-admin' || userRole === 'super-admin') {
      return NextResponse.json(
        {
          error: 'Cannot create super-admin',
        },
        { status: 403 }
      );
    }

    // Hash password before creating user
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with hashed password
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim(),
      phone: phone?.trim() || '',
      role: userRole,
      status: 'active',
      isActive: true,
      emailVerified: false,
      joinedAt: new Date(),
    });

    // Auto-create related profile based on role (optional automation)
    // For now we just create the User account.
    // In a real app, you might want transactional creation of Student/Employee records here.

    // Auto login after signup
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Session.create({
      token,
      userId: user._id,
      expiresAt,
      deviceInfo: {
        device: (await HeaderStore.device(req)) || '',
        os: (await HeaderStore.os(req)) || '',
        browser: (await HeaderStore.browser(req)) || '',
        type: await HeaderStore.deviceType(req),
        isMobile: (await HeaderStore.isMobile(req)) || false,
        deviceId: (await HeaderStore.deviceId(req)) || '',
      },
      geoInfo: {
        ip: (await HeaderStore.ip(req)) || '',
        country: (await HeaderStore.country(req)) || '',
        countryCode: (await HeaderStore.countryCode(req)) || '',
        city: (await HeaderStore.city(req)) || '',
        timezone: (await HeaderStore.timezone(req)) || '',
        coordinates: (await HeaderStore.coordinates(req)) || { lat: 0, lang: 0 },
        isp: (await HeaderStore.isp(req)) || '',
      },
      securityInfo: {
        loginMethod: LoginMethod.Password,
        riskScore: 0,
        riskLevel: RiskLevel.Low,
        isVerified: false,
        failedAttempts: 0,
      },
      isActive: true,
      status: SessionStatus.Active,
      lastAccessedAt: new Date(),
    });

    (await cookies()).set(SESSION.COOKIE.NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
