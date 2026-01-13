import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/lib/db";
import { requireAuth, requireRole } from "@/shared/lib/session";
import {
  uploadAvatar,
  uploadCourseMaterial,
  uploadCertificateTemplate,
  UPLOAD_CONFIG
} from "@/shared/lib/upload";

// POST /api/upload - Universal file upload endpoint
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string;
    const targetId = formData.get('targetId') as string;
    const materialType = formData.get('materialType') as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!uploadType) {
      return NextResponse.json(
        { error: "Upload type is required (avatar, course-material, certificate-template)" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let result;

    switch (uploadType) {
      case 'avatar':
        // Users can upload their own avatar, admins can upload for others
        const avatarUserId = targetId || currentUser.id;

        if (avatarUserId !== currentUser.id) {
          await requireRole(['admin', 'super-admin']);
        }

        result = await uploadAvatar(buffer, file.name, avatarUserId);
        break;

      case 'course-material':
        if (!targetId) {
          return NextResponse.json(
            { error: "Course ID is required for course material upload" },
            { status: 400 }
          );
        }

        // Check if user can upload to this course
        const isAdmin = ['admin', 'super-admin', 'staff'].includes(currentUser.role);
        if (!isAdmin) {
          // TODO: Check if user is instructor of this course
          // For now, only allow admins to upload course materials
          await requireRole(['admin', 'super-admin', 'staff']);
        }

        result = await uploadCourseMaterial(
          buffer,
          file.name,
          targetId,
          (materialType as any) || 'document'
        );
        break;

      case 'certificate-template':
        // Only admins can upload certificate templates
        await requireRole(['admin', 'super-admin']);

        result = await uploadCertificateTemplate(buffer, file.name, targetId);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid upload type. Supported types: avatar, course-material, certificate-template" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "File upload failed" },
        { status: 400 }
      );
    }

    // Log upload
    console.log(`📎 File uploaded: ${uploadType} by ${currentUser.email} - ${file.name}`);

    return NextResponse.json({
      success: true,
      data: {
        fileId: result.fileId,
        fileName: result.fileName,
        originalName: result.originalName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
        url: result.url,
        variants: result.variants,
        uploadType,
        uploadedBy: currentUser.id,
        uploadedAt: new Date().toISOString()
      },
      message: "File uploaded successfully"
    });

  } catch (error: any) {
    console.error("File upload error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions for this upload type" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}

// GET /api/upload - Get upload configuration and limits
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const config = {
      maxFileSize: UPLOAD_CONFIG.maxFileSize,
      maxFileSizeMB: UPLOAD_CONFIG.maxFileSize / (1024 * 1024),
      allowedTypes: {
        images: UPLOAD_CONFIG.allowedImageTypes,
        documents: UPLOAD_CONFIG.allowedDocumentTypes,
        videos: UPLOAD_CONFIG.allowedVideoTypes
      },
      avatarSizes: UPLOAD_CONFIG.avatarSizes,
      supportedUploadTypes: [
        {
          type: 'avatar',
          description: 'Profile picture upload',
          allowedFormats: UPLOAD_CONFIG.allowedImageTypes,
          maxSize: '5MB',
          generates: 'Multiple sizes (thumbnail, small, medium, large)'
        },
        {
          type: 'course-material',
          description: 'Course materials (documents, images, videos)',
          allowedFormats: [
            ...UPLOAD_CONFIG.allowedImageTypes,
            ...UPLOAD_CONFIG.allowedDocumentTypes,
            ...UPLOAD_CONFIG.allowedVideoTypes
          ],
          maxSize: '10MB',
          generates: 'Optimized version'
        },
        {
          type: 'certificate-template',
          description: 'Certificate template upload',
          allowedFormats: [
            ...UPLOAD_CONFIG.allowedImageTypes,
            ...UPLOAD_CONFIG.allowedDocumentTypes
          ],
          maxSize: '5MB',
          generates: 'Original file'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: config
    });

  } catch (error: any) {
    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch upload configuration" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
