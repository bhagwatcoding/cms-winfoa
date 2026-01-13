/**
 * Certificate Generation Utility for Winfoa Platform
 * Generates PDF certificates using PDF-lib
 */

import { PDFDocument, PDFFont, PDFPage, RGB, StandardFonts } from 'pdf-lib';

export interface CertificateData {
  studentName: string;
  courseName: string;
  courseCode: string;
  completionDate: string;
  instructorName: string;
  certificateId: string;
  grade?: number;
  institutionName?: string;
  institutionLogo?: Buffer;
  templateType?: 'standard' | 'premium' | 'custom';
}

export interface CertificateTemplate {
  name: string;
  width: number;
  height: number;
  background?: RGB;
  watermark?: string;
  layout: {
    title: { x: number; y: number; fontSize: number; color?: RGB };
    studentName: { x: number; y: number; fontSize: number; color?: RGB };
    courseInfo: { x: number; y: number; fontSize: number; color?: RGB };
    completionDate: { x: number; y: number; fontSize: number; color?: RGB };
    instructor: { x: number; y: number; fontSize: number; color?: RGB };
    certificateId: { x: number; y: number; fontSize: number; color?: RGB };
    logo?: { x: number; y: number; width: number; height: number };
  };
}

// Predefined certificate templates
export const CERTIFICATE_TEMPLATES: Record<string, CertificateTemplate> = {
  standard: {
    name: 'Standard Certificate',
    width: 792, // 11 inches * 72 DPI
    height: 612, // 8.5 inches * 72 DPI
    background: { r: 0.98, g: 0.98, b: 0.98 }, // Light gray
    layout: {
      title: { x: 396, y: 500, fontSize: 28, color: { r: 0.2, g: 0.4, b: 0.8 } },
      studentName: { x: 396, y: 400, fontSize: 24, color: { r: 0.1, g: 0.1, b: 0.1 } },
      courseInfo: { x: 396, y: 350, fontSize: 16, color: { r: 0.3, g: 0.3, b: 0.3 } },
      completionDate: { x: 396, y: 300, fontSize: 14, color: { r: 0.4, g: 0.4, b: 0.4 } },
      instructor: { x: 200, y: 150, fontSize: 12, color: { r: 0.2, g: 0.2, b: 0.2 } },
      certificateId: { x: 600, y: 150, fontSize: 12, color: { r: 0.2, g: 0.2, b: 0.2 } },
      logo: { x: 50, y: 500, width: 100, height: 100 }
    }
  },
  premium: {
    name: 'Premium Certificate',
    width: 792,
    height: 612,
    background: { r: 1, g: 1, b: 1 }, // White
    layout: {
      title: { x: 396, y: 480, fontSize: 32, color: { r: 0.8, g: 0.6, b: 0.2 } },
      studentName: { x: 396, y: 380, fontSize: 26, color: { r: 0.1, g: 0.1, b: 0.1 } },
      courseInfo: { x: 396, y: 330, fontSize: 18, color: { r: 0.2, g: 0.2, b: 0.2 } },
      completionDate: { x: 396, y: 280, fontSize: 16, color: { r: 0.3, g: 0.3, b: 0.3 } },
      instructor: { x: 200, y: 120, fontSize: 14, color: { r: 0.1, g: 0.1, b: 0.1 } },
      certificateId: { x: 600, y: 120, fontSize: 14, color: { r: 0.1, g: 0.1, b: 0.1 } },
      logo: { x: 50, y: 480, width: 120, height: 120 }
    }
  },
  custom: {
    name: 'Custom Certificate',
    width: 842, // A4 width
    height: 595, // A4 height
    background: { r: 0.95, g: 0.95, b: 1 }, // Light blue
    layout: {
      title: { x: 421, y: 480, fontSize: 30, color: { r: 0.1, g: 0.3, b: 0.7 } },
      studentName: { x: 421, y: 400, fontSize: 24, color: { r: 0, g: 0, b: 0 } },
      courseInfo: { x: 421, y: 350, fontSize: 16, color: { r: 0.2, g: 0.2, b: 0.2 } },
      completionDate: { x: 421, y: 300, fontSize: 14, color: { r: 0.4, g: 0.4, b: 0.4 } },
      instructor: { x: 200, y: 150, fontSize: 12, color: { r: 0.2, g: 0.2, b: 0.2 } },
      certificateId: { x: 650, y: 150, fontSize: 12, color: { r: 0.2, g: 0.2, b: 0.2 } },
      logo: { x: 60, y: 480, width: 80, height: 80 }
    }
  }
};

/**
 * Generate certificate PDF
 */
