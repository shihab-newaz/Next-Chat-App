// app/api/auth/signup/route.js
import { connect } from 'getstream';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

export async function POST(request) {
  try {
    const { fullName, userName, password, phoneNumber } = await request.json();

    const userId = crypto.randomBytes(16).toString("hex");
    const serverClient = connect(api_key, api_secret, app_id);
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createUserToken(userId);

    return NextResponse.json({ token, fullName, userName, userId, hashedPassword, phoneNumber });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}