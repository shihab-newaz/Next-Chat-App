// import { StreamChat } from 'stream-chat';
import twilio from 'twilio';
import { NextResponse } from 'next/server';

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messageSID = process.env.TWILIO_MSID;
const twilioClient = twilio(accountSID, authToken);

export async function GET() {
  return NextResponse.json({ message: "Server is running" });
}

export async function POST(request) {
  const { message, user: sender, type, members } = await request.json();
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