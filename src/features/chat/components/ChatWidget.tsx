// src/features/chat/components/ChatWidget.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMe } from "@/features/services/user.service";
import {
  createDirectChatRoom,
  createGroupChatRoom,
  getChatRooms,
  getFriends,
  leaveChatRoom,
} from "../services/chatService";
import { useChatNotificationSocket } from "../hooks/useChatNotificationSocket";
import type { ChatMessage, ChatPanelView, ChatRoom, Friend, RoomNotification } from "../types/chat";
import ChatListPanel from "./ChatListPanel";
import ChatRoomPanel from "./ChatRoomPanel";
import FriendSelectPanel from "./FriendSelectPanel";
import GroupChatCreatePanel from "./GroupChatCreatePanel";

const chatUnreadCountEventName = "chat-unread-count-changed";

const adminPathPrefixes = [
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

const getRoomSortTime = (room: ChatRoom) => {
  const value = room.lastMessageAt;
  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const sortRoomsByRecentMessage = (rooms: ChatRoom[]) => {
  return [...rooms].sort((a, b) => getRoomSortTime(b) - getRoomSortTime(a));
};

export default function ChatWidget() {
  const pathname = usePathname();
  const isAdminPage = adminPathPrefixes.some((prefix) => pathname.startsWith(prefix));
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ChatPanelView>("list");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [leaveTargetRoom, setLeaveTargetRoom] = useState<ChatRoom | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [roomsError, setRoomsError] = useState("");
  const [friendsError, setFriendsError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRooms = useCallback(
    async (signal?: AbortSignal, options: { showLoading?: boolean } = {}) => {
      const shouldShowLoading = options.showLoading ?? true;

      try {
        if (shouldShowLoading) {
          setIsLoadingRooms(true);
        }
        setRoomsError("");

        const data = await getChatRooms(signal);
        setRooms(sortRoomsByRecentMessage(data));
      } catch (error) {
        if (signal?.aborted) return;

        setRoomsError(error instanceof Error ? error.message : "채팅방 목록을 불러오지 못했습니다.");
      } finally {
        if (!signal?.aborted && shouldShowLoading) {
          setIsLoadingRooms(false);
        }
      }
    },
    []
  );

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
    if (isAdminPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUserId(undefined);
      setRooms([]);
      window.dispatchEvent(new CustomEvent(chatUnreadCountEventName, { detail: 0 }));
      return;
    }

    let isMounted = true;

    const syncCurrentUser = async () => {
      try {
        const user = await getMe();
        if (!isMounted) return;

        const nextUserId = user?.userId && user.userId > 0 ? user.userId : undefined;
        setCurrentUserId(nextUserId);

        if (!nextUserId) {
          setRooms([]);
          window.dispatchEvent(new CustomEvent(chatUnreadCountEventName, { detail: 0 }));
        }
      } catch {
        if (!isMounted) return;

        setCurrentUserId(undefined);
        setRooms([]);
        window.dispatchEvent(new CustomEvent(chatUnreadCountEventName, { detail: 0 }));
      }
    };

    void syncCurrentUser();
    window.addEventListener("auth-state-changed", syncCurrentUser);

    return () => {
      isMounted = false;
      window.removeEventListener("auth-state-changed", syncCurrentUser);
    };
  }, [isAdminPage]);

  useEffect(() => {
    const totalUnreadCount = rooms.reduce(
      (total, room) => total + (room.unreadCount ?? 0),
      0
    );

    window.dispatchEvent(
      new CustomEvent(chatUnreadCountEventName, { detail: totalUnreadCount })
    );
  }, [rooms]);

  useEffect(() => {
    if (!currentUserId || isAdminPage) return;

    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRooms(controller.signal);

    return () => {
      controller.abort();
    };
  }, [currentUserId, isAdminPage, loadRooms]);

  useEffect(() => {
    if (!currentUserId || isAdminPage) return;

    const intervalId = window.setInterval(() => {
      void loadRooms(undefined, { showLoading: false });
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentUserId, isAdminPage, loadRooms]);

  useEffect(() => {
    if (!isOpen || isAdminPage) return;

    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRooms(controller.signal);

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
    setLeaveTargetRoom(null);
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

  const updateRoomPreview = useCallback(
    (roomId: number, lastMessage: string, lastMessageAt: string, unreadCount?: number) => {
      setRooms((prev) => {
        let hasRoom = false;
        const nextRooms = prev.map((room) => {
          if (room.roomId !== roomId) return room;

          hasRoom = true;

          return {
            ...room,
            lastMessage,
            lastMessageAt,
            unreadCount: unreadCount ?? room.unreadCount ?? 0,
          };
        });

        if (!hasRoom) {
          void loadRooms();
          return prev;
        }

        return sortRoomsByRecentMessage(nextRooms);
      });
    },
    [loadRooms]
  );

  const handleCurrentRoomMessage = useCallback(
    (message: ChatMessage) => {
      updateRoomPreview(message.roomId, message.content, message.createdAt, 0);
    },
    [updateRoomPreview]
  );

  const handleRoomUpdated = useCallback(
    (room: ChatRoom) => {
      setSelectedRoom(room);
      setView("room");
      setRooms((prev) => {
        const hasRoom = prev.some((item) => item.roomId === room.roomId);
        const nextRooms = hasRoom
          ? prev.map((item) => (item.roomId === room.roomId ? { ...item, ...room } : item))
          : [room, ...prev];

        return sortRoomsByRecentMessage(nextRooms);
      });
      void loadRooms(undefined, { showLoading: false });
    },
    [loadRooms]
  );

  const handleRoomNotification = useCallback(
    (notification: RoomNotification) => {
      const isCurrentRoomOpen =
        isOpen && view === "room" && selectedRoom?.roomId === notification.roomId;

      updateRoomPreview(
        notification.roomId,
        notification.lastMessage,
        notification.lastMessageAt,
        isCurrentRoomOpen ? 0 : notification.unreadCount
      );
    },
    [isOpen, selectedRoom?.roomId, updateRoomPreview, view]
  );

  useChatNotificationSocket({
    userId: currentUserId,
    onNotification: handleRoomNotification,
  });

  const requestLeaveRoom = (room: ChatRoom) => {
    if (isProcessing) return;

    setLeaveTargetRoom(room);
  };

  const handleLeaveRoom = async () => {
    if (!leaveTargetRoom || isProcessing) return;

    try {
      setIsProcessing(true);
      await leaveChatRoom(leaveTargetRoom.roomId);
      setRooms((prev) => prev.filter((item) => item.roomId !== leaveTargetRoom.roomId));

      if (selectedRoom?.roomId === leaveTargetRoom.roomId) {
        setSelectedRoom(null);
        setView("list");
      }

      setLeaveTargetRoom(null);
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
              onLeaveRoom={requestLeaveRoom}
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
              key={selectedRoom.roomId}
              room={selectedRoom}
              onBack={() => setView("list")}
              onClose={handleClose}
              onReadRoom={markRoomAsRead}
              onRoomMessage={handleCurrentRoomMessage}
              onLeaveRoom={requestLeaveRoom}
              onRoomUpdated={handleRoomUpdated}
              isLeaving={isProcessing}
            />
          )}

          {leaveTargetRoom && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[20px] bg-black/20 px-5">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="chat-leave-title"
                aria-describedby="chat-leave-description"
                className="w-full max-w-[280px] rounded-[16px] bg-white p-5 text-center shadow-[0_16px_40px_rgba(16,24,40,0.24)]"
              >
                <h3 id="chat-leave-title" className="text-[17px] font-bold text-[#111827]">
                  채팅방 나가기
                </h3>
                <p id="chat-leave-description" className="mt-2 text-[13px] leading-5 text-[#667085]">
                  정말 이 채팅방을 나가시겠습니까?
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isProcessing) return;

                      setLeaveTargetRoom(null);
                    }}
                    disabled={isProcessing}
                    className="h-10 flex-1 rounded-[10px] border border-[#D0D5DD] bg-white text-[14px] font-semibold text-[#344054] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleLeaveRoom}
                    disabled={isProcessing}
                    className="h-10 flex-1 rounded-[10px] bg-[#E5484D] text-[14px] font-semibold text-white transition hover:bg-[#D92D20] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isProcessing ? "나가는 중" : "나가기"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}


    </>
  );
}