export async function generateCertificate(
  certificateData: CertificateData,
  templateName: keyof typeof CERTIFICATE_TEMPLATES = 'standard'
): Promise<Buffer> {
  try {
    const template = CERTIFICATE_TEMPLATES[templateName];
    if (!template) {
      throw new Error(`Certificate template '${templateName}' not found`);
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page with template dimensions
    const page = pdfDoc.addPage([template.width, template.height]);

    // Embed fonts
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Set background color
    if (template.background) {
      page.drawRectangle({
        x: 0,
        y: 0,
        width: template.width,
        height: template.height,
        color: template.background,
      });
    }

    // Draw decorative border
    drawBorder(page, template);

    // Draw certificate title
    const titleText = 'CERTIFICATE OF COMPLETION';
    page.drawText(titleText, {
      x: template.layout.title.x - (titleFont.widthOfTextAtSize(titleText, template.layout.title.fontSize) / 2),
      y: template.layout.title.y,
      size: template.layout.title.fontSize,
      font: titleFont,
      color: template.layout.title.color,
    });

    // Draw "This is to certify that" text
    const certifyText = 'This is to certify that';
    page.drawText(certifyText, {
      x: template.layout.studentName.x - (regularFont.widthOfTextAtSize(certifyText, 16) / 2),
      y: template.layout.studentName.y + 40,
      size: 16,
      font: regularFont,
      color: { r: 0.3, g: 0.3, b: 0.3 },
    });

    // Draw student name
    page.drawText(certificateData.studentName, {
      x: template.layout.studentName.x - (titleFont.widthOfTextAtSize(certificateData.studentName, template.layout.studentName.fontSize) / 2),
      y: template.layout.studentName.y,
      size: template.layout.studentName.fontSize,
      font: titleFont,
      color: template.layout.studentName.color,
    });

    // Draw underline for student name
    const nameWidth = titleFont.widthOfTextAtSize(certificateData.studentName, template.layout.studentName.fontSize);
    page.drawLine({
      start: { x: template.layout.studentName.x - (nameWidth / 2) - 20, y: template.layout.studentName.y - 10 },
      end: { x: template.layout.studentName.x + (nameWidth / 2) + 20, y: template.layout.studentName.y - 10 },
      thickness: 2,
      color: template.layout.studentName.color,
    });

    // Draw "has successfully completed" text
    const completedText = 'has successfully completed';
    page.drawText(completedText, {
      x: template.layout.courseInfo.x - (regularFont.widthOfTextAtSize(completedText, 14) / 2),
      y: template.layout.courseInfo.y + 20,
      size: 14,
      font: regularFont,
      color: { r: 0.3, g: 0.3, b: 0.3 },
    });

    // Draw course information
    const courseText = `${certificateData.courseName} (${certificateData.courseCode})`;
    page.drawText(courseText, {
      x: template.layout.courseInfo.x - (regularFont.widthOfTextAtSize(courseText, template.layout.courseInfo.fontSize) / 2),
      y: template.layout.courseInfo.y,
      size: template.layout.courseInfo.fontSize,
      font: regularFont,
      color: template.layout.courseInfo.color,
    });

    // Draw completion date
    const dateText = `Completed on ${certificateData.completionDate}`;
    page.drawText(dateText, {
      x: template.layout.completionDate.x - (regularFont.widthOfTextAtSize(dateText, template.layout.completionDate.fontSize) / 2),
      y: template.layout.completionDate.y,
      size: template.layout.completionDate.fontSize,
      font: italicFont,
      color: template.layout.completionDate.color,
    });

    // Draw grade if provided
    if (certificateData.grade) {
      const gradeText = `Final Grade: ${certificateData.grade}%`;
      page.drawText(gradeText, {
        x: template.layout.completionDate.x - (regularFont.widthOfTextAtSize(gradeText, 12) / 2),
        y: template.layout.completionDate.y - 25,
        size: 12,
        font: regularFont,
        color: { r: 0.2, g: 0.6, b: 0.2 },
      });
    }

    // Draw instructor signature area
    const instructorLabel = 'Instructor:';
    page.drawText(instructorLabel, {
      x: template.layout.instructor.x,
      y: template.layout.instructor.y + 20,
      size: template.layout.instructor.fontSize,
      font: regularFont,
      color: template.layout.instructor.color,
    });

    page.drawText(certificateData.instructorName, {
      x: template.layout.instructor.x,
      y: template.layout.instructor.y,
      size: template.layout.instructor.fontSize,
      font: regularFont,
      color: template.layout.instructor.color,
    });

    // Draw signature line
    page.drawLine({
      start: { x: template.layout.instructor.x, y: template.layout.instructor.y - 10 },
      end: { x: template.layout.instructor.x + 150, y: template.layout.instructor.y - 10 },
      thickness: 1,
      color: { r: 0.5, g: 0.5, b: 0.5 },
    });

    // Draw certificate ID
    const idLabel = 'Certificate ID:';
    page.drawText(idLabel, {
      x: template.layout.certificateId.x,
      y: template.layout.certificateId.y + 20,
      size: template.layout.certificateId.fontSize,
      font: regularFont,
      color: template.layout.certificateId.color,
    });

    page.drawText(certificateData.certificateId, {
      x: template.layout.certificateId.x,
      y: template.layout.certificateId.y,
      size: template.layout.certificateId.fontSize,
      font: regularFont,
      color: template.layout.certificateId.color,
    });

    // Draw institution name if provided
    if (certificateData.institutionName) {
      const institutionText = certificateData.institutionName;
      page.drawText(institutionText, {
        x: template.width / 2 - (regularFont.widthOfTextAtSize(institutionText, 18) / 2),
        y: 50,
        size: 18,
        font: titleFont,
        color: { r: 0.2, g: 0.2, b: 0.2 },
      });
    } else {
      // Default institution name
      const defaultInstitution = 'Winfoa Platform';
      page.drawText(defaultInstitution, {
        x: template.width / 2 - (regularFont.widthOfTextAtSize(defaultInstitution, 18) / 2),
        y: 50,
        size: 18,
        font: titleFont,
        color: { r: 0.2, g: 0.2, b: 0.2 },
      });
    }

    // Add watermark
    if (template.watermark || templateName === 'premium') {
      const watermarkText = template.watermark || 'AUTHENTIC';
      page.drawText(watermarkText, {
        x: template.width / 2 - (regularFont.widthOfTextAtSize(watermarkText, 60) / 2),
        y: template.height / 2 - 30,
        size: 60,
        font: regularFont,
        color: { r: 0.95, g: 0.95, b: 0.95 },
        opacity: 0.3,
      });
    }

    // Add QR code placeholder (you could integrate a QR code library here)
    if (templateName === 'premium') {
      drawQRCodePlaceholder(page, template.width - 120, 20, 80);
    }

    // Serialize the PDF document
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);

  } catch (error) {
    console.error('Certificate generation error:', error);
    throw new Error('Failed to generate certificate');
  }
}

