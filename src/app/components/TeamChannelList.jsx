import React from "react";
import { AddChannel } from "@/assets";

const TeamChannelList = ({
  children,
  error = false,
  loading,
  type,
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setToggleContainer
}) => {
  if (error) {
    return type === "team" ? (
      <div className="team-channel-list">
        <p className="team-channel-list__message">
          Connection error, please wait
        </p>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          {type === "team" ? "Group Chats" : "Direct Messages"}
          loading ...
        </p>
      </div>
    );
  }

  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === "team" ? "Group Chats" : "Direct Messages"}
        </p>
        <AddChannel
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          setToggleContainer={setToggleContainer}
          type={type==="team" ? "team" : "messaging"}
        />
      </div>
      {children}
    </div>
  );
};

export default TeamChannelList;
