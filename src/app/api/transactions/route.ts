import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API is working",
    data: [],
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    message: "Received data",
    body,
  });
}