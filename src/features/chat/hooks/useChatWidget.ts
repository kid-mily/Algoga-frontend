import { useCallback, useEffect, useState } from "react";
import { getMe } from "@/features/services/user.service";
import { createDirectChatRoom, createGroupChatRoom, getChatRooms, getFriends, leaveChatRoom } from "../../services/chat.service";
import { getTotalUnreadCount, sortRoomsByRecentMessage } from "../utils";
import { useChatNotificationSocket } from "./useChatNotificationSocket";
import type { ChatMessage, ChatPanelView, ChatRoom, Friend, RoomNotification } from "../types";

const chatUnreadCountEventName = "chat-unread-count-changed";

type UseChatWidgetOptions = {
  isAdminPage: boolean;
};

export const useChatWidget = ({ isAdminPage }: UseChatWidgetOptions) => {
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

        setRoomsError(
          error instanceof Error
            ? error.message
            : "채팅방 목록을 불러오지 못했습니다."
        );
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

      setFriendsError(
        error instanceof Error
          ? error.message
          : "친구 목록을 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoadingFriends(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isAdminPage) {
      const timeoutId = window.setTimeout(() => {
        setCurrentUserId(undefined);
        setRooms([]);

        window.dispatchEvent(
          new CustomEvent(chatUnreadCountEventName, { detail: 0 })
        );
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    let isMounted = true;

    const syncCurrentUser = async () => {
      try {
        const user = await getMe();
        if (!isMounted) return;

        const nextUserId =
          user?.userId && user.userId > 0 ? user.userId : undefined;

        setCurrentUserId(nextUserId);

        if (!nextUserId) {
          setRooms([]);

          window.dispatchEvent(
            new CustomEvent(chatUnreadCountEventName, { detail: 0 })
          );
        }
      } catch {
        if (!isMounted) return;

        setCurrentUserId(undefined);
        setRooms([]);

        window.dispatchEvent(
          new CustomEvent(chatUnreadCountEventName, { detail: 0 })
        );
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
    const totalUnreadCount = getTotalUnreadCount(rooms);

    window.dispatchEvent(
      new CustomEvent(chatUnreadCountEventName, { detail: totalUnreadCount })
    );
  }, [rooms]);

  useEffect(() => {
    if (!currentUserId || isAdminPage) return;

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      void loadRooms(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [currentUserId, isAdminPage, loadRooms]);

  useEffect(() => {
    if (!currentUserId || isAdminPage) return;

    const intervalId = window.setInterval(() => {
      void loadRooms(undefined, { showLoading: false });
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentUserId, isAdminPage, loadRooms]);

  useEffect(() => {
    if (!isOpen || isAdminPage) return;

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      void loadRooms(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
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
    void loadFriends(controller.signal);
  };

  const handleStartGroupChat = () => {
    setView("group-create");

    const controller = new AbortController();
    void loadFriends(controller.signal);
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
      setFriendsError(
        error instanceof Error
          ? error.message
          : "1:1 채팅방을 만들지 못했습니다."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateGroupChat = async (
    roomName: string,
    friendIds: number[]
  ) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const room = await createGroupChatRoom(roomName, friendIds);

      setSelectedRoom(room);
      setView("room");

      await loadRooms();
    } catch (error) {
      setFriendsError(
        error instanceof Error
          ? error.message
          : "그룹 채팅방을 만들지 못했습니다."
      );
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
    (
      roomId: number,
      lastMessage: string,
      lastMessageAt: string,
      unreadCount?: number
    ) => {
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
          ? prev.map((item) =>
              item.roomId === room.roomId ? { ...item, ...room } : item
            )
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
        isOpen &&
        view === "room" &&
        selectedRoom?.roomId === notification.roomId;

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

  const handleSelectRoom = (room: ChatRoom) => {
    const readRoom = {
      ...room,
      unreadCount: 0,
    };

    setSelectedRoom(readRoom);
    markRoomAsRead(room.roomId);
    setView("room");
  };

  const requestLeaveRoom = (room: ChatRoom) => {
    if (isProcessing) return;

    setLeaveTargetRoom(room);
  };

  const cancelLeaveRoom = () => {
    if (isProcessing) return;

    setLeaveTargetRoom(null);
  };

  const handleLeaveRoom = async () => {
    if (!leaveTargetRoom || isProcessing) return;

    try {
      setIsProcessing(true);

      await leaveChatRoom(leaveTargetRoom.roomId);

      setRooms((prev) =>
        prev.filter((item) => item.roomId !== leaveTargetRoom.roomId)
      );

      if (selectedRoom?.roomId === leaveTargetRoom.roomId) {
        setSelectedRoom(null);
        setView("list");
      }

      setLeaveTargetRoom(null);

      await loadRooms();
    } catch (error) {
      setRoomsError(
        error instanceof Error
          ? error.message
          : "채팅방을 나가지 못했습니다."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isOpen,
    view,
    setView,
    rooms,
    friends,
    selectedRoom,
    leaveTargetRoom,
    isLoadingRooms,
    isLoadingFriends,
    roomsError,
    friendsError,
    isProcessing,
    handleClose,
    handleStartDirectChat,
    handleStartGroupChat,
    handleCreateDirectChat,
    handleCreateGroupChat,
    handleCurrentRoomMessage,
    handleRoomUpdated,
    handleSelectRoom,
    markRoomAsRead,
    requestLeaveRoom,
    cancelLeaveRoom,
    handleLeaveRoom,
  };
};
