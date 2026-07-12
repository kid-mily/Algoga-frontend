import type { PackageNotice } from "../packageDetail.types";

interface ReservationGuideProps {
  notices: PackageNotice[];
}

// 예약 안내 탭: 예약금, 취소/환불, 여권/비자, 쿠폰/마일리지 안내 카드
export default function ReservationGuide({ notices }: ReservationGuideProps) {
  return (
    <div className="space-y-3">
      {notices.map((notice) => (
        <div
          key={notice.title}
          className="rounded-xl border border-[#E1E8EF] bg-white p-5"
        >
          <h3 className="text-sm font-bold text-[#0A1628]">{notice.title}</h3>
          <ul className="mt-3 space-y-2">
            {notice.items.map((item) => (
              <li
                key={item}
                className="text-xs leading-5 text-[#718096]"
              >
                · {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
