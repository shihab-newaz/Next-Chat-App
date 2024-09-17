import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  useMessageInputContext,
  useChannelStateContext,
  useChannelActionContext
} from "stream-chat-react";
import "@/app/styles/CustomInput.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile, PaperclipIcon, Send } from "lucide-react";

const CustomMessageInput = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { setText, text } = useMessageInputContext();
  const { channel } = useChannelStateContext();
  const { sendMessage } = useChannelActionContext();

  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  const insertEmoji = useCallback(
    (emoji) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = text.slice(0, start) + emoji + text.slice(end);

      setText(newText);

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    },
    [text, setText]
  );

  const onEmojiSelect = useCallback(
    (emoji) => {
      console.log("Emoji selected:", emoji.native);
      insertEmoji(emoji.native);
      setShowEmojiPicker(false);
    },
    [insertEmoji]
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
            const messageResponse = await sendMessage({
              text: text || "",
              attachments: [
                {
                  type: "image",
                  image_url: attachmentUrl,
                  fallback: file.name,
                },
              ],
            });
            console.log("Message sent with attachment:", messageResponse);
            setText(''); // Clear the text after sending
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    },
    [channel, text, sendMessage, setText]
  );

  const handleSendMessage = useCallback(
    async (event) => {
      event.preventDefault();
      const trimmedText = (text || "").trim();
      if (trimmedText) {
        try {
  
          const messageResponse = await sendMessage({ text: trimmedText });

          setText(''); // Clear the text after sending
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    },
    [text, sendMessage, setText]
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
          ref={textareaRef}
          className="message-textarea"
          value={text || ""}
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