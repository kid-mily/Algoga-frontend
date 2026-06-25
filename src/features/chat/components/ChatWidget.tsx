// src/features/chat/components/ChatWidget.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  createDirectChatRoom,
  createGroupChatRoom,
  getChatRooms,
  getFriends,
  leaveChatRoom,
} from "../services/chatService";
import type { ChatPanelView, ChatRoom, Friend } from "../types/chat";
import ChatListPanel from "./ChatListPanel";
import ChatRoomPanel from "./ChatRoomPanel";
import FriendSelectPanel from "./FriendSelectPanel";
import GroupChatCreatePanel from "./GroupChatCreatePanel";

const adminPathPrefixes = [
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

export default function ChatWidget() {
  const pathname = usePathname();
  const isAdminPage = adminPathPrefixes.some((prefix) => pathname.startsWith(prefix));
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ChatPanelView>("list");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [roomsError, setRoomsError] = useState("");
  const [friendsError, setFriendsError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRooms = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoadingRooms(true);
      setRoomsError("");

      const data = await getChatRooms(signal);
      setRooms(data);
    } catch (error) {
      if (signal?.aborted) return;

      setRoomsError(error instanceof Error ? error.message : "채팅방 목록을 불러오지 못했습니다.");
    } finally {
      if (!signal?.aborted) {
        setIsLoadingRooms(false);
      }
    }
  }, []);

  const loadFriends = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoadingFriends(true);
      setFriendsError("");

      const data = await getFriends(signal);
      setFriends(data);
    } catch (error) {
      if (signal?.aborted) return;

      setFriendsError(error instanceof Error ? error.message : "친구 목록을 불러오지 못했습니다.");
    } finally {
      if (!signal?.aborted) {
        setIsLoadingFriends(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen || isAdminPage) return;

    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRooms(controller.signal);

    return () => {
      controller.abort();
    };
  }, [isAdminPage, isOpen, loadRooms]);

  useEffect(() => {
    if (isAdminPage) return;

    const handleToggleChat = () => {
      setIsOpen((prev) => {
        const nextOpen = !prev;

        if (nextOpen) {
          setView("list");
          setSelectedRoom(null);
        }

        return nextOpen;
      });
    };

    window.addEventListener("chat-widget-toggle", handleToggleChat);

    return () => {
      window.removeEventListener("chat-widget-toggle", handleToggleChat);
    };
  }, [isAdminPage]);


  const handleClose = () => {
    setIsOpen(false);
    setView("list");
    setSelectedRoom(null);
  };

  const handleStartDirectChat = () => {
    setView("direct-create");
    const controller = new AbortController();
    loadFriends(controller.signal);
  };

  const handleStartGroupChat = () => {
    setView("group-create");
    const controller = new AbortController();
    loadFriends(controller.signal);
  };

  const handleCreateDirectChat = async (friend: Friend) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const room = await createDirectChatRoom(friend.friendId);
      setSelectedRoom(room);
      setView("room");
      await loadRooms();
    } catch (error) {
      setFriendsError(error instanceof Error ? error.message : "1:1 채팅방을 만들지 못했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateGroupChat = async (roomName: string, friendIds: number[]) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const room = await createGroupChatRoom(roomName, friendIds);
      setSelectedRoom(room);
      setView("room");
      await loadRooms();
    } catch (error) {
      setFriendsError(error instanceof Error ? error.message : "그룹 채팅방을 만들지 못했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const markRoomAsRead = useCallback((roomId: number) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.roomId === roomId
          ? {
              ...room,
              unreadCount: 0,
            }
          : room
      )
    );

    setSelectedRoom((prev) =>
      prev?.roomId === roomId
        ? {
            ...prev,
            unreadCount: 0,
          }
        : prev
    );
  }, []);

  const handleLeaveRoom = async (room: ChatRoom) => {
    // console.log("DELETE 호출 직전", room.roomId);
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await leaveChatRoom(room.roomId);
      setRooms((prev) => prev.filter((item) => item.roomId !== room.roomId));

      if (selectedRoom?.roomId === room.roomId) {
        setSelectedRoom(null);
        setView("list");
      }

      await loadRooms();
    } catch (error) {
      setRoomsError(error instanceof Error ? error.message : "채팅방을 나가지 못했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAdminPage) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-28 right-10 z-[9999]">
          {view === "list" && (
            <ChatListPanel
              rooms={rooms}
              isLoading={isLoadingRooms}
              errorMessage={roomsError}
              onClose={handleClose}
              onSelectRoom={(room) => {
                const readRoom = {
                  ...room,
                  unreadCount: 0,
                };

                setSelectedRoom(readRoom);
                markRoomAsRead(room.roomId);
                setView("room");
              }}
              onStartDirectChat={handleStartDirectChat}
              onStartGroupChat={handleStartGroupChat}
              onLeaveRoom={handleLeaveRoom}
            />
          )}

          {view === "direct-create" && (
            <FriendSelectPanel
              friends={friends}
              isLoading={isLoadingFriends || isProcessing}
              errorMessage={friendsError}
              onBack={() => setView("list")}
              onSelectFriend={handleCreateDirectChat}
            />
          )}

          {view === "group-create" && (
            <GroupChatCreatePanel
              friends={friends}
              isLoading={isLoadingFriends || isProcessing}
              errorMessage={friendsError}
              onBack={() => setView("list")}
              onCreateGroup={handleCreateGroupChat}
            />
          )}

          {view === "room" && selectedRoom && (
            <ChatRoomPanel
              room={selectedRoom}
              onBack={() => setView("list")}
              onClose={handleClose}
              onReadRoom={markRoomAsRead}
            />
          )}
        </div>
      )}
    </>
  );
}