/**
 * Draw decorative border
 */
function drawBorder(page: PDFPage, template: CertificateTemplate): void {
  const margin = 20;
  const borderColor = { r: 0.7, g: 0.7, b: 0.7 };

  // Outer border
  page.drawRectangle({
    x: margin,
    y: margin,
    width: template.width - (margin * 2),
    height: template.height - (margin * 2),
    borderColor: borderColor,
    borderWidth: 3,
  });

  // Inner decorative border
  page.drawRectangle({
    x: margin + 10,
    y: margin + 10,
    width: template.width - (margin * 2) - 20,
    height: template.height - (margin * 2) - 20,
    borderColor: borderColor,
    borderWidth: 1,
  });

  // Corner decorations
  const cornerSize = 20;
  const corners = [
    { x: margin + 15, y: template.height - margin - 15 }, // Top left
    { x: template.width - margin - 15, y: template.height - margin - 15 }, // Top right
    { x: margin + 15, y: margin + 15 }, // Bottom left
    { x: template.width - margin - 15, y: margin + 15 }, // Bottom right
  ];

  corners.forEach(corner => {
    page.drawRectangle({
      x: corner.x - cornerSize / 2,
      y: corner.y - cornerSize / 2,
      width: cornerSize,
      height: cornerSize,
      color: { r: 0.9, g: 0.9, b: 0.9 },
      borderColor: borderColor,
      borderWidth: 1,
    });
  });
}

/**
 * Draw QR code placeholder
 */
function drawQRCodePlaceholder(page: PDFPage, x: number, y: number, size: number): void {
  // Simple QR code-like pattern
  const cellSize = size / 10;
  const pattern = [
    [1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
  ];

  pattern.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        page.drawRectangle({
          x: x + (colIndex * cellSize),
          y: y + (rowIndex * cellSize),
          width: cellSize,
          height: cellSize,
          color: { r: 0, g: 0, b: 0 },
        });
      }
    });
  });
}

/**
 * Validate certificate data
 */
export function validateCertificateData(data: CertificateData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.studentName || data.studentName.trim() === '') {
    errors.push('Student name is required');
  }

  if (!data.courseName || data.courseName.trim() === '') {
    errors.push('Course name is required');
  }

  if (!data.courseCode || data.courseCode.trim() === '') {
    errors.push('Course code is required');
  }

  if (!data.completionDate || data.completionDate.trim() === '') {
    errors.push('Completion date is required');
  }

  if (!data.instructorName || data.instructorName.trim() === '') {
    errors.push('Instructor name is required');
  }

  if (!data.certificateId || data.certificateId.trim() === '') {
    errors.push('Certificate ID is required');
  }

  if (data.grade !== undefined && (data.grade < 0 || data.grade > 100)) {
    errors.push('Grade must be between 0 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate certificate ID
 */
export function generateCertificateId(courseCode: string, studentId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `CERT-${courseCode}-${studentId.substr(-4)}-${timestamp}-${random}`;
}

/**
 * Get available certificate templates
 */
export function getAvailableTemplates(): Array<{ id: string; name: string; description: string }> {
  return Object.entries(CERTIFICATE_TEMPLATES).map(([id, template]) => ({
    id,
    name: template.name,
    description: getTemplateDescription(id)
  }));
}

function getTemplateDescription(templateId: string): string {
  const descriptions: Record<string, string> = {
    standard: 'Clean and professional design suitable for most courses',
    premium: 'Elegant design with decorative elements and QR code',
    custom: 'Modern design with custom colors and A4 format'
  };

  return descriptions[templateId] || 'Certificate template';
}

export default {
  generateCertificate,
  validateCertificateData,
  generateCertificateId,
  getAvailableTemplates,
  CERTIFICATE_TEMPLATES
};
