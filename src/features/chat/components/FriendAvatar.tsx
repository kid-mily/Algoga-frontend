import type { Friend } from "../types";

type FriendAvatarProps = {
  friend: Friend;
  fallbackBgClassName?: string;
};

export default function FriendAvatar({
  friend,
  fallbackBgClassName = "bg-[#E7F4F3]",
}: FriendAvatarProps) {
  if (friend.profileImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={friend.profileImageUrl}
        alt=""
        aria-hidden="true"
        className="h-11 w-11 shrink-0 rounded-full border border-[#E4E7EC] object-cover"
      />
    );
  }

  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-[#287875] ${fallbackBgClassName}`}
    >
      {friend.nickname.slice(0, 1)}
    </span>
  );
}
