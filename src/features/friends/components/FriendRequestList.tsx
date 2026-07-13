import { EmptyState } from "./FriendPanel";

export default function FriendRequestList() {
  return (
    <div className="px-5 py-8">
      <EmptyState
        title="받은 친구 요청이 없습니다."
        description="새로운 친구 요청이 오면 이곳에서 확인할 수 있어요."
      />
    </div>
  );
}