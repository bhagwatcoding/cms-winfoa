'use server';

import connectDB from '@/lib/db';
import { Certificate } from '@/models';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';
import { createCertificateSchema, updateCertificateSchema } from '@/lib/validations';
import { validateSchema } from '@/lib/validations/utils';

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
export async function createCertificate(data: unknown) {
    try {
        await connectDB();
        // Validate input
        const validation = validateSchema(createCertificateSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const certificate = await Certificate.create(validation.data!);

        revalidatePath('/skills/certificate');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(certificate))
        };
    } catch (error) {
        console.error('Error creating certificate:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to create certificate'
        };
    }
}

// Update certificate
export async function updateCertificate(id: string, data: unknown) {
    try {
        await connectDB();
        // Validate input
        const validation = validateSchema(updateCertificateSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const certificate = await Certificate.findByIdAndUpdate(
            id,
            { $set: validation.data },
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
    } catch (error) {
        console.error('Error updating certificate:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to update certificate'
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
    } catch (error) {
        console.error('Error deleting certificate:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to delete certificate'
        };
    }
}
