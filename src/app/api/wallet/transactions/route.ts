import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/core/db";
import { WalletTransaction, User } from "@/models";
import { requireAuth, requireRole } from "@/core/auth";

// GET /api/wallet/transactions - Get transaction history
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");

    // Build query - users can only see their own transactions unless admin
    const query: any = {};

    const isAdmin = ["admin", "super-admin"].includes(currentUser.role);
    if (!isAdmin) {
      query.userId = currentUser.id;
    } else {
      // Admin can filter by specific user
      const userId = searchParams.get("userId");
      if (userId) {
        query.userId = userId;
      }
    }

    // Apply filters
    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo + "T23:59:59.999Z");
      }
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) {
        query.amount.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        query.amount.$lte = parseFloat(maxAmount);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [transactions, total] = await Promise.all([
      WalletTransaction.find(query)
        .populate("userId", "name email umpUserId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WalletTransaction.countDocuments(query),
    ]);

    // Calculate summary statistics
    const summaryStats = await WalletTransaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalCredit: {
            $sum: {
              $cond: [
                { $in: ["$type", ["recharge", "refund", "cashback", "bonus"]] },
                "$amount",
                0
              ]
            }
          },
          totalDebit: {
            $sum: {
              $cond: [
                { $in: ["$type", ["payment", "transfer", "withdrawal", "fee"]] },
                "$amount",
                0
              ]
            }
          },
          avgTransactionAmount: { $avg: "$amount" },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    const stats = summaryStats[0] || {
      totalAmount: 0,
      totalCredit: 0,
      totalDebit: 0,
      avgTransactionAmount: 0,
      transactionCount: 0
    };

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      summary: {
        ...stats,
        netAmount: stats.totalCredit - stats.totalDebit,
        avgTransactionAmount: Math.round(stats.avgTransactionAmount * 100) / 100
      },
      filters: {
        type,
        status,
        dateFrom,
        dateTo,
        minAmount,
        maxAmount,
      },
      message: `Found ${transactions.length} transactions`,
    });

  } catch (error: any) {
    console.error("Get transactions error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/wallet/transactions - Create new transaction (Admin or system)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const body = await request.json();
    const {
      userId,
      type,
      amount,
      currency = "USD",
      description,
      metadata = {},
      status = "completed"
    } = body;

    // Validate required fields
    if (!userId || !type || !amount || !description) {
      return NextResponse.json(
        { error: "User ID, type, amount, and description are required" },
        { status: 400 }
      );
    }

    // Check if amount is valid
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate transaction type
    const validTypes = [
      "recharge", "payment", "transfer", "refund",
      "withdrawal", "fee", "cashback", "bonus", "adjustment"
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    // Check permissions
    const isAdmin = ["admin", "super-admin"].includes(currentUser.role);
    const isSelfTransaction = currentUser.id === userId;

    if (!isAdmin && !isSelfTransaction) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Find target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Handle wallet balance update
    let newBalance = targetUser.walletBalance || 0;
    const creditTypes = ["recharge", "refund", "cashback", "bonus"];
    const debitTypes = ["payment", "transfer", "withdrawal", "fee"];

    if (creditTypes.includes(type)) {
      newBalance += amount;
    } else if (debitTypes.includes(type)) {
      if (newBalance < amount) {
        return NextResponse.json(
          { error: "Insufficient wallet balance" },
          { status: 400 }
        );
      }
      newBalance -= amount;
    }

    // Create transaction
    const transaction = new WalletTransaction({
      userId: targetUser._id,
      type,
      amount,
      currency,
      description,
      metadata: {
        ...metadata,
        performedBy: currentUser.id,
        performedByEmail: currentUser.email,
        ipAddress: request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown'
      },
      status,
      balanceBefore: targetUser.walletBalance,
      balanceAfter: newBalance
    });

    await transaction.save();

    // Update user wallet balance
    targetUser.walletBalance = newBalance;
    await targetUser.save();

    // Populate user data for response
    await transaction.populate("userId", "name email umpUserId");

    // Log transaction
    console.log(`💰 Transaction created: ${type} ${currency} ${amount} for ${targetUser.email} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: transaction,
      message: `${type} transaction of ${currency} ${amount} created successfully`
    });

  } catch (error: any) {
    console.error("Create transaction error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(", ")}` },
        { status: 400 }
      );
    }

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// PUT /api/wallet/transactions - Bulk transaction operations (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await requireRole(["admin", "super-admin"]);
    await connectDB();

    const body = await request.json();
    const { action, transactionIds, updates } = body;

    if (!action || !transactionIds || !Array.isArray(transactionIds)) {
      return NextResponse.json(
        { error: "Action and transaction IDs array are required" },
        { status: 400 }
      );
    }

    let result;
    let message;

    switch (action) {
      case "update-status":
        if (!updates?.status) {
          return NextResponse.json(
            { error: "Status is required for status update" },
            { status: 400 }
          );
        }

        result = await WalletTransaction.updateMany(
          { _id: { $in: transactionIds } },
          {
            $set: {
              status: updates.status,
              updatedAt: new Date(),
              updatedBy: currentUser.id
            }
          }
        );
        message = `Updated status for ${result.modifiedCount} transactions`;
        break;

      case "add-notes":
        if (!updates?.notes) {
          return NextResponse.json(
            { error: "Notes are required" },
            { status: 400 }
          );
        }

        result = await WalletTransaction.updateMany(
          { _id: { $in: transactionIds } },
          {
            $set: {
              "metadata.adminNotes": updates.notes,
              updatedAt: new Date(),
              updatedBy: currentUser.id
            }
          }
        );
        message = `Added notes to ${result.modifiedCount} transactions`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        transactionsAffected: result.modifiedCount,
        updates
      },
      message
    });

  } catch (error: any) {
    console.error("Bulk transaction update error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update transactions" },
      { status: 500 }
    );
  }
}

