import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/core/db";
import { User } from "@/models";
import { requireAuth, requireRole } from "@/core/auth";
import {
  sendEmail,
  sendBulkEmails,
  sendWelcomeEmail,
  sendEnrollmentConfirmation,
  sendPasswordResetEmail,
  sendWalletRechargeConfirmation,
  sendCertificateNotification,
  EMAIL_TEMPLATES
} from "@/core/email";

// GET /api/notifications - Get notification templates and statistics
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "templates";

    if (action === "templates") {
      // Return available email templates
      const templates = Object.keys(EMAIL_TEMPLATES).map(key => ({
        id: key,
        name: EMAIL_TEMPLATES[key as keyof typeof EMAIL_TEMPLATES].subject,
        description: getTemplateDescription(key),
        variables: getTemplateVariables(key)
      }));

      return NextResponse.json({
        success: true,
        data: {
          templates,
          totalTemplates: templates.length,
          supportedTypes: ["welcome", "courseEnrollment", "passwordReset", "walletRecharge", "certificateGenerated"]
        }
      });
    }

    if (action === "history") {
      // In a real implementation, you'd fetch from database
      // For now, return simulated history
      const history = [
        {
          id: "notif_001",
          type: "welcome",
          recipient: { email: "user@example.com", name: "Test User" },
          status: "sent",
          sentAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          subject: "Welcome to Winfoa Platform!"
        },
        {
          id: "notif_002",
          type: "courseEnrollment",
          recipient: { email: "student@example.com", name: "Student" },
          status: "delivered",
          sentAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          subject: "Course Enrollment Confirmation"
        }
      ];

      return NextResponse.json({
        success: true,
        data: {
          history,
          total: history.length
        }
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'templates' or 'history'" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Get notifications error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Send notification
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const body = await request.json();
    const {
      type,
      recipient,
      template,
      variables = {},
      sendImmediately = true
    } = body;

    // Validate required fields
    if (!type || !recipient) {
      return NextResponse.json(
        { error: "Type and recipient are required" },
        { status: 400 }
      );
    }

    if (!recipient.email) {
      return NextResponse.json(
        { error: "Recipient email is required" },
        { status: 400 }
      );
    }

    // Check permissions for different notification types
    const isAdmin = ["admin", "super-admin"].includes(currentUser.role);
    const isStaff = ["staff", "center"].includes(currentUser.role);

    if (type !== "personal" && !isAdmin && !isStaff) {
      return NextResponse.json(
        { error: "Insufficient permissions to send system notifications" },
        { status: 403 }
      );
    }

    let result;

    // Handle different notification types
    switch (type) {
      case "welcome":
        if (!isAdmin) {
          return NextResponse.json(
            { error: "Only admins can send welcome emails" },
            { status: 403 }
          );
        }

        result = await sendWelcomeEmail({
          name: recipient.name || recipient.email,
          email: recipient.email,
          role: variables.role || "user",
          id: variables.userId || "unknown",
          subdomains: variables.subdomains || ["auth", "myaccount"]
        });
        break;

      case "course-enrollment":
        result = await sendEnrollmentConfirmation(
          { name: recipient.name, email: recipient.email },
          {
            title: variables.courseTitle || "Course",
            code: variables.courseCode || "COURSE001",
            duration: variables.courseDuration || "N/A",
            instructor: variables.instructorName || "Instructor"
          },
          {
            date: variables.enrollmentDate || new Date().toISOString(),
            fee: variables.courseFee,
            currency: variables.currency
          }
        );
        break;

      case "password-reset":
        result = await sendPasswordResetEmail(
          { name: recipient.name, email: recipient.email },
          variables.resetCode || "123456"
        );
        break;

      case "wallet-recharge":
        result = await sendWalletRechargeConfirmation(
          { name: recipient.name, email: recipient.email },
          {
            amount: variables.amount || 0,
            currency: variables.currency || "USD",
            paymentMethod: variables.paymentMethod || "Unknown",
            transactionId: variables.transactionId || "TXN001",
            newBalance: variables.newBalance || 0,
            date: variables.transactionDate || new Date().toISOString()
          }
        );
        break;

      case "certificate":
        result = await sendCertificateNotification(
          { name: recipient.name, email: recipient.email },
          {
            title: variables.courseTitle || "Course",
            code: variables.courseCode || "COURSE001"
          },
          {
            id: variables.certificateId || "CERT001",
            completionDate: variables.completionDate || new Date().toISOString(),
            grade: variables.finalGrade || 100
          }
        );
        break;

      case "custom":
        if (!template) {
          return NextResponse.json(
            { error: "Template is required for custom notifications" },
            { status: 400 }
          );
        }

        // For custom templates, use the provided template name
        const templateName = template as keyof typeof EMAIL_TEMPLATES;
        if (!EMAIL_TEMPLATES[templateName]) {
          return NextResponse.json(
            { error: `Template '${template}' not found` },
            { status: 400 }
          );
        }

        result = await sendEmail(recipient, templateName, variables);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid notification type" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send notification" },
        { status: 400 }
      );
    }

    // Log notification
    console.log(`📧 Notification sent: ${type} to ${recipient.email} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: {
        notificationId: result.messageId,
        type,
        recipient,
        status: "sent",
        sentAt: new Date().toISOString(),
        deliveryTime: result.deliveryTime,
        sentBy: currentUser.id
      },
      message: `${type} notification sent successfully`
    });

  } catch (error: any) {
    console.error("Send notification error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions to send notifications" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - Send bulk notifications
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await requireRole(["admin", "super-admin", "staff"]);
    await connectDB();

    const body = await request.json();
    const {
      recipients,
      template,
      variables = {},
      batchSize = 10
    } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "Recipients array is required" },
        { status: 400 }
      );
    }

    if (!template || !EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES]) {
      return NextResponse.json(
        { error: "Valid template is required" },
        { status: 400 }
      );
    }

    // Validate all recipients have email addresses
    const invalidRecipients = recipients.filter(r => !r.email);
    if (invalidRecipients.length > 0) {
      return NextResponse.json(
        { error: `${invalidRecipients.length} recipients missing email addresses` },
        { status: 400 }
      );
    }

    // Send bulk emails
    const result = await sendBulkEmails(
      recipients,
      template as keyof typeof EMAIL_TEMPLATES,
      variables
    );

    // Log bulk notification
    console.log(`📧 Bulk notification sent: ${template} to ${recipients.length} recipients by ${currentUser.email} (${result.sent} sent, ${result.failed} failed)`);

    return NextResponse.json({
      success: result.success,
      data: {
        template,
        totalRecipients: recipients.length,
        sent: result.sent,
        failed: result.failed,
        results: result.results.map(r => ({
          email: r.recipient.email,
          status: r.success ? "sent" : "failed",
          error: r.error,
          messageId: r.messageId,
          deliveryTime: r.deliveryTime
        })),
        sentBy: currentUser.id,
        sentAt: new Date().toISOString()
      },
      message: `Bulk notification completed: ${result.sent} sent, ${result.failed} failed`
    });

  } catch (error: any) {
    console.error("Bulk notification error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions for bulk notifications" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send bulk notifications" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - Cancel scheduled notifications (placeholder)
export async function DELETE(request: NextRequest) {
  try {
    await requireRole(["admin", "super-admin"]);

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // In a real implementation, you'd cancel scheduled notifications
    // For now, return success
    return NextResponse.json({
      success: true,
      data: {
        notificationId,
        status: "cancelled",
        cancelledAt: new Date().toISOString()
      },
      message: "Notification cancelled successfully"
    });

  } catch (error: any) {
    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions to cancel notifications" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to cancel notification" },
      { status: 500 }
    );
  }
}

// Helper functions
function getTemplateDescription(templateName: string): string {
  const descriptions: Record<string, string> = {
    welcome: "Welcome email for new users",
    courseEnrollment: "Course enrollment confirmation",
    passwordReset: "Password reset instructions",
    walletRecharge: "Wallet recharge confirmation",
    certificateGenerated: "Certificate generation notification"
  };

  return descriptions[templateName] || "Email template";
}

function getTemplateVariables(templateName: string): string[] {
  const variables: Record<string, string[]> = {
    welcome: ["userName", "userEmail", "userRole", "userId", "subdomains"],
    courseEnrollment: ["studentName", "courseTitle", "courseCode", "courseDuration", "instructorName", "enrollmentDate", "courseFee", "currency"],
    passwordReset: ["userName", "resetCode"],
    walletRecharge: ["userName", "amount", "currency", "paymentMethod", "transactionId", "newBalance", "transactionDate"],
    certificateGenerated: ["studentName", "courseTitle", "courseCode", "certificateId", "completionDate", "finalGrade"]
  };

  return variables[templateName] || [];
}
