'use server';

import connectDB from '@/lib/db';
import { Certificate, Student, Course } from '@/models';
import { revalidatePath } from 'next/cache';

// Get all certificates
export async function getCertificates() {
    try {
        await connectDB();
        const certificates = await Certificate.find()
            .populate('studentId', 'name fatherName')
            .populate('courseId', 'name code')
            .sort({ issueDate: -1 })
            .lean();

        return JSON.parse(JSON.stringify(certificates));
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return [];
    }
}

// Get certificate by ID
export async function getCertificateById(id: string) {
    try {
        await connectDB();
        const certificate = await Certificate.findById(id)
            .populate('studentId', 'name fatherName motherName dob')
            .populate('courseId', 'name code duration')
            .lean();

        return JSON.parse(JSON.stringify(certificate));
    } catch (error) {
        console.error('Error fetching certificate:', error);
        return null;
    }
}

// Get certificate by certificate number
export async function getCertificateByCertNo(certNo: string) {
    try {
        await connectDB();
        const certificate = await Certificate.findOne({ certificateNo: certNo })
            .populate('studentId', 'name fatherName motherName dob')
            .populate('courseId', 'name code duration')
            .lean();

        return JSON.parse(JSON.stringify(certificate));
    } catch (error) {
        console.error('Error fetching certificate:', error);
        return null;
    }
}

// Create certificate
export async function createCertificate(data: any) {
    try {
        await connectDB();
        const certificate = await Certificate.create(data);

        revalidatePath('/skills/certificate');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(certificate))
        };
    } catch (error: any) {
        console.error('Error creating certificate:', error);
        return {
            success: false,
            error: error.message || 'Failed to create certificate'
        };
    }
}

// Update certificate
export async function updateCertificate(id: string, data: any) {
    try {
        await connectDB();
        const certificate = await Certificate.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!certificate) {
            return { success: false, error: 'Certificate not found' };
        }

        revalidatePath('/skills/certificate');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(certificate))
        };
    } catch (error: any) {
        console.error('Error updating certificate:', error);
        return {
            success: false,
            error: error.message || 'Failed to update certificate'
        };
    }
}

// Delete certificate
export async function deleteCertificate(id: string) {
    try {
        await connectDB();
        const certificate = await Certificate.findByIdAndDelete(id);

        if (!certificate) {
            return { success: false, error: 'Certificate not found' };
        }

        revalidatePath('/skills/certificate');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting certificate:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete certificate'
        };
    }
}
