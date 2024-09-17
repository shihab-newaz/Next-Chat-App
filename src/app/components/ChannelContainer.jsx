// src/app/components/ChannelContainer.jsx
"use client";
import React from "react";
import {
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import { CreateChannel, EditChannel, CustomMessageInput } from "./";
import CustomChannelHeader from "./CustomChanelHeader";
import "@/app/styles/ChannelContainer.css";

const ChannelContainer = ({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}) => {
  if (isCreating) {
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="channel__container">
        <EditChannel setIsEditing={setIsEditing} />
      </div>
    );
  }

  const EmptyState = () => (
    <div className="channel__container">
      <p className="channel__empty__first">
        This is the beginning of your chat history.
      </p>
      <p className="channel__empty__second">
        Send messages, attachments, links, emojis, and more!
      </p>
    </div>
  );

  return (
    <div className="channel__container">
      <Channel EmptyStateIndicator={EmptyState}>
        <Window>
          <CustomChannelHeader setIsEditing={setIsEditing} />
          <MessageList />
          <MessageInput Input={CustomMessageInput} />
        </Window>
        <Thread />
      </Channel>
    </div>
  );
};

export default ChannelContainer;
