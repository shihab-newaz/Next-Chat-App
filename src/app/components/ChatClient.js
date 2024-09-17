//@/app/components/ChatClient.js
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
  const [authError, setAuthError] = useState(null);
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authToken = cookies.get("token");
    if (authToken) {
      connectUser(authToken);
    } else {
      setIsAuth(false);
    }
  };

  const connectUser = (authToken) => {
    const client = StreamChat.getInstance(apiKey);
    const userData = {
      id: cookies.get("userId"),
      name: cookies.get("userName"),
      fullName: cookies.get("fullName"),
      image: cookies.get("avatarURL"),
      hashedPassword: cookies.get("hashedPassword"),
      phoneNumber: cookies.get("phoneNumber"),
    };

    client
      .connectUser(userData, authToken)
      .then(() => {
        console.log("User connected successfully");
        setClient(client);
        setIsAuth(true);
        setAuthError(null);
        localStorage.setItem('isAuth', 'true');
      })
      .catch((error) => {
        console.error("Error connecting user:", error);
        setIsAuth(false);
        setAuthError("Failed to connect user. Please try logging in again.");
        localStorage.removeItem('isAuth');
      });
  };

  const handleAuth = () => {
    checkAuth();
  };

  const handleLogout = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("userName");
    cookies.remove("fullName");
    cookies.remove("avatarURL");
    cookies.remove("hashedPassword");
    cookies.remove("phoneNumber");
    localStorage.removeItem('isAuth');
    setIsAuth(false);
    setClient(null);
  };

  if (!isAuth) {
    return <Auth onAuth={handleAuth} authError={authError} />;
  }

  return (
    <div className="app__wrapper">
      <Chat client={client} theme="team dark" emojiData={data}> 
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          onLogout={handleLogout}
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