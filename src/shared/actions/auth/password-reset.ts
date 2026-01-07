'use server';

import connectDB from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';

// Request password reset
export async function requestPasswordReset(email: string) {
    try {
        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists
            return {
                success: true,
                message: 'If the email exists, a reset link has been sent.'
            };
        }

        // Generate reset token (simplified - in production use crypto)
        const resetToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // TODO: Send email with reset link
        console.log(`Password reset token for ${email}: ${resetToken}`);

        return {
            success: true,
            message: 'Password reset link sent to your email.'
        };
    } catch (error: any) {
        console.error('Password reset request error:', error);
        return {
            success: false,
            error: error.message || 'Failed to process request'
        };
    }
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string) {
    try {
        await connectDB();

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return {
                success: false,
                error: 'Invalid or expired reset token'
            };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return {
            success: true,
            message: 'Password reset successfully'
        };
    } catch (error: any) {
        console.error('Password reset error:', error);
        return {
            success: false,
            error: error.message || 'Failed to reset password'
        };
    }
}

// Change password (for logged-in users)
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
        await connectDB();

        const user = await User.findById(userId).select('+password');

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);

        if (!isValid) {
            return {
                success: false,
                error: 'Current password is incorrect'
            };
        }

        // Hash and save new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return {
            success: true,
            message: 'Password changed successfully'
        };
    } catch (error: any) {
        console.error('Change password error:', error);
        return {
            success: false,
            error: error.message || 'Failed to change password'
        };
    }
}
