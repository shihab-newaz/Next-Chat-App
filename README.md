# Real-Time Chat Application

## Overview

This project is a real-time chat application built entirely with Next.js, leveraging the Stream Chat API for real-time messaging capabilities and Twilio for SMS notifications.

## Features

- User authentication (signup and login)
- Real-time messaging
- Channel creation and management
- Direct messaging
- SMS notifications for offline users
- Responsive design for desktop and mobile use

## Tech Stack

- **Frontend & Backend**: Next.js 14.2.11, React
- **Real-time Chat**: Stream Chat API
- **SMS Notifications**: Twilio
- **Authentication**: Custom implementation with bcrypt
- **Styling**: CSS (consider mentioning any CSS framework if used)

## Deployment

This application is deployed on Vercel. You can access the live version here: [Chat App on Vercel](https://next-chat-app-5pej.vercel.app/)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm or yarn
- Stream Chat account and API keys
- Twilio account and API keys

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/chat-app.git
   cd chat-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ``
   NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
   NEXT_PUBLIC_STREAM_API_SECRET=your_stream_api_secret
   NEXT_PUBLIC_STREAM_APP_ID=your_stream_app_id
   NEXT_PUBLIC_TWILIO_ACCOUNT_SID=your_twilio_account_sid
   NEXT_PUBLIC_TWILIO_AUTH_TOKEN=your_twilio_auth_token
   NEXT_PUBLIC_TWILIO_MSID=your_twilio_messaging_service_id
   ```

## Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Routes

- `/api/auth/signup`: User registration
- `/api/auth/login`: User login
- `/api/route`: Handles new message notifications and other API functionalities

## Project Structure

```
chat-app/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.js
│   │   │   │   └── signup/
│   │   │   │       └── route.js
│   │   │   └── route.js
│   │   ├── components/
│   │   │   ├── Auth.jsx
│   │   │   ├── ChannelContainer.jsx
│   │   │   ├── ChannelListContainer.jsx
│   │   │   ├── ChannelSearch.jsx
│   │   │   ├── ChatClient.js
│   │   │   ├── CreateChannel.jsx
│   │   │   ├── CustomMessageInput.jsx
│   │   │   ├── EditChannel.jsx
│   │   │   ├── TeamChannelList.jsx
│   │   │   ├── TeamChannelPreview.jsx
│   │   │   ├── TeamMessage.jsx
│   │   │   └── UserList.jsx
│   │   └── styles/
│   │       └── ... (CSS files)
│   └── assets/
│       └── ... (image files)
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

## License

This project is licensed under the [MIT License](LICENSE).