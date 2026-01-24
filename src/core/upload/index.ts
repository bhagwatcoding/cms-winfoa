/**
 * File Upload Utility for Winfoa Platform
 * Handles file uploads with validation, processing, and storage
 */

import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  uploadDir: './public/uploads',
  avatarSizes: {
    thumbnail: { width: 64, height: 64 },
    small: { width: 128, height: 128 },
    medium: { width: 256, height: 256 },
    large: { width: 512, height: 512 }
  }
};

export interface UploadResult {
  success: boolean;
  fileId: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  url: string;
  variants?: {
    [key: string]: {
      fileName: string;
      filePath: string;
      url: string;
      width: number;
      height: number;
    };
  };
  error?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileInfo?: {
    size: number;
    type: string;
    extension: string;
  };
}

/**
 * Validate uploaded file
 */
export function validateFile(
  buffer: Buffer,
  originalName: string,
  allowedTypes: string[]
): FileValidationResult {
  try {
    // Check file size
    if (buffer.length > UPLOAD_CONFIG.maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of ${UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Get file extension
    const extension = path.extname(originalName).toLowerCase();
    if (!extension) {
      return {
        isValid: false,
        error: 'File must have an extension'
      };
    }

    // Detect MIME type from buffer
    const mimeType = detectMimeType(buffer);
    if (!mimeType) {
      return {
        isValid: false,
        error: 'Unable to determine file type'
      };
    }

    // Check if MIME type is allowed
    if (!allowedTypes.includes(mimeType)) {
      return {
        isValid: false,
        error: `File type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return {
      isValid: true,
      fileInfo: {
        size: buffer.length,
        type: mimeType,
        extension
      }
    };

  } catch (error) {
    return {
      isValid: false,
      error: 'File validation failed'
    };
  }
}

/**
 * Detect MIME type from buffer
 */
function detectMimeType(buffer: Buffer): string | null {
  // Check for common file signatures
  const signatures: { [key: string]: number[] } = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46],
    'application/pdf': [0x25, 0x50, 0x44, 0x46],
    'video/mp4': [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
  };

  for (const [mimeType, signature] of Object.entries(signatures)) {
    if (signature.every((byte, index) => buffer[index] === byte)) {
      return mimeType;
    }
  }

  return null;
}

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string, prefix?: string): string {
  const extension = path.extname(originalName).toLowerCase();
  const uuid = uuidv4();
  const timestamp = Date.now();

  if (prefix) {
    return `${prefix}_${timestamp}_${uuid}${extension}`;
  }

  return `${timestamp}_${uuid}${extension}`;
}

/**
 * Ensure upload directory exists
 */
export async function ensureUploadDir(subDir?: string): Promise<string> {
  const uploadPath = subDir
    ? path.join(UPLOAD_CONFIG.uploadDir, subDir)
    : UPLOAD_CONFIG.uploadDir;

  try {
    await fs.access(uploadPath);
  } catch {
    await fs.mkdir(uploadPath, { recursive: true });
  }

  return uploadPath;
}

/**
 * Save file to disk
 */
export async function saveFile(
  buffer: Buffer,
  fileName: string,
  subDir?: string
): Promise<{ filePath: string; url: string }> {
  const uploadDir = await ensureUploadDir(subDir);
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  // Generate URL (remove './public' from path for web serving)
  const url = filePath.replace('./public', '').replace(/\\/g, '/');

  return { filePath, url };
}

/**
 * Process image with Sharp (resize, optimize)
 */
export async function processImage(
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
    fit?: 'cover' | 'contain' | 'fill';
  } = {}
): Promise<Buffer> {
  const {
    width,
    height,
    quality = 80,
    format = 'jpeg',
    fit = 'cover'
  } = options;

  let processor = sharp(buffer);

  // Resize if dimensions provided
  if (width || height) {
    processor = processor.resize(width, height, { fit });
  }

  // Convert format and optimize
  switch (format) {
    case 'jpeg':
      processor = processor.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      processor = processor.png({ quality });
      break;
    case 'webp':
      processor = processor.webp({ quality });
      break;
  }

  return processor.toBuffer();
}

/**
 * Upload avatar with multiple sizes
 */
export async function uploadAvatar(
  buffer: Buffer,
  originalName: string,
  userId: string
): Promise<UploadResult> {
  try {
    // Validate image
    const validation = validateFile(buffer, originalName, UPLOAD_CONFIG.allowedImageTypes);
    if (!validation.isValid) {
      return {
        success: false,
        fileId: '',
        originalName,
        fileName: '',
        filePath: '',
        fileSize: 0,
        mimeType: '',
        url: '',
        error: validation.error
      };
    }

    const fileId = uuidv4();
    const baseFileName = `avatar_${userId}_${fileId}`;
    const subDir = `avatars/${userId}`;

    // Create variants
    const variants: any = {};

    for (const [sizeName, dimensions] of Object.entries(UPLOAD_CONFIG.avatarSizes)) {
      const processedBuffer = await processImage(buffer, {
        width: dimensions.width,
        height: dimensions.height,
        format: 'jpeg',
        quality: 85
      });

      const fileName = `${baseFileName}_${sizeName}.jpg`;
      const { filePath, url } = await saveFile(processedBuffer, fileName, subDir);

      variants[sizeName] = {
        fileName,
        filePath,
        url,
        width: dimensions.width,
        height: dimensions.height
      };
    }

    // Save original (optimized)
    const originalProcessed = await processImage(buffer, {
      format: 'jpeg',
      quality: 90
    });

    const originalFileName = `${baseFileName}_original.jpg`;
    const { filePath: originalPath, url: originalUrl } = await saveFile(
      originalProcessed,
      originalFileName,
      subDir
    );

    return {
      success: true,
      fileId,
      originalName,
      fileName: originalFileName,
      filePath: originalPath,
      fileSize: originalProcessed.length,
      mimeType: 'image/jpeg',
      url: originalUrl,
      variants
    };

  } catch (error) {
    console.error('Avatar upload error:', error);
    return {
      success: false,
      fileId: '',
      originalName,
      fileName: '',
      filePath: '',
      fileSize: 0,
      mimeType: '',
      url: '',
      error: 'Failed to process avatar upload'
    };
  }
}

/**
 * Upload course material
 */
export async function uploadCourseMaterial(
  buffer: Buffer,
  originalName: string,
  courseId: string,
  materialType: 'image' | 'document' | 'video' = 'document'
): Promise<UploadResult> {
  try {
    // Determine allowed types based on material type
    let allowedTypes: string[] = [];
    switch (materialType) {
      case 'image':
        allowedTypes = UPLOAD_CONFIG.allowedImageTypes;
        break;
      case 'document':
        allowedTypes = UPLOAD_CONFIG.allowedDocumentTypes;
        break;
      case 'video':
        allowedTypes = UPLOAD_CONFIG.allowedVideoTypes;
        break;
    }

    // Validate file
    const validation = validateFile(buffer, originalName, allowedTypes);
    if (!validation.isValid) {
      return {
        success: false,
        fileId: '',
        originalName,
        fileName: '',
        filePath: '',
        fileSize: 0,
        mimeType: '',
        url: '',
        error: validation.error
      };
    }

    const fileId = uuidv4();
    const fileName = generateFileName(originalName, `course_${courseId}`);
    const subDir = `courses/${courseId}/materials`;

    let processedBuffer = buffer;

    // Process images
    if (materialType === 'image') {
      processedBuffer = await processImage(buffer, {
        width: 1920, // Max width for course images
        quality: 85,
        format: 'jpeg'
      });
    }

    const { filePath, url } = await saveFile(processedBuffer, fileName, subDir);

    return {
      success: true,
      fileId,
      originalName,
      fileName,
      filePath,
      fileSize: processedBuffer.length,
      mimeType: validation.fileInfo!.type,
      url
    };

  } catch (error) {
    console.error('Course material upload error:', error);
    return {
      success: false,
      fileId: '',
      originalName,
      fileName: '',
      filePath: '',
      fileSize: 0,
      mimeType: '',
      url: '',
      error: 'Failed to upload course material'
    };
  }
}

/**
 * Upload certificate template
 */
export async function uploadCertificateTemplate(
  buffer: Buffer,
  originalName: string,
  templateId?: string
): Promise<UploadResult> {
  try {
    const allowedTypes = [...UPLOAD_CONFIG.allowedImageTypes, ...UPLOAD_CONFIG.allowedDocumentTypes];

    // Validate file
    const validation = validateFile(buffer, originalName, allowedTypes);
    if (!validation.isValid) {
      return {
        success: false,
        fileId: '',
        originalName,
        fileName: '',
        filePath: '',
        fileSize: 0,
        mimeType: '',
        url: '',
        error: validation.error
      };
    }

    const fileId = templateId || uuidv4();
    const fileName = generateFileName(originalName, `certificate_template`);
    const subDir = 'certificates/templates';

    const { filePath, url } = await saveFile(buffer, fileName, subDir);

    return {
      success: true,
      fileId,
      originalName,
      fileName,
      filePath,
      fileSize: buffer.length,
      mimeType: validation.fileInfo!.type,
      url
    };

  } catch (error) {
    console.error('Certificate template upload error:', error);
    return {
      success: false,
      fileId: '',
      originalName,
      fileName: '',
      filePath: '',
      fileSize: 0,
      mimeType: '',
      url: '',
      error: 'Failed to upload certificate template'
    };
  }
}

/**
 * Delete uploaded file
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
}

/**
 * Delete file with variants (like avatars)
 */
export async function deleteFileWithVariants(
  filePaths: string[]
): Promise<{ deleted: number; failed: number }> {
  let deleted = 0;
  let failed = 0;

  for (const filePath of filePaths) {
    const success = await deleteFile(filePath);
    if (success) {
      deleted++;
    } else {
      failed++;
    }
  }

  return { deleted, failed };
}

/**
 * Get file info
 */
export async function getFileInfo(filePath: string): Promise<{
  exists: boolean;
  size?: number;
  mtime?: Date;
}> {
  try {
    const stats = await fs.stat(filePath);
    return {
      exists: true,
      size: stats.size,
      mtime: stats.mtime
    };
  } catch {
    return { exists: false };
  }
}

/**
 * Clean up old files (run periodically)
 */
export async function cleanupOldFiles(
  directory: string,
  maxAgeMs: number = 30 * 24 * 60 * 60 * 1000 // 30 days
): Promise<{ deleted: number; errors: number }> {
  let deleted = 0;
  let errors = 0;

  try {
    const files = await fs.readdir(directory);
    const now = Date.now();

    for (const file of files) {
      try {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtime.getTime() > maxAgeMs) {
          await fs.unlink(filePath);
          deleted++;
        }
      } catch {
        errors++;
      }
    }
  } catch {
    errors++;
  }

  return { deleted, errors };
}

export default {
  validateFile,
  generateFileName,
  ensureUploadDir,
  saveFile,
  processImage,
  uploadAvatar,
  uploadCourseMaterial,
  uploadCertificateTemplate,
  deleteFile,
  deleteFileWithVariants,
  getFileInfo,
  cleanupOldFiles,
  UPLOAD_CONFIG
};
