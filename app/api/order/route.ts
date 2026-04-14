import { NextResponse } from "next/server";

/**
 * Stub endpoint for order submissions — replace with Google Sheets / webhook later.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (process.env.NODE_ENV === "development") {
      console.info("[api/order] received:", JSON.stringify(body, null, 2));
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
}
