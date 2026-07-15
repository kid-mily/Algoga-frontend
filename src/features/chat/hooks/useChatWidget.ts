import { useCallback, useEffect, useState } from "react";

import { ApiRequestError } from "@/lib/api";
import {
  createDirectChatRoom,
  createGroupChatRoom,
  getChatRooms,
  getFriends,
  leaveChatRoom,
} from "../../services/chat.service";
import type {
  ChatMessage,
  ChatPanelView,
  ChatRoom,
  Friend,
  RoomNotification,
} from "../types";
import {
  getTotalUnreadCount,
  sortRoomsByRecentMessage,
} from "../utils";
import { useChatCurrentUser } from "./useChatCurrentUser";
import { useChatNotificationSocket } from "./useChatNotificationSocket";

const chatUnreadCountEventName =
  "chat-unread-count-changed";

type UseChatWidgetOptions = {
  isAdminPage: boolean;
};

type OpenFriendChatEventDetail = {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
};

export const useChatWidget = ({
  isAdminPage,
}: UseChatWidgetOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] =
    useState<ChatPanelView>("list");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedRoom, setSelectedRoom] =
    useState<ChatRoom | null>(null);
  const [leaveTargetRoom, setLeaveTargetRoom] =
    useState<ChatRoom | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] =
    useState(false);
  const [isLoadingFriends, setIsLoadingFriends] =
    useState(false);
  const [roomsError, setRoomsError] = useState("");
  const [isUnauthorized, setIsUnauthorized] =
    useState(false);
  const [friendsError, setFriendsError] = useState("");
  const [isProcessing, setIsProcessing] =
    useState(false);

  const loadRooms = useCallback(
    async (
      signal?: AbortSignal,
      options: { showLoading?: boolean } = {}
    ) => {
      const shouldShowLoading =
        options.showLoading ?? true;

      try {
        if (shouldShowLoading) {
          setIsLoadingRooms(true);
        }

        setRoomsError("");
        setIsUnauthorized(false);

        const data = await getChatRooms(signal);

        setRooms(sortRoomsByRecentMessage(data));
      } catch (error) {
        if (signal?.aborted) return;

        if (
          error instanceof ApiRequestError &&
          error.status === 401
        ) {
          setIsUnauthorized(true);
          setRooms([]);
          return;
        }

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

  const loadFriends = useCallback(
    async (signal?: AbortSignal) => {
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
    },
    []
  );

  const currentUserId = useChatCurrentUser({
    isAdminPage,
    onCleared: () => {
      setRooms([]);

      window.dispatchEvent(
        new CustomEvent(chatUnreadCountEventName, {
          detail: 0,
        })
      );
    },
  });

  useEffect(() => {
    const totalUnreadCount =
      getTotalUnreadCount(rooms);

    window.dispatchEvent(
      new CustomEvent(chatUnreadCountEventName, {
        detail: totalUnreadCount,
      })
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

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadRooms(undefined, {
          showLoading: false,
        });
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [currentUserId, isAdminPage, loadRooms]);

  useEffect(() => {
    if (!isOpen || isAdminPage || !currentUserId) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      void loadRooms(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    currentUserId,
    isAdminPage,
    isOpen,
    loadRooms,
  ]);

  const isLoginRequired =
    !currentUserId || isUnauthorized;

  useEffect(() => {
    if (isAdminPage) return;

    const handleToggleChat = () => {
      setIsOpen((previous) => {
        const nextOpen = !previous;

        if (nextOpen) {
          setView("list");
          setSelectedRoom(null);
        }

        return nextOpen;
      });
    };

    window.addEventListener(
      "chat-widget-toggle",
      handleToggleChat
    );

    return () => {
      window.removeEventListener(
        "chat-widget-toggle",
        handleToggleChat
      );
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

  const handleCreateDirectChat = useCallback(
    async (friend: Friend) => {
      if (isProcessing) return;

      try {
        setIsProcessing(true);
        setFriendsError("");

        const room = await createDirectChatRoom(
          friend.friendId
        );

        setSelectedRoom(room);
        setView("room");

        await loadRooms();
      } catch (error) {
        setFriendsError(
          error instanceof Error
            ? error.message
            : "1:1 채팅방을 열지 못했습니다."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, loadRooms]
  );

  useEffect(() => {
    if (isAdminPage) return;

    const handleOpenFriendChat = (event: Event) => {
      const customEvent =
        event as CustomEvent<OpenFriendChatEventDetail>;

      const friendData = customEvent.detail;

      if (
        !friendData ||
        !Number.isFinite(friendData.userId) ||
        friendData.userId <= 0
      ) {
        return;
      }

      const chatFriend: Friend = {
        friendId: friendData.userId,
        nickname: friendData.nickname,
        profileImageUrl:
          friendData.profileImageUrl,
      };

      setIsOpen(true);

      void handleCreateDirectChat(chatFriend);
    };

    window.addEventListener(
      "chat-widget-open-friend",
      handleOpenFriendChat
    );

    return () => {
      window.removeEventListener(
        "chat-widget-open-friend",
        handleOpenFriendChat
      );
    };
  }, [handleCreateDirectChat, isAdminPage]);

  const handleCreateGroupChat = async (
    roomName: string,
    friendIds: number[]
  ) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const room = await createGroupChatRoom(
        roomName,
        friendIds
      );

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

  const markRoomAsRead = useCallback(
    (roomId: number) => {
      setRooms((previous) =>
        previous.map((room) =>
          room.roomId === roomId
            ? {
                ...room,
                unreadCount: 0,
              }
            : room
        )
      );

      setSelectedRoom((previous) =>
        previous?.roomId === roomId
          ? {
              ...previous,
              unreadCount: 0,
            }
          : previous
      );
    },
    []
  );

  const updateRoomPreview = useCallback(
    (
      roomId: number,
      lastMessage: string,
      lastMessageAt: string,
      unreadCount?: number
    ) => {
      setRooms((previous) => {
        let hasRoom = false;

        const nextRooms = previous.map((room) => {
          if (room.roomId !== roomId) {
            return room;
          }

          hasRoom = true;

          return {
            ...room,
            lastMessage,
            lastMessageAt,
            unreadCount:
              unreadCount ??
              room.unreadCount ??
              0,
          };
        });

        if (!hasRoom) {
          void loadRooms();

          return previous;
        }

        return sortRoomsByRecentMessage(nextRooms);
      });
    },
    [loadRooms]
  );

  const handleCurrentRoomMessage = useCallback(
    (message: ChatMessage) => {
      updateRoomPreview(
        message.roomId,
        message.content,
        message.createdAt,
        0
      );
    },
    [updateRoomPreview]
  );

  const handleRoomUpdated = useCallback(
    (room: ChatRoom) => {
      setSelectedRoom(room);
      setView("room");

      setRooms((previous) => {
        const hasRoom = previous.some(
          (item) => item.roomId === room.roomId
        );

        const nextRooms = hasRoom
          ? previous.map((item) =>
              item.roomId === room.roomId
                ? { ...item, ...room }
                : item
            )
          : [room, ...previous];

        return sortRoomsByRecentMessage(nextRooms);
      });

      void loadRooms(undefined, {
        showLoading: false,
      });
    },
    [loadRooms]
  );

  const handleRoomNotification = useCallback(
    (notification: RoomNotification) => {
      const isCurrentRoomOpen =
        isOpen &&
        view === "room" &&
        selectedRoom?.roomId ===
          notification.roomId;

      updateRoomPreview(
        notification.roomId,
        notification.lastMessage,
        notification.lastMessageAt,
        isCurrentRoomOpen
          ? 0
          : notification.unreadCount
      );
    },
    [
      isOpen,
      selectedRoom?.roomId,
      updateRoomPreview,
      view,
    ]
  );

  useChatNotificationSocket({
    userId: currentUserId,
    onNotification: handleRoomNotification,
    onConnected: () => {
      void loadRooms(undefined, {
        showLoading: false,
      });
    },
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

      setRooms((previous) =>
        previous.filter(
          (item) =>
            item.roomId !== leaveTargetRoom.roomId
        )
      );

      if (
        selectedRoom?.roomId ===
        leaveTargetRoom.roomId
      ) {
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
    isLoginRequired,
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