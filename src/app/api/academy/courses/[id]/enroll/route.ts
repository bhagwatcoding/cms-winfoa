import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/lib/db";
import { Course, Student, User, WalletTransaction } from "@/models";
import { requireAuth } from "@/shared/lib/session";

// POST /api/academy/courses/[id]/enroll - Enroll in a course
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id: courseId } = params;
    const body = await request.json();
    const { paymentMethod = "wallet", centerId } = body;

    // Find course
    const course = await Course.findOne({
      $or: [
        { _id: courseId },
        { code: courseId.toUpperCase() }
      ]
    }).populate("instructor", "name email");

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if course is available for enrollment
    if (course.status !== "published" || !course.isActive) {
      return NextResponse.json(
        { error: "Course is not available for enrollment" },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await Student.findOne({
      courseId: course._id,
      userId: currentUser.id,
      status: { $in: ["active", "completed"] }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 409 }
      );
    }

    // Check enrollment capacity
    if (course.maxStudents) {
      const currentEnrollments = await Student.countDocuments({
        courseId: course._id,
        status: "active"
      });

      if (currentEnrollments >= course.maxStudents) {
        return NextResponse.json(
          { error: "Course is full. Maximum enrollment capacity reached." },
          { status: 400 }
        );
      }
    }

    // Get user for wallet balance check
    const user = await User.findById(currentUser.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Handle payment
    let transactionId = null;
    if (course.price > 0) {
      if (paymentMethod === "wallet") {
        // Check wallet balance
        if (user.walletBalance < course.price) {
          return NextResponse.json(
            { error: `Insufficient wallet balance. Required: ${course.currency} ${course.price}, Available: ${course.currency} ${user.walletBalance}` },
            { status: 400 }
          );
        }

        // Deduct from wallet and create transaction
        user.walletBalance -= course.price;
        await user.save();

        // Create wallet transaction record
        const transaction = new WalletTransaction({
          userId: user._id,
          type: "payment",
          amount: course.price,
          currency: course.currency,
          description: `Course enrollment: ${course.title} (${course.code})`,
          metadata: {
            courseId: course._id,
            courseCode: course.code,
            courseTitle: course.title,
            enrollmentType: "course_payment"
          },
          status: "completed",
          balanceAfter: user.walletBalance
        });

        await transaction.save();
        transactionId = transaction._id;
      } else {
        return NextResponse.json(
          { error: "Invalid payment method. Only wallet payment is currently supported." },
          { status: 400 }
        );
      }
    }

    // Generate student ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const studentId = `STU-${year}-${randomNum}`;

    // Create enrollment
    const enrollment = new Student({
      studentId,
      userId: currentUser.id,
      courseId: course._id,
      centerId: centerId || null,
      enrolledAt: new Date(),
      status: "active",
      progress: 0,
      paymentStatus: course.price > 0 ? "paid" : "free",
      paymentAmount: course.price,
      paymentCurrency: course.currency,
      transactionId,
      metadata: {
        enrollmentSource: "web",
        paymentMethod,
        coursePrice: course.price,
        courseDuration: course.duration
      }
    });

    await enrollment.save();

    // Update course enrollment count (if field exists)
    await Course.findByIdAndUpdate(course._id, {
      $inc: { enrollmentCount: 1 }
    });

    // Log enrollment
    console.log(`🎓 New enrollment: ${currentUser.email} enrolled in ${course.code}`);

    // Prepare response data
    const responseData = {
      enrollmentId: enrollment._id,
      studentId: enrollment.studentId,
      course: {
        id: course._id,
        title: course.title,
        code: course.code,
        duration: course.duration,
        instructor: course.instructor,
        hasCertificate: course.hasCertificate
      },
      student: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email
      },
      enrollment: {
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        progress: enrollment.progress,
        paymentStatus: enrollment.paymentStatus,
        paymentAmount: enrollment.paymentAmount,
        paymentCurrency: enrollment.paymentCurrency
      },
      transaction: transactionId ? {
        id: transactionId,
        amount: course.price,
        currency: course.currency,
        method: paymentMethod
      } : null,
      walletBalance: user.walletBalance
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: `Successfully enrolled in ${course.title}!`
    });

  } catch (error: any) {
    console.error("Course enrollment error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(", ")}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}

// GET /api/academy/courses/[id]/enroll - Check enrollment status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id: courseId } = params;

    // Find course
    const course = await Course.findOne({
      $or: [
        { _id: courseId },
        { code: courseId.toUpperCase() }
      ]
    }).select("title code price currency maxStudents status isActive");

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check user's enrollment status
    const enrollment = await Student.findOne({
      courseId: course._id,
      userId: currentUser.id
    });

    // Get enrollment statistics
    const enrollmentStats = await Student.aggregate([
      {
        $match: {
          courseId: course._id,
          status: "active"
        }
      },
      {
        $group: {
          _id: null,
          totalEnrolled: { $sum: 1 },
          averageProgress: { $avg: "$progress" }
        }
      }
    ]);

    const stats = enrollmentStats[0] || { totalEnrolled: 0, averageProgress: 0 };

    // Get user's wallet balance
    const user = await User.findById(currentUser.id).select("walletBalance");
    const canAfford = course.price === 0 || (user && user.walletBalance >= course.price);

    const response = {
      course: {
        id: course._id,
        title: course.title,
        code: course.code,
        price: course.price,
        currency: course.currency,
        status: course.status,
        isActive: course.isActive
      },
      enrollment: enrollment ? {
        id: enrollment._id,
        studentId: enrollment.studentId,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        progress: enrollment.progress,
        paymentStatus: enrollment.paymentStatus
      } : null,
      eligibility: {
        canEnroll: !enrollment && course.status === "published" && course.isActive,
        isEnrolled: !!enrollment,
        canAfford,
        hasCapacity: !course.maxStudents || stats.totalEnrolled < course.maxStudents,
        reasons: []
      },
      statistics: {
        totalEnrolled: stats.totalEnrolled,
        maxStudents: course.maxStudents,
        spotsRemaining: course.maxStudents ? course.maxStudents - stats.totalEnrolled : null,
        averageProgress: Math.round(stats.averageProgress || 0)
      },
      userWalletBalance: user?.walletBalance || 0
    };

    // Add reasons why enrollment might not be possible
    if (enrollment) {
      response.eligibility.reasons.push("Already enrolled in this course");
    }
    if (course.status !== "published") {
      response.eligibility.reasons.push("Course is not published");
    }
    if (!course.isActive) {
      response.eligibility.reasons.push("Course is not active");
    }
    if (!canAfford) {
      response.eligibility.reasons.push("Insufficient wallet balance");
    }
    if (course.maxStudents && stats.totalEnrolled >= course.maxStudents) {
      response.eligibility.reasons.push("Course enrollment is full");
    }

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error: any) {
    console.error("Check enrollment error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to check enrollment status" },
      { status: 500 }
    );
  }
}

