import React, { useState, useCallback,useRef,useEffect } from "react";
import {
  useMessageInputContext,
  useChannelStateContext,
} from "stream-chat-react";
import "@/app/styles/CustomInput.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile, PaperclipIcon, Send } from "lucide-react";

const CustomMessageInput = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { handleSubmit, setText, text } = useMessageInputContext();
  const { channel } = useChannelStateContext();

  const emojiPickerRef = useRef(null);

  const onEmojiSelect = useCallback(
    (emoji) => {
      console.log("Emoji selected:", emoji.native);
      setText((prevText) => prevText + emoji.native);
      setShowEmojiPicker(false);
    },
    [setText]
  );

  const toggleEmojiPicker = useCallback(() => {
    console.log("Emoji picker toggled");
    setShowEmojiPicker((prev) => !prev);
  }, []);

  const handleFileUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const response = await channel.sendImage(file);
          if (response.file) {
            const attachmentUrl = response.file;
            const messageResponse = await channel.sendMessage({
              text: text,
              attachments: [
                {
                  type: "image",
                  image_url: attachmentUrl,
                  fallback: file.name,
                },
              ],
            });
            console.log("Message sent with attachment:", messageResponse);
            setText("");
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    },
    [channel, text, setText]
  );

  const handleSendMessage = useCallback(
    async (event) => {
      event.preventDefault();
      if (text.trim()) {
        try {
          const messageResponse = await channel.sendMessage({ text });
          console.log("Message sent:", messageResponse);
          setText("");
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    },
    [channel, text, setText]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dark-modern-chat-input">
      <div className="input-wrapper">
        <textarea
          className="message-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message"
        />
        <div className="button-group">
          <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
            <button className="icon-button" onClick={toggleEmojiPicker}>
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <Picker
                  data={data}
                  onEmojiSelect={onEmojiSelect}
                  theme="dark"
                />
              </div>
            )}
          </div>
          <label className="icon-button">
            <PaperclipIcon size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
          <button className="send-button" onClick={handleSendMessage}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomMessageInput;
