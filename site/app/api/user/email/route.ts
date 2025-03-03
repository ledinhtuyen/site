import { NextResponse } from "next/server";

export async function GET() {
  // For testing purposes, return a fixed email
  const testUserEmail = "test@example.com";
  
  return NextResponse.json({ email: testUserEmail }, { status: 200 });
}
