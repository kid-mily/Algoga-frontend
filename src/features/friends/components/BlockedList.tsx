import { EmptyState } from "./FriendPanel";

export default function BlockedList() {
  return (
    <div className="px-5 py-8">
      <EmptyState
        title="차단한 사용자가 없습니다."
        description="차단한 친구가 생기면 이곳에서 확인할 수 있어요."
      />
    </div>
  );
}