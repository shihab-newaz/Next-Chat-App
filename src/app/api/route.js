import { StreamChat } from 'stream-chat';
import twilio from 'twilio';
import { NextResponse } from 'next/server';

const accountSID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const messageSID = process.env.NEXT_PUBLIC_TWILIO_MSID;
const twilioClient = twilio(accountSID, authToken);

const api_key = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const api_secret = process.env.NEXT_PUBLIC_STREAM_API_SECRET;

let serverClient;

if (api_key && api_secret) {
  serverClient = StreamChat.getInstance(api_key, api_secret);
} else {
  console.warn('Stream API key or secret is missing. Chat functionality may be limited.');
}

export async function GET() {
  return NextResponse.json({ message: "Server is running" });
}

export async function POST(request) {
  if (!serverClient) {
    return NextResponse.json({ error: "StreamChat client is not initialized" }, { status: 500 });
  }

  try {
    const { message, user: sender, type, members } = await request.json();
    
    if (!sender || !sender.id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (type === "message.new") {
      if (!members || !Array.isArray(members)) {
        return NextResponse.json({ error: "Invalid or missing members array" }, { status: 400 });
      }

      const notificationPromises = members
        .filter((member) => member.user_id !== sender.id)
        .map(async ({ user }) => {
          if (!user.online && user.phoneNumber) {
            try {
              await twilioClient.messages.create({
                body: `You have a new message from ${sender.fullName || sender.id} - ${message.text}`,
                messagingServiceSid: messageSID,
                to: user.phoneNumber,
              });
              console.log(`Notification sent to ${user.phoneNumber}`);
            } catch (err) {
              console.error(`Failed to send notification to ${user.phoneNumber}:`, err);
            }
          }
        });

      await Promise.all(notificationPromises);

      return NextResponse.json({ message: "Message processed successfully" });
    }

    return NextResponse.json({ message: "Not a new message request" });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: "An unexpected error occurred while processing the notification" }, { status: 500 });
  }
}