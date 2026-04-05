import { NextResponse } from "next/server";

export const runtime = "edge";

// GET
export async function GET(request: Request) {
  // @ts-ignore
  const db = (globalThis as any).DB;

  if (!db) {
    return NextResponse.json({ error: "DB not found" }, { status: 500 });
  }

  const { results } = await db
    .prepare("SELECT * FROM transactions ORDER BY created_at DESC")
    .all();

  return NextResponse.json(results);
}

// POST
export async function POST(request: Request) {
  // @ts-ignore
  const db = (globalThis as any).DB;

  if (!db) {
    return NextResponse.json({ error: "DB not found" }, { status: 500 });
  }

  const body = await request.json();
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