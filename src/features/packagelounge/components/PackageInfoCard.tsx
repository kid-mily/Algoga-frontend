interface PackageInfoCardProps {
  label: string;
  value: string;
  // muted: 예약 페이지의 고정값(국적/여권 종류)처럼 읽기 전용임을 나타낼 때 사용
  tone?: "default" | "muted";
}

// 라벨 + 값 형태의 정보를 보여주는 작은 카드 (패키지 안내 탭, 예약 페이지 등에서 재사용)
export default function PackageInfoCard({
  label,
  value,
  tone = "default",
}: PackageInfoCardProps) {
  const isMuted = tone === "muted";

  return (
    <div
      className={`rounded-xl border border-[#E1E8EF] p-4 ${
        isMuted ? "bg-[#F3F8FC]" : "bg-white"
      }`}
    >
      <p className="text-xs text-[#718096]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#0A1628]">{value}</p>
    </div>
  );
}
