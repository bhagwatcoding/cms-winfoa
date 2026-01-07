import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/edu/User';
import Student from '@/lib/models/edu/Student'; // If registering as student creates a student record
import Employee from '@/lib/models/edu/Employee'; // If registering as employee
import crypto from 'crypto';
import Session from '@/lib/models/edu/Session';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, password, name, phone, role } = body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        // Map UI roles to DB roles
        let userRole = 'student';
        if (role === 'Center Admin') userRole = 'admin';
        else if (role === 'Employee') userRole = 'staff';
        else if (role === 'student' || role === 'Student') userRole = 'student';

        // Prevent creating super-admin via public API
        if (role === 'super-admin' || userRole === 'super-admin') {
            return NextResponse.json({ error: 'Cannot create super-admin' }, { status: 403 });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            name,
            phone,
            role: userRole,
            status: 'active',
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
            userAgent: request.headers.get('user-agent') || 'unknown',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        });

        (await cookies()).set('auth_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/',
        });

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}
