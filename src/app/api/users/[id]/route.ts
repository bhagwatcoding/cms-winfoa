import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/core/db';
import { User } from '@/models';
import { requireAuth, requireRole } from '@/core/session';
import { UserStatus } from '@/core/db/enums';

// GET /api/users/[id] - Get specific user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id } = params;

    // Check permissions - users can see their own profile, admins can see all
    const isOwnProfile = currentUser.id === id;
    const isAdmin = ['admin', 'god'].includes(currentUser.role || '');

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Find user by ID or UMP ID
    const user = await User.findOne({
      $or: [{ _id: id }, { umpUserId: id }],
    })
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return different data based on permissions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userData: any = user;
    if (!isOwnProfile && !isAdmin) {
      // Limited public profile for non-admin, non-owner
      userData = {
        _id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
        joinedAt: user.joinedAt,
        avatar: user.avatar,
      };
    }

    return NextResponse.json({
      success: true,
      data: userData,
      permissions: {
        canEdit: isOwnProfile || isAdmin,
        canDelete: isAdmin && !isOwnProfile,
        canViewFull: isOwnProfile || isAdmin,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);

    if (error?.message === 'Unauthorized - Please login') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT /api/users/[id] - Update specific user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id } = params;
    const body = await request.json();

    // Check permissions
    const isOwnProfile = currentUser.id === id;
    const isAdmin = ['admin', 'god'].includes(currentUser.role || '');

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Find user
    const user = await User.findOne({
      $or: [{ _id: id }, { umpUserId: id }],
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Define allowed updates based on user role
    const allowedUpdates: Record<string, unknown> = {};

    if (isOwnProfile) {
      // Users can update their own basic profile
      const userAllowedFields = ['name', 'phone', 'avatar', 'firstName', 'lastName'];
      userAllowedFields.forEach((field) => {
        if (body[field] !== undefined) {
          allowedUpdates[field] = body[field];
        }
      });
    }

    if (isAdmin) {
      // Admins can update more fields
      const adminAllowedFields = [
        'name',
        'phone',
        'avatar',
        'firstName',
        'lastName',
        'role',
        'status',
        'isActive',
        'emailVerified',
        'walletBalance',
        'customPermissions',
        'permissionOverrides',
      ];

      adminAllowedFields.forEach((field) => {
        if (body[field] !== undefined) {
          allowedUpdates[field] = body[field];
        }
      });

      // Super-admin specific fields
      if (currentUser.role === 'god') {
        if (body.email !== undefined) allowedUpdates.email = body.email.toLowerCase();
      }
    }

    // Validate role change permissions
    if (allowedUpdates.role) {
      if (currentUser.role !== 'god' && allowedUpdates.role === 'god') {
        return NextResponse.json({ error: 'Only god can assign god role' }, { status: 403 });
      }
    }

    // Check if trying to change email to existing one
    if (allowedUpdates.email && allowedUpdates.email !== user.email) {
      const existingUser = await User.findOne({
        email: allowedUpdates.email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
    }

    // Update user
    Object.assign(user, allowedUpdates);
    user.updatedAt = new Date();
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password').lean();

    // Log the update
    console.log(`👤 User updated: ${user.email} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Update user error:', error);

    if (error?.code === 11000) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    if (error.message === 'Unauthorized - Please login') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete specific user (Admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await requireRole(['admin', 'god']);
    await connectDB();

    const { id } = params;

    // Prevent self-deletion
    if (currentUser.id === id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({
      $or: [{ _id: id }, { umpUserId: id }],
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deletion of god users by non-god users
    if (user.role === 'god' && currentUser.role !== 'god') {
      return NextResponse.json({ error: 'Only god can delete god users' }, { status: 403 });
    }

    // Soft delete - mark as inactive instead of permanent deletion
    user.isActive = false;
    user.status = UserStatus.Inactive;
    user.deletedAt = new Date();
    user.deletedBy = currentUser.id;
    await user.save();

    // Log the deletion
    console.log(`🗑️ User deleted: ${user.email} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: user._id,
        umpUserId: user.umpUserId,
        email: user.email,
        deletedAt: user.deletedAt,
      },
    });
  } catch (error: any) {
    console.error('Delete user error:', error);

    if (error?.message?.includes('Access denied') || error?.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Admin access required.' },
        { status: 403 }
      );
    }

    if (error.message === 'Unauthorized - Please login') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

// PATCH /api/users/[id] - Partial update (change password, toggle status, etc.)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { action, ...data } = body;

    // Check permissions
    const isOwnProfile = currentUser.id === id;
    const isAdmin = ['admin', 'god'].includes(currentUser.role || '');

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Find user
    const user = await User.findOne({
      $or: [{ _id: id }, { umpUserId: id }],
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let message = 'User updated successfully';

    // Handle different actions
    switch (action) {
      case 'change-password':
        if (!isOwnProfile) {
          return NextResponse.json({ error: 'Can only change your own password' }, { status: 403 });
        }

        const { currentPassword, newPassword } = data;

        if (!currentPassword || !newPassword) {
          return NextResponse.json(
            { error: 'Current password and new password are required' },
            { status: 400 }
          );
        }

        // Verify current password
        const isValidPassword = await user.comparePassword(currentPassword);
        if (!isValidPassword) {
          return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        user.password = newPassword;
        message = 'Password changed successfully';
        break;

      case 'toggle-status':
        if (!isAdmin) {
          return NextResponse.json(
            { error: 'Only admins can toggle user status' },
            { status: 403 }
          );
        }

        user.status = user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;
        user.isActive = user.status === UserStatus.Active;
        message = `User ${user.status === UserStatus.Active ? 'activated' : 'deactivated'}`;
        break;

      case 'verify-email':
        if (!isAdmin) {
          return NextResponse.json({ error: 'Only admins can verify emails' }, { status: 403 });
        }

        user.emailVerified = true;
        message = 'Email verified successfully';
        break;

      case 'reset-wallet':
        if (currentUser.role !== 'god') {
          return NextResponse.json({ error: 'Only god can reset wallet balance' }, { status: 403 });
        }

        user.walletBalance = 0;
        message = 'Wallet balance reset to 0';
        break;

      default:
        return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password').lean();

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message,
      action,
    });
  } catch (error: any) {
    console.error('Patch user error:', error);

    if (error?.message === 'Unauthorized - Please login') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
