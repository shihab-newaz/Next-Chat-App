import { StreamChat } from 'stream-chat';
import twilio from 'twilio';
import { NextResponse } from 'next/server';

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messageSID = process.env.TWILIO_MSID;
const twilioClient = twilio(accountSID, authToken);

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(api_key, api_secret);

export async function GET(request) {
  console.log("GET request received on webhook endpoint");
  return NextResponse.json({ message: "Webhook endpoint is active" });
}

export async function POST(request) {
  console.log("Webhook received at:", new Date().toISOString());

  try {
    const signature = request.headers.get('x-signature');
    console.log("Received signature:", signature);

    const body = await request.text();
    console.log("Received body:", body);

    if (!serverClient.verifyWebhook(body, signature)) {
      console.log("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const data = JSON.parse(body);
    console.log("Parsed webhook data:", JSON.stringify(data, null, 2));

    const { message, user: sender, type, channel } = data;

    if (type !== "message.new") {
      console.log("Event type not handled:", type);
      return NextResponse.json({ message: "Event type not handled" });
    }

    if (!sender || !sender.id || !channel || !channel.type || !channel.id) {
      console.log("Invalid webhook payload");
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    console.log("Processing message from sender:", sender.id);

    const channelInstance = serverClient.channel(channel.type, channel.id);
    console.log("Querying channel state");
    const channelState = await channelInstance.query({ state: true, presence: true });

    if (!channelState.members) {
      console.log("Failed to retrieve channel members");
      return NextResponse.json({ error: "Failed to retrieve channel members" }, { status: 500 });
    }

    const members = Object.values(channelState.members);
    console.log("Channel members:", members.map(m => m.user_id));

    const notificationPromises = members
      .filter((member) => {
        const isOffline = !channelState.state.members[member.user_id]?.online;
        const hasPhoneNumber = !!member.user?.phoneNumber;
        const isNotSender = member.user_id !== sender.id;
        console.log(`Member ${member.user_id}: offline=${isOffline}, hasPhone=${hasPhoneNumber}, notSender=${isNotSender}`);
        return isOffline && hasPhoneNumber && isNotSender;
      })
      .map(async (member) => {
        try {
          console.log(`Attempting to send SMS to ${member.user.phoneNumber}`);
          await twilioClient.messages.create({
            body: `New message from ${sender.name || sender.id} in ${channel.name || channel.id}: ${message.text}`,
            messagingServiceSid: messageSID,
            to: member.user.phoneNumber,
          });
          console.log(`SMS sent successfully to ${member.user.phoneNumber}`);
        } catch (err) {
          console.error(`Failed to send SMS to ${member.user.phoneNumber}:`, err);
        }
      });

    await Promise.all(notificationPromises);

    console.log("Webhook processed successfully");
    return NextResponse.json({ message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}