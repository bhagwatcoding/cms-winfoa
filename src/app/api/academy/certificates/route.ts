import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/lib/db";
import { Course, Student, Certificate, User } from "@/models";
import { requireAuth, requireRole } from "@/shared/lib/session";
import {
  generateCertificate,
  validateCertificateData,
  generateCertificateId,
  getAvailableTemplates,
  CERTIFICATE_TEMPLATES,
} from "@/shared/lib/certificate";
import { sendCertificateNotification } from "@/shared/lib/email";

// GET /api/academy/certificates - List certificates or get templates
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "list";
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

    if (action === "templates") {
      // Return available certificate templates
      const templates = getAvailableTemplates();

      return NextResponse.json({
        success: true,
        data: {
          templates,
          totalTemplates: templates.length,
          defaultTemplate: "standard",
        },
      });
    }

    if (action === "list") {
      // Build query based on user role and filters
      const query: Record<string, any> = {};

      // Students can only see their own certificates
      if (currentUser.role === "student") {
        query.studentId = currentUser._id.toString();
      } else if (studentId) {
        query.studentId = studentId;
      }

      if (courseId) {
        query.courseId = courseId;
      }

      // In a real implementation, you'd have a Certificate model
      // For now, simulate certificate data
      const certificates = [
        {
          id: "cert_001",
          studentId: currentUser.id,
          studentName: currentUser.name,
          courseId: "course_001",
          courseName: "Web Development Fundamentals",
          courseCode: "WEB101",
          certificateId: "CERT-WEB101-2025-001",
          completionDate: "2025-01-15",
          grade: 95,
          status: "issued",
          issuedAt: "2025-01-15T10:00:00Z",
          instructorName: "John Instructor",
          templateUsed: "standard",
        },
      ];

      const filteredCertificates = certificates.filter((cert) => {
        if (query.studentId && cert.studentId !== query.studentId) return false;
        if (query.courseId && cert.courseId !== query.courseId) return false;
        return true;
      });

      return NextResponse.json({
        success: true,
        data: {
          certificates: filteredCertificates,
          total: filteredCertificates.length,
          filters: { studentId, courseId },
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'list' or 'templates'" },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error("Get certificates error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 },
    );
  }
}

