import { NextRequest, NextResponse } from "next/server";

/**
 * Chapa Checkout API Route
 *
 * This serverless function initiates a Chapa payment.
 *
 * Environment variables needed:
 * - CHAPA_SECRET_KEY: Your Chapa secret key from https://dashboard.chapa.co
 *
 * For testing, use Chapa's test mode keys.
 * For production, switch to live keys.
 *
 * Chapa API docs: https://chapa.co/docs/api
 */

export async function POST(request: NextRequest) {
  try {
    const { email, amount } = await request.json();

    if (!email || !amount) {
      return NextResponse.json(
        { error: "Email and amount are required" },
        { status: 400 }
      );
    }

    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

    if (!CHAPA_SECRET_KEY) {
      // Demo mode: return a simulated checkout URL
      // In production, this would call the Chapa API
      return NextResponse.json({
        checkout_url: `${request.nextUrl.origin}/export?payment=success`,
        message: "Demo mode - set CHAPA_SECRET_KEY for real payments",
      });
    }

    // Generate a unique reference
    const txRef = `smartcv_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const response = await fetch("https://api.chapa.co/v1/hosted/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: "ETB",
        email,
        tx_ref: txRef,
        title: "SmartCV Premium Unlock",
        description: "One-time payment to remove watermark and unlock premium themes",
        return_url: `${request.nextUrl.origin}/export?payment=success`,
        // Callback URL for webhook verification
        callback_url: `${request.nextUrl.origin}/api/checkout/callback`,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({ checkout_url: data.data.checkout_url, tx_ref: txRef });
    }

    return NextResponse.json(
      { error: "Payment initiation failed", details: data },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
