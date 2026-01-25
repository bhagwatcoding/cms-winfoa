import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, PasswordResetToken } from '@/models';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found to prevent enumeration
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt,
    });

    // In a real application, send email here
    console.log(`Reset token for ${email}: ${token}`);

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
