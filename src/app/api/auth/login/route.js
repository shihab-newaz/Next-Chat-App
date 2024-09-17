// app/api/auth/login/route.js
import { connect } from 'getstream';
import bcrypt from 'bcrypt';
import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

export async function POST(request) {
  try {
    const { userName, password } = await request.json();

    const serverClient = connect(api_key, api_secret, app_id);
    const client = StreamChat.getInstance(api_key, api_secret);
    const { users } = await client.queryUsers({ name: userName });
    if (!users.length)
      return NextResponse.json({ message: "User not found" }, { status: 400 });

    const success = await bcrypt.compare(password, users[0].hashedPassword);
    const token = serverClient.createUserToken(users[0].id);
    if (success) {
      return NextResponse.json({
        token,
        fullName: users[0].fullName,
        userName,
        userId: users[0].id,
      });
    } else {
      return NextResponse.json({ message: "Incorrect password" }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}