// DELETE /api/wallet/transactions - Cancel/void transactions (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await requireRole(["super-admin"]);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const transactionIds = searchParams.get("ids")?.split(",") || [];
    const reason = searchParams.get("reason") || "Admin cancellation";

    if (transactionIds.length === 0) {
      return NextResponse.json(
        { error: "Transaction IDs are required" },
        { status: 400 }
      );
    }

    // Find transactions to cancel
    const transactions = await WalletTransaction.find({
      _id: { $in: transactionIds },
      status: { $in: ["completed", "pending"] }
    }).populate("userId");

    if (transactions.length === 0) {
      return NextResponse.json(
        { error: "No valid transactions found to cancel" },
        { status: 404 }
      );
    }

    const results = [];

    for (const transaction of transactions) {
      try {
        // Reverse the wallet balance effect
        const user = await User.findById(transaction.userId);
        if (user) {
          const creditTypes = ["recharge", "refund", "cashback", "bonus"];
          const debitTypes = ["payment", "transfer", "withdrawal", "fee"];

          if (creditTypes.includes(transaction.type)) {
            // Reverse credit: subtract from balance
            user.walletBalance -= transaction.amount;
          } else if (debitTypes.includes(transaction.type)) {
            // Reverse debit: add back to balance
            user.walletBalance += transaction.amount;
          }

          await user.save();
        }

        // Mark transaction as cancelled
        transaction.status = "cancelled";
        transaction.cancelledAt = new Date();
        transaction.cancelledBy = currentUser.id;
        transaction.cancellationReason = reason;
        await transaction.save();

        results.push({
          transactionId: transaction._id,
          amount: transaction.amount,
          type: transaction.type,
          status: "cancelled"
        });

      } catch (error) {
        console.error(`Failed to cancel transaction ${transaction._id}:`, error);
        results.push({
          transactionId: transaction._id,
          status: "failed",
          error: "Failed to cancel transaction"
        });
      }
    }

    const successful = results.filter(r => r.status === "cancelled").length;

    // Log cancellation
    console.log(`❌ Transactions cancelled: ${successful}/${results.length} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: {
        results,
        successful,
        failed: results.length - successful,
        reason
      },
      message: `Successfully cancelled ${successful} out of ${results.length} transactions`
    });

  } catch (error: any) {
    console.error("Cancel transactions error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions. Super-admin access required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to cancel transactions" },
      { status: 500 }
    );
  }
}
