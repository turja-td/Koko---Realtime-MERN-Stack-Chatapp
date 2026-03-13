import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ImageModal from "./ImageModal";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
    markMessagesAsSeen,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // State for Full Screen Image
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id || !authUser) return;

    getMessages(selectedUser._id);
    subscribeToMessages();
    markMessagesAsSeen(selectedUser._id);

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    authUser,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    markMessagesAsSeen,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (!selectedUser || !authUser) return <div className="flex-1" />;

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      <ChatHeader />

      {/* Full Screen Image Modal */}
      <ImageModal
        isOpen={!!selectedImg}
        onClose={() => setSelectedImg(null)}
        imgSrc={selectedImg}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMyMessage = String(message.senderId) === String(authUser._id);

          return (
            <div
              key={message._id}
              className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMyMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 cursor-zoom-in hover:opacity-90 transition-all"
                    onClick={() => setSelectedImg(message.image)}
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>

              {isMyMessage && (
                <div className="chat-footer opacity-50 text-[10px] mt-1 flex items-center gap-1">
                  {(() => {
                    const lastMsgIndex = messages.findLastIndex(
                      (m) => String(m.senderId) === String(authUser._id),
                    );
                    const lastSeenIndex = messages.findLastIndex(
                      (m) =>
                        String(m.senderId) === String(authUser._id) && m.isSeen,
                    );
                    const currentIndex = messages.indexOf(message);

                    if (message.isSeen && currentIndex === lastSeenIndex)
                      return (
                        <span className="text-blue-400 font-bold">Seen</span>
                      );
                    if (!message.isSeen && currentIndex === lastMsgIndex)
                      return <span>Delivered</span>;
                    return null;
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isTyping && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-base-content/50">
            <div className="loading loading-dots loading-xs"></div>
            <span>{selectedUser.fullName} is typing...</span>
          </div>
        </div>
      )}

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
