'use server';

import connectDB from '@/lib/db';
import { ApiKey } from '@/models';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Get all API keys for a user
export async function getApiKeys(userId: string) {
    try {
        await connectDB();
        const apiKeys = await ApiKey.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(apiKeys));
    } catch (error) {
        console.error('Error fetching API keys:', error);
        return [];
    }
}

// Get API key by ID
export async function getApiKeyById(id: string, userId: string) {
    try {
        await connectDB();
        const apiKey = await ApiKey.findOne({ _id: id, userId }).lean();

        return JSON.parse(JSON.stringify(apiKey));
    } catch (error) {
        console.error('Error fetching API key:', error);
        return null;
    }
}

// Create new API key
export async function createApiKey(userId: string, name: string, permissions: string[]) {
    try {
        await connectDB();

        // Generate unique API key
        const key = `wf_${crypto.randomBytes(32).toString('hex')}`;
        const secret = crypto.randomBytes(48).toString('hex');

        const apiKey = await ApiKey.create({
            userId,
            name,
            key,
            secret,
            permissions,
            isActive: true,
            lastUsed: null
        });

        revalidatePath('/developer');
        revalidatePath('/api/keys');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(apiKey)),
            message: 'API key created successfully. Please save your secret key - it won\'t be shown again.'
        };
    } catch (error: any) {
        console.error('Error creating API key:', error);
        return {
            success: false,
            error: error.message || 'Failed to create API key'
        };
    }
}

// Update API key
export async function updateApiKey(id: string, userId: string, data: any) {
    try {
        await connectDB();

        const apiKey = await ApiKey.findOneAndUpdate(
            { _id: id, userId },
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!apiKey) {
            return { success: false, error: 'API key not found' };
        }

        revalidatePath('/developer');
        revalidatePath('/api/keys');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(apiKey))
        };
    } catch (error: any) {
        console.error('Error updating API key:', error);
        return {
            success: false,
            error: error.message || 'Failed to update API key'
        };
    }
}

// Delete API key
export async function deleteApiKey(id: string, userId: string) {
    try {
        await connectDB();

        const apiKey = await ApiKey.findOneAndDelete({ _id: id, userId });

        if (!apiKey) {
            return { success: false, error: 'API key not found' };
        }

        revalidatePath('/developer');
        revalidatePath('/api/keys');

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting API key:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete API key'
        };
    }
}

// Toggle API key status
export async function toggleApiKeyStatus(id: string, userId: string) {
    try {
        await connectDB();

        const apiKey = await ApiKey.findOne({ _id: id, userId });

        if (!apiKey) {
            return { success: false, error: 'API key not found' };
        }

        apiKey.isActive = !apiKey.isActive;
        await apiKey.save();

        revalidatePath('/developer');
        revalidatePath('/api/keys');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(apiKey)),
            message: `API key ${apiKey.isActive ? 'activated' : 'deactivated'} successfully`
        };
    } catch (error: any) {
        console.error('Error toggling API key status:', error);
        return {
            success: false,
            error: error.message || 'Failed to toggle API key status'
        };
    }
}
