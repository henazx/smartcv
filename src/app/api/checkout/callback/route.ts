import { NextRequest, NextResponse } from "next/server";

/**
 * Chapa Payment Callback/Webhook Route
 *
 * This receives payment verification from Chapa after a successful payment.
 * In production, you would verify the payment with Chapa's API and store
 * the premium status in a database (e.g., Supabase).
 *
 * For v1 (no database), the premium flag is stored in localStorage + a
 * signed token approach could be added later for cross-device persistence.
 *
 * Chapa webhook docs: https://chapa.co/docs/api/webhooks
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { status } = body;

    // In production, verify the payment with Chapa API:
    // const verification = await fetch(`https://api.chapa.co/v1/transaction/verify/${body.tx_ref}`, {
    //   headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` }
    // });

    if (status === "success") {
      // TODO (production): Store premium status in Supabase
      // await supabase.from('premium_users').upsert({ tx_ref: body.tx_ref, verified_at: new Date() });
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true, status });
  } catch {
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}

// GET handler for Chapa's verification ping
export async function GET(request: NextRequest) {
  const txRef = request.nextUrl.searchParams.get("tx_ref");

  if (!txRef) {
    return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
  }

  // TODO: Verify payment with Chapa API
  return NextResponse.json({ tx_ref: txRef, status: "verified" });
}
