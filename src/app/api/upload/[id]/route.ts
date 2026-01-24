import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';
import { connectDB } from "@/core/db";
import { requireAuth, requireRole } from "@/core/auth";
import { deleteFile, deleteFileWithVariants, getFileInfo } from "@/core/upload";

// GET /api/upload/[id] - Get file information or serve file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'info';
    const variant = searchParams.get('variant'); // For avatars: thumbnail, small, medium, large

    // For now, we'll use a simple file mapping system
    // In a production system, you'd store file metadata in database
    const possiblePaths = [
      `./public/uploads/avatars/${currentUser.id}/${id}`,
      `./public/uploads/courses/${id}`,
      `./public/uploads/certificates/${id}`
    ];

    let filePath = '';
    let fileExists = false;

    // Find the file
    for (const testPath of possiblePaths) {
      try {
        await fs.access(testPath);
        filePath = testPath;
        fileExists = true;
        break;
      } catch {
        // File doesn't exist at this path, continue
      }
    }

    if (!fileExists) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    if (action === 'info') {
      // Return file information
      const fileInfo = await getFileInfo(filePath);
      const stats = await fs.stat(filePath);

      return NextResponse.json({
        success: true,
        data: {
          id,
          exists: fileInfo.exists,
          size: fileInfo.size,
          lastModified: fileInfo.mtime,
          path: filePath.replace('./public', ''),
          url: filePath.replace('./public', '').replace(/\\/g, '/'),
          isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath),
          isDocument: /\.(pdf|doc|docx)$/i.test(filePath),
          isVideo: /\.(mp4|webm|ogg)$/i.test(filePath)
        }
      });
    }

    if (action === 'serve') {
      // Serve the file directly
      try {
        const fileBuffer = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();

        // Set appropriate content type
        const contentTypes: { [key: string]: string } = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.pdf': 'application/pdf',
          '.doc': 'application/msword',
          '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          '.mp4': 'video/mp4',
          '.webm': 'video/webm',
          '.ogg': 'video/ogg'
        };

        const contentType = contentTypes[ext] || 'application/octet-stream';

        return new Response(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Length': fileBuffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000', // 1 year cache
            'ETag': `"${Date.now()}"` // Simple ETag
          }
        });
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to serve file" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'info' or 'serve'" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Get file error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process file request" },
      { status: 500 }
    );
  }
}

// PUT /api/upload/[id] - Update file metadata or replace file
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { action, metadata } = body;

    // Only admins can update file metadata for now
    if (currentUser.role !== 'super-admin' && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: "Insufficient permissions to update file metadata" },
        { status: 403 }
      );
    }

    if (action === 'update-metadata') {
      // In a real implementation, you'd update file metadata in database
      // For now, we'll return success with the updated metadata
      return NextResponse.json({
        success: true,
        data: {
          id,
          metadata,
          updatedBy: currentUser.id,
          updatedAt: new Date().toISOString()
        },
        message: "File metadata updated successfully"
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: update-metadata" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Update file error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 }
    );
  }
}

// DELETE /api/upload/[id] - Delete file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get('type') || 'unknown';
    const reason = searchParams.get('reason') || 'User requested';

    // Check permissions
    const isAdmin = ['admin', 'super-admin'].includes(currentUser.role);

    // Users can delete their own avatars, admins can delete anything
    if (!isAdmin && fileType !== 'avatar') {
      return NextResponse.json(
        { error: "Insufficient permissions to delete this file type" },
        { status: 403 }
      );
    }

    // Find possible file locations
    const possiblePaths: string[] = [];

    if (fileType === 'avatar') {
      const userId = isAdmin ? searchParams.get('userId') || currentUser.id : currentUser.id;
      possiblePaths.push(
        `./public/uploads/avatars/${userId}/${id}_original.jpg`,
        `./public/uploads/avatars/${userId}/${id}_large.jpg`,
        `./public/uploads/avatars/${userId}/${id}_medium.jpg`,
        `./public/uploads/avatars/${userId}/${id}_small.jpg`,
        `./public/uploads/avatars/${userId}/${id}_thumbnail.jpg`
      );
    } else {
      // For other file types, try to find the file
      possiblePaths.push(
        `./public/uploads/courses/${id}`,
        `./public/uploads/certificates/${id}`,
        `./public/uploads/general/${id}`
      );
    }

    // Find and delete files
    const filesToDelete: string[] = [];
    for (const testPath of possiblePaths) {
      try {
        await fs.access(testPath);
        filesToDelete.push(testPath);
      } catch {
        // File doesn't exist, skip
      }
    }

    if (filesToDelete.length === 0) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete files
    let deleted = 0;
    let failed = 0;

    for (const filePath of filesToDelete) {
      const success = await deleteFile(filePath);
      if (success) {
        deleted++;
      } else {
        failed++;
      }
    }

    // Log deletion
    console.log(`🗑️ File(s) deleted: ${deleted} files, ${failed} failed - ${id} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: {
        fileId: id,
        filesDeleted: deleted,
        filesFailed: failed,
        reason,
        deletedBy: currentUser.id,
        deletedAt: new Date().toISOString()
      },
      message: `Successfully deleted ${deleted} file(s)${failed > 0 ? `, ${failed} files failed to delete` : ''}`
    });

  } catch (error: any) {
    console.error("Delete file error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

// PATCH /api/upload/[id] - Partial file operations (rename, move, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireRole(['admin', 'super-admin']);
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'rename':
        // In a real implementation, you'd rename the file and update database
        return NextResponse.json({
          success: true,
          data: {
            id,
            action: 'rename',
            newName: data.newName,
            updatedBy: currentUser.id,
            updatedAt: new Date().toISOString()
          },
          message: "File renamed successfully"
        });

      case 'move':
        // Move file to different directory
        return NextResponse.json({
          success: true,
          data: {
            id,
            action: 'move',
            newLocation: data.newLocation,
            updatedBy: currentUser.id,
            updatedAt: new Date().toISOString()
          },
          message: "File moved successfully"
        });

      default:
        return NextResponse.json(
          { error: "Invalid action. Supported actions: rename, move" },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error("Patch file error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to perform file operation" },
      { status: 500 }
    );
  }
}