// DELETE /api/academy/courses/[id]/enroll - Unenroll from course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id: courseId } = params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get("reason") || "User requested";

    // Find course
    const course = await Course.findOne({
      $or: [
        { _id: courseId },
        { code: courseId.toUpperCase() }
      ]
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Find enrollment
    const enrollment = await Student.findOne({
      courseId: course._id,
      userId: currentUser.id,
      status: { $in: ["active", "completed"] }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 404 }
      );
    }

    // Check if course has started (prevent unenrollment after significant progress)
    const progressThreshold = 25; // 25% progress threshold
    if (enrollment.progress > progressThreshold) {
      return NextResponse.json(
        { error: `Cannot unenroll after ${progressThreshold}% course completion. Please contact support.` },
        { status: 400 }
      );
    }

    // Handle refund if applicable
    let refundAmount = 0;
    if (enrollment.paymentStatus === "paid" && enrollment.transactionId) {
      // Calculate refund (full refund if less than 7 days and under progress threshold)
      const enrollmentAge = Date.now() - enrollment.enrolledAt.getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

      if (enrollmentAge <= sevenDaysInMs && enrollment.progress <= progressThreshold) {
        refundAmount = enrollment.paymentAmount;

        // Add refund to wallet
        const user = await User.findById(currentUser.id);
        if (user) {
          user.walletBalance += refundAmount;
          await user.save();

          // Create refund transaction
          const refundTransaction = new WalletTransaction({
            userId: user._id,
            type: "refund",
            amount: refundAmount,
            currency: enrollment.paymentCurrency,
            description: `Course unenrollment refund: ${course.title} (${course.code})`,
            metadata: {
              courseId: course._id,
              courseCode: course.code,
              courseTitle: course.title,
              originalEnrollmentId: enrollment._id,
              originalTransactionId: enrollment.transactionId,
              refundReason: reason
            },
            status: "completed",
            balanceAfter: user.walletBalance
          });

          await refundTransaction.save();
        }
      }
    }

    // Update enrollment status (soft delete)
    enrollment.status = "withdrawn";
    enrollment.withdrawnAt = new Date();
    enrollment.withdrawalReason = reason;
    await enrollment.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(course._id, {
      $inc: { enrollmentCount: -1 }
    });

    // Log unenrollment
    console.log(`🚪 Unenrollment: ${currentUser.email} withdrew from ${course.code}, refund: ${refundAmount}`);

    return NextResponse.json({
      success: true,
      data: {
        courseId: course._id,
        courseTitle: course.title,
        courseCode: course.code,
        withdrawnAt: enrollment.withdrawnAt,
        refundAmount,
        refundCurrency: enrollment.paymentCurrency,
        reason
      },
      message: refundAmount > 0
        ? `Successfully unenrolled with ${enrollment.paymentCurrency} ${refundAmount} refund`
        : "Successfully unenrolled from course"
    });

  } catch (error: any) {
    console.error("Course unenrollment error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to unenroll from course" },
      { status: 500 }
    );
  }
}
