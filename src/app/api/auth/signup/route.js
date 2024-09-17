import { connect } from 'getstream';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const api_key = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const api_secret = process.env.NEXT_PUBLIC_STREAM_API_SECRET;
const app_id = process.env.NEXT_PUBLIC_STREAM_APP_ID;

export async function POST(request) {
  try {
    const { fullName, userName, password, phoneNumber } = await request.json();

    if (!fullName || !userName || !password) {
      return NextResponse.json({ error: "Full name, username, and password are required" }, { status: 400 });
    }

    const userId = crypto.randomBytes(16).toString("hex");
    const serverClient = connect(api_key, api_secret, app_id);
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createUserToken(userId);

    return NextResponse.json({ token, fullName, userName, userId, hashedPassword, phoneNumber });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "An unexpected error occurred during signup" }, { status: 500 });
  }
}