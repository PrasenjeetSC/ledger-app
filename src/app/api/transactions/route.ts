import { NextResponse } from "next/server";

export const runtime = "edge";

// GET all transactions
export async function GET(req: Request, context: any) {
  const db = context.env.DB;

  const { results } = await db
    .prepare("SELECT * FROM transactions ORDER BY created_at DESC")
    .all();

  return NextResponse.json(results);
}

// ADD transaction
export async function POST(req: Request, context: any) {
  const db = context.env.DB;

  const body = await req.json();
  const { type, amount, category, note } = body;

  if (!type || !amount) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db
    .prepare(
      `INSERT INTO transactions (type, amount, category, note)
       VALUES (?, ?, ?, ?)`
    )
    .bind(type, amount, category || null, note || null)
    .run();

  return NextResponse.json({ success: true });
}