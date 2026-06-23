import Image from "next/image";
import { MyPageUser, UserGender } from "./types";

interface MyPageInfoCardProps {
  user: MyPageUser;
  initial: string;
  onEdit?: () => void;
}

const formatGender = (gender?: UserGender) => {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  if (gender === "OTHER") return "기타";

  return "-";
};

export default function MyPageInfoCard({
  user,
  initial,
  onEdit,
}: MyPageInfoCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E5EDF5] bg-white shadow-sm">
      <header className="bg-[#EAF3FF] px-8 py-6">
        <div className="flex items-center gap-5">
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt={`${user.name} 프로필 사진`}
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#43A6A2] text-3xl font-bold text-white">
              {initial}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#0A1628]">
              {user.nickname}
            </h2>

            <p className="mt-1 truncate text-sm text-[#8A9BB0]">
              {user.email}
            </p>

            <p className="mt-1 text-xs font-medium text-[#439A97]">
              사용자 코드: {user.personalCode || "-"}
            </p>
          </div>
        </div>
      </header>

      <dl className="divide-y divide-[#EEF2F6] px-8">
        <InfoRow label="이름" value={user.name} />
        <InfoRow label="닉네임" value={user.nickname} />
        <InfoRow label="아이디" value={user.username} />
        <InfoRow label="비밀번호" value="••••••••" />
        <InfoRow label="이메일" value={user.email} />
        <InfoRow label="전화번호" value={user.phone || "-"} />
        <InfoRow
          label="성별"
          value={formatGender(user.gender)}
        />
        <InfoRow
          label="생년월일"
          value={user.birthDate || "-"}
        />
      </dl>

      <div className="px-8 pb-6 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="h-12 w-full rounded-xl bg-[#43A6A2] text-sm font-bold text-white transition hover:bg-[#357F7C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43A6A2] focus-visible:ring-offset-2"
        >
          정보 수정
        </button>
      </div>
    </article>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <dt className="font-medium text-gray-400">
        {label}
      </dt>

      <dd className="font-semibold text-gray-900">
        {value || "-"}
      </dd>
    </div>
  );
}