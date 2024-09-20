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

const MAX_SMS_LENGTH = 160; // Standard SMS length

export async function POST(request) {
  const { sender, senderID, channel, channelName, message, recipient, recipientName, isDirectMessage } = await request.json();

  try {
    // Fetch the recipient's user data from Stream
    const { users } = await serverClient.queryUsers({ id: recipient });
    if (!users.length) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const recipientPhoneNumber = users[0].phoneNumber;

    if (!recipientPhoneNumber) {
      return NextResponse.json({ error: "Recipient phone number not found" }, { status: 404 });
    }

    // Format the SMS body
    let smsBody;
    if (isDirectMessage) {
      smsBody = `New message from ${sender}: ${message}`;
    } else {
      smsBody = `New message from ${sender} in channel ${channelName}: ${message}`;
    }

    // Truncate SMS body if it exceeds max length
    if (smsBody.length > MAX_SMS_LENGTH) {
      smsBody = smsBody.substring(0, MAX_SMS_LENGTH - 3) + '...';
    }

    try {
      // Attempt to send SMS using Twilio
      await twilioClient.messages.create({
        body: smsBody,
        messagingServiceSid: messageSID,
        to: recipientPhoneNumber,
      });
      return NextResponse.json({ success: true, method: 'sms' });
    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      
      if (twilioError.code === 30454) {
        // console.log('SMS limit reached. Try again later.');
        return NextResponse.json({ success: false, error: 'SMS limit reached. Try again later.' });
      } else {
        // For other Twilio errors, return an error response
        return NextResponse.json({ success: false, error: 'Failed to send SMS', details: twilioError.message }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error in SMS sending process:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}