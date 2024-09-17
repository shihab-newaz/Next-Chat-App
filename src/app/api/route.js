import { StreamChat } from 'stream-chat';
import twilio from 'twilio';
import { NextResponse } from 'next/server';

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messageSID = process.env.TWILIO_MSID;
const twilioClient = twilio(accountSID, authToken);

// Stream Chat client initialization
const api_key = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);

export async function GET() {
  return NextResponse.json({ message: "Server is running" });
}

export async function POST(request) {
  const { message, user: sender, type, members } = await request.json();
  
  if (!sender || !sender.id) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(async ({ user }) => {
        if (!user.online) {
          try {
            await twilioClient.messages.create({
              body: `You have a new message from ${message.user.fullName} - ${message.text}`,
              messagingServiceSid: messageSID,
              to: user.phoneNumber,
            });
            console.log("Message sent!");
          } catch (err) {
            console.log(err);
          }
        }
      });

    return NextResponse.json({ message: "Message sent!" });
  }
  return NextResponse.json({ message: "Not a new message request" });
}