// POST /api/academy/certificates - Generate new certificate
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const body = await request.json();
    const {
      studentId,
      courseId,
      templateType = "standard",
      grade,
      customData = {},
      sendNotification = true,
    } = body;

    // Validate required fields
    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: "Student ID and Course ID are required" },
        { status: 400 },
      );
    }

    // Check permissions - only instructors, staff, and admins can generate certificates
    const isAdmin = ["admin", "super-admin", "staff"].includes(
      currentUser.role,
    );

    if (!isAdmin) {
      // Check if user is the instructor of this course
      const course = await Course.findById(courseId);
      if (
        !course ||
        course.instructor.toString() !== currentUser._id.toString()
      ) {
        return NextResponse.json(
          {
            error:
              "Insufficient permissions to generate certificates for this course",
          },
          { status: 403 },
        );
      }
    }

    // Validate template type
    if (
      !CERTIFICATE_TEMPLATES[templateType as keyof typeof CERTIFICATE_TEMPLATES]
    ) {
      return NextResponse.json(
        { error: "Invalid certificate template" },
        { status: 400 },
      );
    }

    // Get student and course information
    const [student, course] = await Promise.all([
      User.findById(studentId).select("name email"),
      Course.findById(courseId).populate("instructor", "name email"),
    ]);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if student is enrolled in the course
    const enrollment = await Student.findOne({
      userId: studentId,
      courseId: courseId,
      status: { $in: ["active", "completed"] },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Student is not enrolled in this course" },
        { status: 400 },
      );
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      studentId,
      courseId,
    });

    if (existingCertificate) {
      return NextResponse.json(
        { error: "Certificate already exists for this student and course" },
        { status: 409 },
      );
    }

    // Generate certificate ID
    const certificateId = generateCertificateId(course.code, studentId);

    // Prepare certificate data
    const certificateData = {
      studentName: student.name,
      courseName: course.title,
      courseCode: course.code,
      completionDate: new Date().toLocaleDateString(),
      instructorName: course.instructor.name,
      certificateId,
      grade: grade || enrollment.finalGrade || undefined,
      institutionName: customData.institutionName || "Winfoa Platform",
      templateType: templateType as "standard" | "premium" | "custom",
    };

    // Validate certificate data
    const validation = validateCertificateData(certificateData);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: `Certificate validation failed: ${validation.errors.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Generate PDF certificate
    const certificatePDF = await generateCertificate(
      certificateData,
      templateType as keyof typeof CERTIFICATE_TEMPLATES,
    );

    // Save certificate to database (in a real implementation)
    const certificate = {
      id: certificateId,
      studentId,
      studentName: student.name,
      courseId,
      courseName: course.title,
      courseCode: course.code,
      certificateId,
      completionDate: certificateData.completionDate,
      grade: certificateData.grade,
      status: "issued",
      issuedAt: new Date().toISOString(),
      issuedBy: currentUser.id,
      instructorName: certificateData.instructorName,
      templateUsed: templateType,
      fileSize: certificatePDF.length,
      customData,
    };

    // Update student enrollment status to completed if not already
    if (enrollment.status !== "completed") {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();
      enrollment.finalGrade = certificateData.grade || enrollment.progress;
      await enrollment.save();
    }

    // Send notification email if requested
    if (sendNotification) {
      try {
        await sendCertificateNotification(
          { name: student.name, email: student.email },
          { title: course.title, code: course.code },
          {
            id: certificateId,
            completionDate: certificateData.completionDate,
            grade: certificateData.grade || 100,
          },
        );
      } catch (emailError) {
        console.error("Failed to send certificate notification:", emailError);
        // Don't fail the whole operation if email fails
      }
    }

    // Log certificate generation
    console.log(
      `🎓 Certificate generated: ${certificateId} for ${student.name} by ${currentUser.email}`,
    );

    return NextResponse.json({
      success: true,
      data: {
        certificate,
        downloadUrl: `/api/academy/certificates/${certificateId}/download`,
        pdfSize: certificatePDF.length,
        generatedBy: currentUser._id.toString(),
        generatedAt: new Date().toISOString(),
      },
      message: "Certificate generated successfully",
    });
  } catch (error: unknown) {
    console.error("Certificate generation error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (
      errorMessage.includes("Access denied") ||
      errorMessage.includes("Forbidden")
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions to generate certificates" },
        { status: 403 },
      );
    }

    if (errorMessage.includes("Failed to generate certificate")) {
      return NextResponse.json(
        { error: "Certificate generation failed. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 },
    );
  }
}

// PUT /api/academy/certificates - Bulk certificate generation
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await requireRole(["admin", "super-admin", "staff"]);
    await connectDB();

    const body = await request.json();
    const {
      courseId,
      studentIds,
      templateType = "standard",
      criteria = {},
      sendNotifications = true,
    } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    // Get course information
    const course = await Course.findById(courseId).populate(
      "instructor",
      "name",
    );
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get eligible students
    let eligibleStudents;
    if (studentIds && studentIds.length > 0) {
      // Specific students
      eligibleStudents = await Student.find({
        userId: { $in: studentIds },
        courseId: courseId,
        status: { $in: ["active", "completed"] },
      }).populate("userId", "name email");
    } else {
      // All students meeting criteria
      const query: any = {
        courseId: courseId,
        status: { $in: ["active", "completed"] },
      };

      if (criteria.minProgress) {
        query.progress = { $gte: criteria.minProgress };
      }

      if (criteria.minGrade) {
        query.finalGrade = { $gte: criteria.minGrade };
      }

      eligibleStudents = await Student.find(query).populate(
        "userId",
        "name email",
      );
    }

    if (eligibleStudents.length === 0) {
      return NextResponse.json(
        { error: "No eligible students found for certificate generation" },
        { status: 404 },
      );
    }

    // Generate certificates for all eligible students
    const results = [];
    let successful = 0;
    let failed = 0;

    for (const studentEnrollment of eligibleStudents) {
      try {
        const student = studentEnrollment.userId;
        const certificateId = generateCertificateId(
          course.code,
          student._id.toString(),
        );

        const certificateData = {
          studentName: student.name,
          courseName: course.title,
          courseCode: course.code,
          completionDate: new Date().toLocaleDateString(),
          instructorName: course.instructor.name,
          certificateId,
          grade:
            studentEnrollment.finalGrade ||
            studentEnrollment.progress ||
            undefined,
          templateType: templateType as "standard" | "premium" | "custom",
        };

        // Generate PDF
        const certificatePDF = await generateCertificate(
          certificateData,
          templateType as keyof typeof CERTIFICATE_TEMPLATES,
        );

        // Update enrollment status
        if (studentEnrollment.status !== "completed") {
          studentEnrollment.status = "completed";
          studentEnrollment.completedAt = new Date();
          await studentEnrollment.save();
        }

        // Send notification if requested
        if (sendNotifications) {
          try {
            await sendCertificateNotification(
              { name: student.name, email: student.email },
              { title: course.title, code: course.code },
              {
                id: certificateId,
                completionDate: certificateData.completionDate,
                grade: certificateData.grade || 100,
              },
            );
          } catch (emailError) {
            console.error(
              `Failed to send notification to ${student.email}:`,
              emailError,
            );
          }
        }

        results.push({
          studentId: student._id,
          studentName: student.name,
          certificateId,
          status: "success",
          pdfSize: certificatePDF.length,
        });

        successful++;
      } catch (error) {
        console.error(
          `Failed to generate certificate for student ${studentEnrollment.userId._id}:`,
          error,
        );

        results.push({
          studentId: studentEnrollment.userId._id,
          studentName: studentEnrollment.userId.name,
          status: "failed",
          error: "Certificate generation failed",
        });

        failed++;
      }
    }

    // Log bulk generation
    console.log(
      `🎓 Bulk certificates generated: ${successful} successful, ${failed} failed for course ${course.code} by ${currentUser.email}`,
    );

    return NextResponse.json({
      success: successful > 0,
      data: {
        courseId,
        courseName: course.title,
        courseCode: course.code,
        totalStudents: eligibleStudents.length,
        successful,
        failed,
        results,
        templateUsed: templateType,
        generatedBy: currentUser._id.toString(),
        generatedAt: new Date().toISOString(),
      },
      message: `Bulk certificate generation completed: ${successful} successful, ${failed} failed`,
    });
  } catch (error: unknown) {
    console.error("Bulk certificate generation error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("Access denied") ||
      errorMessage.includes("Forbidden")
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions for bulk certificate generation" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate bulk certificates" },
      { status: 500 },
    );
  }
}

// DELETE /api/academy/certificates - Revoke certificates
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await requireRole(["admin", "super-admin"]);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const certificateIds = searchParams.get("ids")?.split(",") || [];
    const reason = searchParams.get("reason") || "Admin revocation";

    if (certificateIds.length === 0) {
      return NextResponse.json(
        { error: "Certificate IDs are required" },
        { status: 400 },
      );
    }

    // In a real implementation, you'd update the certificate status in database
    // For now, simulate the revocation
    const results = certificateIds.map((id) => ({
      certificateId: id,
      status: "revoked",
      revokedBy: currentUser._id.toString(),
      revokedAt: new Date().toISOString(),
      reason,
    }));

    // Log revocation
    console.log(
      `🚫 Certificates revoked: ${certificateIds.length} certificates by ${currentUser.email}`,
    );

    return NextResponse.json({
      success: true,
      data: {
        revoked: results.length,
        results,
        reason,
      },
      message: `Successfully revoked ${results.length} certificate(s)`,
    });
  } catch (error: unknown) {
    console.error("Certificate revocation error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("Access denied") ||
      errorMessage.includes("Forbidden")
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions to revoke certificates" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Failed to revoke certificates" },
      { status: 500 },
    );
  }
}
