import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/core/db";
import { WalletTransaction, User } from "@/models";
import { requireAuth } from "@/core/auth";

// POST /api/wallet/recharge - Add funds to wallet
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const body = await request.json();
    const {
      amount,
      currency = "USD",
      paymentMethod = "simulated",
      paymentDetails = {}
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required (must be greater than 0)" },
        { status: 400 }
      );
    }

    // Validate amount limits
    const minRecharge = 1;
    const maxRecharge = 10000;

    if (amount < minRecharge) {
      return NextResponse.json(
        { error: `Minimum recharge amount is ${currency} ${minRecharge}` },
        { status: 400 }
      );
    }

    if (amount > maxRecharge) {
      return NextResponse.json(
        { error: `Maximum recharge amount is ${currency} ${maxRecharge}` },
        { status: 400 }
      );
    }

    // Get user for wallet balance update
    const user = await User.findById(currentUser.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Simulate payment processing
    const paymentResult = await simulatePaymentProcessing(
      amount,
      currency,
      paymentMethod,
      paymentDetails
    );

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          error: "Payment processing failed",
          details: paymentResult.error
        },
        { status: 400 }
      );
    }

    // Calculate new balance
    const previousBalance = user.walletBalance || 0;
    const newBalance = previousBalance + amount;

    // Create transaction record
    const transaction = new WalletTransaction({
      userId: user._id,
      type: "recharge",
      amount,
      currency,
      description: `Wallet recharge via ${paymentMethod}`,
      metadata: {
        paymentMethod,
        paymentDetails: {
          ...paymentDetails,
          // Remove sensitive data
          cardNumber: paymentDetails.cardNumber ?
            `****-****-****-${paymentDetails.cardNumber.slice(-4)}` :
            undefined
        },
        paymentGatewayResponse: paymentResult.gatewayResponse,
        ipAddress: request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      },
      status: "completed",
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      transactionId: paymentResult.transactionId
    });

    await transaction.save();

    // Update user wallet balance
    user.walletBalance = newBalance;
    await user.save();

    // Log recharge
    console.log(`💰 Wallet recharged: ${currentUser.email} added ${currency} ${amount} via ${paymentMethod}`);

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction._id,
        amount,
        currency,
        paymentMethod,
        previousBalance,
        newBalance,
        transaction: {
          id: transaction._id,
          type: transaction.type,
          status: transaction.status,
          createdAt: transaction.createdAt,
          description: transaction.description
        }
      },
      message: `Successfully recharged ${currency} ${amount} to your wallet`
    });

  } catch (error: any) {
    console.error("Wallet recharge error:", error);

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
      { error: "Failed to process wallet recharge" },
      { status: 500 }
    );
  }
}

// GET /api/wallet/recharge - Get recharge options and limits
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const rechargeOptions = {
      currency: "USD",
      limits: {
        minimum: 1,
        maximum: 10000,
        recommended: [10, 25, 50, 100, 250, 500]
      },
      paymentMethods: [
        {
          id: "simulated",
          name: "Simulated Payment",
          description: "For development and testing purposes",
          enabled: true,
          fees: {
            percentage: 0,
            fixed: 0
          }
        },
        {
          id: "bank-transfer",
          name: "Bank Transfer",
          description: "Direct bank transfer (simulated)",
          enabled: true,
          fees: {
            percentage: 1.5,
            fixed: 0.30
          }
        },
        {
          id: "card-payment",
          name: "Credit/Debit Card",
          description: "Pay with credit or debit card (simulated)",
          enabled: true,
          fees: {
            percentage: 2.9,
            fixed: 0.30
          }
        }
      ],
      user: {
        id: currentUser.id,
        currentBalance: 0,
        rechargeHistory: []
      }
    };

    // Get user's current balance and recent recharges
    const user = await User.findById(currentUser.id).select("walletBalance");
    if (user) {
      rechargeOptions.user.currentBalance = user.walletBalance || 0;
    }

    // Get recent recharge history
    const recentRecharges = await WalletTransaction.find({
      userId: currentUser.id,
      type: "recharge",
      status: "completed"
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("amount currency createdAt description")
      .lean();

    rechargeOptions.user.rechargeHistory = recentRecharges;

    return NextResponse.json({
      success: true,
      data: rechargeOptions
    });

  } catch (error: any) {
    console.error("Get recharge options error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch recharge options" },
      { status: 500 }
    );
  }
}

// Simulate payment processing function
async function simulatePaymentProcessing(
  amount: number,
  currency: string,
  paymentMethod: string,
  paymentDetails: any
): Promise<{
  success: boolean;
  transactionId?: string;
  gatewayResponse?: any;
  error?: string;
}> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Simulate different payment scenarios
  const scenarios = [
    { probability: 0.85, result: "success" },
    { probability: 0.10, result: "insufficient_funds" },
    { probability: 0.03, result: "card_declined" },
    { probability: 0.02, result: "network_error" }
  ];

  const random = Math.random();
  let cumulative = 0;
  let scenario = "success";

  for (const s of scenarios) {
    cumulative += s.probability;
    if (random <= cumulative) {
      scenario = s.result;
      break;
    }
  }

  // Generate simulated transaction ID
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  switch (scenario) {
    case "success":
      return {
        success: true,
        transactionId,
        gatewayResponse: {
          status: "approved",
          authCode: `AUTH${Math.random().toString(36).substr(2, 6)}`,
          processingTime: Math.floor(1000 + Math.random() * 3000),
          gatewayFee: Math.round((amount * 0.029 + 0.30) * 100) / 100,
          currency
        }
      };

    case "insufficient_funds":
      return {
        success: false,
        error: "Insufficient funds in the payment source"
      };

    case "card_declined":
      return {
        success: false,
        error: "Payment method declined by issuing bank"
      };

    case "network_error":
      return {
        success: false,
        error: "Network error occurred during payment processing"
      };

    default:
      return {
        success: false,
        error: "Unknown payment processing error"
      };
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
