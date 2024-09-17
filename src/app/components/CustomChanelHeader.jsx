import React from "react";
import { useChannelStateContext } from "stream-chat-react";
import { Settings, Users } from "lucide-react";

const CustomChannelHeader = ({ setIsEditing }) => {
  const { channel } = useChannelStateContext();
  const memberCount = Object.keys(channel.state.members).length;
  const onlineCount = Object.values(channel.state.members).filter(
    (member) => member.user?.online
  ).length;

  const isDirectMessage = channel.type === "messaging" && memberCount === 2;

  const getChannelName = () => {
    if (isDirectMessage) {
      const otherMember = Object.values(channel.state.members).find(
        (member) => member.user?.id !== channel._client.userID
      );
      return (
        otherMember?.user?.name || otherMember?.user?.id || "Direct Message"
      );
    }
    return channel.data.name || "Channel";
  };

  return (
    <div className="str-chat__header-livestream str-chat__channel-header">
      <div className="str-chat__header-livestream-left">
        <div className="str-chat__header-livestream-left-avatar">
          {isDirectMessage ? (
            <Users size={24} />
          ) : (
            getChannelName()[0].toUpperCase()
          )}
        </div>
        <div className="str-chat__header-livestream-left-info">
          <p className="str-chat__header-livestream-left-title">
            {getChannelName()}
          </p>
          <p className="str-chat__header-livestream-left-members">
            {isDirectMessage
              ? onlineCount === 2
                ? "Both online"
                : "Offline"
              : `${memberCount} members, ${onlineCount} online`}
          </p>
        </div>
      </div>
      <div className="str-chat__header-livestream-right">
        {!isDirectMessage && (
          <button
            onClick={() => setIsEditing(true)}
            className="str-chat__header-livestream-right-button"
            title="Edit Channel"
          >
            <Settings size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomChannelHeader;
