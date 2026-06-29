// 채팅 목록과 뱃지를 위한 WebSocket
import { useMemo, useState } from "react";
import { addChatRoomMembers, getChatRoomMembers, getFriends, renameChatRoom } from "../../services/chat.service";
import type { ChatRoom, ChatRoomMember, Friend } from "../types";

export type ChatRoomPanelMode = "none" | "members" | "add" | "rename";

type UseChatRoomMembersPanelOptions = {
  room: ChatRoom;
  onRoomUpdated?: (room: ChatRoom) => void;
};

export const useChatRoomMembersPanel = ({
  room,
  onRoomUpdated,
}: UseChatRoomMembersPanelOptions) => {
  const [panelMode, setPanelMode] = useState<ChatRoomPanelMode>("none");
  const [members, setMembers] = useState<ChatRoomMember[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
  const [draftRoomName, setDraftRoomName] = useState(room.roomName ?? "");
  const [panelError, setPanelError] = useState("");
  const [isPanelLoading, setIsPanelLoading] = useState(false);
  const [isPanelProcessing, setIsPanelProcessing] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const addableFriends = useMemo(() => {
    const memberIdSet = new Set(members.map((member) => member.userId));

    return friends.filter((friend) => !memberIdSet.has(friend.friendId));
  }, [friends, members]);

  const loadMembers = async () => {
    try {
      setIsPanelLoading(true);
      setPanelError("");
      const data = await getChatRoomMembers(room.roomId);
      setMembers(data);
    } catch (error) {
      setPanelError(
        error instanceof Error ? error.message : "멤버 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsPanelLoading(false);
    }
  };

  const openMembersPanel = () => {
    setIsActionMenuOpen(false);
    setPanelMode("members");
    void loadMembers();
  };

  const openAddPanel = async () => {
    setIsActionMenuOpen(false);
    setPanelMode("add");
    setSelectedFriendIds([]);

    try {
      setIsPanelLoading(true);
      setPanelError("");
      const [nextMembers, nextFriends] = await Promise.all([
        getChatRoomMembers(room.roomId),
        getFriends(),
      ]);
      setMembers(nextMembers);
      setFriends(nextFriends);
    } catch (error) {
      setPanelError(
        error instanceof Error ? error.message : "친구 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsPanelLoading(false);
    }
  };

  const toggleFriend = (friendId: number) => {
    setSelectedFriendIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAddMembers = async () => {
    if (!selectedFriendIds.length || isPanelProcessing) return;

    try {
      setIsPanelProcessing(true);
      setPanelError("");
      const nextRoom = await addChatRoomMembers(room.roomId, selectedFriendIds);
      onRoomUpdated?.(nextRoom);
      setSelectedFriendIds([]);
      setPanelMode("members");
      await loadMembers();
    } catch (error) {
      setPanelError(
        error instanceof Error ? error.message : "멤버를 추가하지 못했습니다."
      );
    } finally {
      setIsPanelProcessing(false);
    }
  };

  const handleRenameRoom = async () => {
    const nextName = draftRoomName.trim();
    if (
      room.type !== "GROUP" ||
      !nextName ||
      nextName.length > 20 ||
      isPanelProcessing
    ) {
      return;
    }

    try {
      setIsPanelProcessing(true);
      setPanelError("");
      await renameChatRoom(room.roomId, nextName);
      onRoomUpdated?.({ ...room, roomName: nextName });
      setPanelMode("none");
    } catch (error) {
      setPanelError(
        error instanceof Error ? error.message : "채팅방 이름을 변경하지 못했습니다."
      );
    } finally {
      setIsPanelProcessing(false);
    }
  };

  const openRenamePanel = () => {
    setIsActionMenuOpen(false);
    setDraftRoomName(room.roomName ?? "");
    setPanelMode("rename");
  };

  return {
    panelMode,
    setPanelMode,
    members,
    selectedFriendIds,
    draftRoomName,
    setDraftRoomName,
    panelError,
    isPanelLoading,
    isPanelProcessing,
    isActionMenuOpen,
    setIsActionMenuOpen,
    addableFriends,
    openMembersPanel,
    openAddPanel,
    toggleFriend,
    handleAddMembers,
    handleRenameRoom,
    openRenamePanel,
  };
};
