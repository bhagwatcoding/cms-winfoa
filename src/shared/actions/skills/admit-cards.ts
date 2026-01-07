'use server';

import connectDB from '@/lib/db';
import { AdmitCard, Student, Course } from '@/models';
import { revalidatePath } from 'next/cache';

// Get all admit cards
export async function getAdmitCards() {
    try {
        await connectDB();
        const admitCards = await AdmitCard.find()
            .populate('studentId', 'name fatherName')
            .populate('courseId', 'name code')
            .sort({ examDate: -1 })
            .lean();

        return JSON.parse(JSON.stringify(admitCards));
    } catch (error) {
        console.error('Error fetching admit cards:', error);
        return [];
    }
}

// Get admit card by ID
export async function getAdmitCardById(id: string) {
    try {
        await connectDB();
        const admitCard = await AdmitCard.findById(id)
            .populate('studentId', 'name fatherName motherName dob profileImage')
            .populate('courseId', 'name code duration')
            .lean();

        return JSON.parse(JSON.stringify(admitCard));
    } catch (error) {
        console.error('Error fetching admit card:', error);
        return null;
    }
}

// Get admit card by admit card number
export async function getAdmitCardByNumber(admitCardNo: string) {
    try {
        await connectDB();
        const admitCard = await AdmitCard.findOne({ admitCardNo })
            .populate('studentId', 'name fatherName motherName dob profileImage')
            .populate('courseId', 'name code duration')
            .lean();

        return JSON.parse(JSON.stringify(admitCard));
    } catch (error) {
        console.error('Error fetching admit card:', error);
        return null;
    }
}

// Create admit card
export async function createAdmitCard(data: any) {
    try {
        await connectDB();
        const admitCard = await AdmitCard.create(data);

        revalidatePath('/skills/admit-card');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(admitCard))
        };
    } catch (error: any) {
        console.error('Error creating admit card:', error);
        return {
            success: false,
            error: error.message || 'Failed to create admit card'
        };
    }
}

// Update admit card
export async function updateAdmitCard(id: string, data: any) {
    try {
        await connectDB();
        const admitCard = await AdmitCard.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!admitCard) {
            return { success: false, error: 'Admit card not found' };
        }

        revalidatePath('/skills/admit-card');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(admitCard))
        };
    } catch (error: any) {
        console.error('Error updating admit card:', error);
        return {
            success: false,
            error: error.message || 'Failed to update admit card'
        };
    }
}

// Delete admit card
export async function deleteAdmitCard(id: string) {
    try {
        await connectDB();
        const admitCard = await AdmitCard.findByIdAndDelete(id);

        if (!admitCard) {
            return { success: false, error: 'Admit card not found' };
        }

        revalidatePath('/skills/admit-card');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting admit card:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete admit card'
        };
    }
}
