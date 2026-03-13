import { create } from "zustand";
import toast from "react-hot-toast";
import React from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import NotificationToast from "../components/NotificationToast";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  unreadMessages: [], // Track user IDs with unread messages
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  markMessagesAsSeen: async (userId) => {
    try {
      await axiosInstance.post(`/messages/seen/${userId}`);
    } catch (error) {
      console.log("Error marking messages as seen:", error);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("userTyping", ({ senderId }) => {
      if (senderId === get().selectedUser?._id) {
        set({ isTyping: true });
      }
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      if (senderId === get().selectedUser?._id) {
        set({ isTyping: false });
      }
    });

    socket.on("messagesSeen", ({ seenBy }) => {
      if (seenBy === get().selectedUser?._id) {
        set({
          messages: get().messages.map((m) =>
            String(m.senderId) === String(useAuthStore.getState().authUser._id)
              ? { ...m, isSeen: true }
              : m,
          ),
        });
      }
    });

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const isChatOpen = get().selectedUser?._id === newMessage.senderId;

      if (isChatOpen) {
        set({
          messages: [...get().messages, newMessage],
        });
        get().markMessagesAsSeen(newMessage.senderId);
      } else {
        const sender = get().users.find((u) => u._id === newMessage.senderId);

        // Add to unreadMessages list if not already there
        const currentUnread = get().unreadMessages;
        if (!currentUnread.includes(newMessage.senderId)) {
          set({ unreadMessages: [...currentUnread, newMessage.senderId] });
        }

        toast.custom(
          (t) =>
            React.createElement(NotificationToast, {
              t,
              sender,
              newMessage,
              setSelectedUser: get().setSelectedUser,
            }),
          { duration: 4000, position: "top-right" },
        );
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("messagesSeen");
    }
  },

  setSelectedUser: (selectedUser) => {
    if (selectedUser) {
      // Remove this user from the unread list when selected
      set({
        selectedUser,
        unreadMessages: get().unreadMessages.filter(
          (id) => id !== selectedUser._id,
        ),
      });
    } else {
      set({ selectedUser });
    }
  },
}));
