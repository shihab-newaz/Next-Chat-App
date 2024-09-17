// client\src\app\components\ChatClient.js
"use client";

import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { ChannelListContainer, ChannelContainer, Auth } from "./";
import Cookies from "universal-cookie";
import "../styles/App.css";
import "stream-chat-react/dist/css/index.css";
import data from '@emoji-mart/data'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const cookies = new Cookies();

const ChatClient = () => {
  const [client, setClient] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // console.log("ChatClient useEffect running");
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authToken = cookies.get("token");
    // console.log("Checking auth token:", authToken);
    if (authToken) {
      connectUser(authToken);
    } else {
      setIsAuth(false);
    }
  };

  const connectUser = (authToken) => {
    const client = StreamChat.getInstance(apiKey);
    // console.log("Connecting user with token:", authToken);
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("userName"),
          fullName: cookies.get("fullName"),
          image: cookies.get("avatarURL"),
          hashedPassword: cookies.get("hashedPassword"),
          phoneNumber: cookies.get("phoneNumber"),
        },
        authToken
      )
      .then(() => {
         console.log("User connected successfully");
        setClient(client);
        setIsAuth(true);
      })
      .catch((error) => {
        console.error("Error connecting user:", error);
        setIsAuth(false);
      });
  };

  const handleAuth = () => {
    
    // console.log("handleAuth called");
    checkAuth();
  };

  // console.log("Render - isAuth:", isAuth);

  if (!isAuth) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="app__wrapper">
      <Chat client={client} theme="team dark" emojiData={data}> 
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />
        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
        />
      </Chat>
    </div>
  );
};

export default ChatClient;
