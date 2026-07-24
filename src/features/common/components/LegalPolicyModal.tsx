"use client";

import { useEffect } from "react";

export type LegalPolicyType = "terms" | "privacy";

type LegalPolicyModalProps = {
  type: LegalPolicyType | null;
  onClose: () => void;
};

const termsSections = [
  {
    title: "제1조 목적",
    body: "본 약관은 주식회사 알고가(이하 “회사”)가 제공하는 여행 교육, 강의, 일정 추천, 예약, 커뮤니티 및 관련 서비스의 이용 조건과 회사와 회원의 권리·의무를 정하는 것을 목적으로 합니다.",
  },
  {
    title: "제2조 회원가입 및 계정",
    body: "회원은 정확한 정보를 제공해야 하며 본인의 계정을 안전하게 관리할 책임이 있습니다. 타인의 정보를 도용하거나 계정을 양도·대여할 수 없습니다.",
  },
  {
    title: "제3조 서비스 제공",
    body: "회사는 여행 강의, AI 일정 추천, 커뮤니티, 패키지 예약·결제 및 고객 문의 서비스를 제공합니다. 점검, 장애 또는 운영상 필요한 경우 서비스의 일부가 일시 중단될 수 있습니다.\n\n구매한 강의는 구매일로부터 6개월 동안 수강할 수 있으며, 강의 결제에 따른 마일리지 지급 가능 기간은 결제일로부터 1개월입니다.",
  },
  {
    title: "제4조 결제·취소 및 환불",
    body: "유료 서비스의 가격과 결제 조건은 구매 화면에 표시합니다. 취소·환불은 관계 법령, 상품별 환불 정책 및 결제 화면에서 안내한 조건에 따르며, 실제 환불 시점은 결제수단과 결제사 정책에 따라 달라질 수 있습니다.",
  },
  {
    title: "제5조 쿠폰 및 마일리지",
    body: "쿠폰은 발급일로부터 1개월, 마일리지는 발급일로부터 1년 동안 사용할 수 있으며 유효기간이 지나면 자동 소멸합니다. 탈퇴 시 보유 쿠폰과 마일리지는 즉시 소멸하며 복구되지 않습니다.",
  },
  {
    title: "제6조 회원의 게시물 및 콘텐츠",
    body: "회원은 타인의 권리나 법령을 침해하는 게시물을 작성해서는 안 됩니다. 커뮤니티 게시글·댓글·채팅·알림 내역을 사용자가 삭제하면 즉시 비활성화되고 14일 후 영구 삭제됩니다.\n\n문의 내역, 강의 Q&A 및 강의 후기는 서비스의 답변·수강 이력과 연결되므로 사용자가 직접 수정하거나 삭제할 수 없습니다. 등록 전 이 점을 확인해야 합니다.",
  },
  {
    title: "제7조 커뮤니티 게시글 조회수",
    body: "일반 이용자가 커뮤니티 게시글 상세 화면을 조회하면 조회수가 반영됩니다. 동일한 이용자의 반복 조회는 6시간 동안 1회만 반영되며, 6시간이 지난 후 다시 조회하면 새로운 조회로 반영됩니다.\n\n로그인 회원은 계정 단위로, 비로그인 이용자는 접속 IP 단위로 중복 조회 여부를 판단합니다. 관리자 전용 화면에서 게시글을 확인하는 경우에는 조회수가 증가하지 않습니다.\n\n조회수는 시스템에 누적된 값을 합산하여 표시하므로 내부 반영 작업이 진행 중인 경우에도 현재 조회수가 화면에 제공됩니다. 존재하지 않거나 삭제된 게시글은 조회할 수 없습니다.",
  },
  {
    title: "제8조 AI 서비스",
    body: "AI가 제공하는 일정과 답변은 참고 정보이며 정확성·완전성이 항상 보장되는 것은 아닙니다. 예약, 출입국, 안전 및 비용과 관련된 중요 정보는 이용자가 공식 기관이나 사업자를 통해 최종 확인해야 합니다.",
  },
  {
    title: "제9조 회원 탈퇴",
    body: "진행 중인 예약 또는 환불이 있는 회원은 해당 절차가 종료될 때까지 탈퇴할 수 없습니다. 탈퇴를 위해서는 탈퇴 전용 이메일 인증을 완료해야 합니다.\n\n탈퇴 즉시 로그아웃되며 쿠폰, 마일리지, 수강 정보, 친구, 채팅, 캘린더, 알림, 수료증, 강의 Q&A 및 뱃지 등 계정에 종속된 정보는 삭제됩니다. 탈퇴한 이메일은 부정 이용 방지를 위해 탈퇴일로부터 30일 동안 재가입에 사용할 수 없으며, 아이디와 전화번호는 즉시 다시 사용할 수 있습니다.",
  },
  {
    title: "제10조 서비스 콘텐츠의 비활성화",
    body: "강의가 삭제된 경우 즉시 비활성화되어 신규 결제가 제한됩니다. 쿠폰이 삭제된 경우 즉시 비활성화되어 더 이상 발급되지 않습니다. 퀴즈와 진단평가는 운영 정책에 따라 즉시 수정 또는 삭제될 수 있습니다.",
  },
  {
    title: "제11조 이용 제한 및 계약 해지",
    body: "회원이 법령이나 본 약관을 위반하거나 서비스 운영을 방해한 경우 회사는 사전 통지 후 이용을 제한할 수 있습니다. 긴급한 권리 침해나 보안 문제가 있는 경우에는 사후 통지할 수 있습니다.",
  },
  {
    title: "제12조 책임 및 분쟁 해결",
    body: "회사는 고의 또는 과실로 회원에게 손해를 발생시킨 경우 관계 법령에 따라 책임을 부담합니다. 분쟁은 상호 협의를 우선하며 해결되지 않는 경우 대한민국 법령과 관할 법원 절차를 따릅니다.",
  },
];

const privacySections = [
  {
    title: "1. 개인정보 처리 목적",
    body: "회사는 회원 식별과 가입 관리, 이메일 인증, 강의 수강, 여행 예약·결제·환불, 커뮤니티 운영, 고객 문의 처리, 부정 이용 방지 및 서비스 개선을 위해 개인정보를 처리합니다.",
  },
  {
    title: "2. 처리하는 개인정보 항목",
    body: "회원가입 시 이름, 아이디, 이메일, 휴대전화번호, 생년월일, 성별, 닉네임 및 약관 동의 정보를 처리할 수 있습니다. 예약 시 여권·탑승객 정보, 결제 시 결제 식별정보와 결제 내역, 서비스 이용 시 접속기록·쿠키·이용기록이 추가로 처리될 수 있습니다.\n\n커뮤니티 게시글 조회수의 중복 반영을 방지하기 위해 로그인 회원의 이용자 번호 또는 비로그인 이용자의 접속 IP를 처리합니다.",
  },
  {
    title: "3. 보유 및 이용기간",
    body: "회원 정보는 회원 탈퇴 시 비활성화되며 탈퇴일로부터 14일 후 회원 테이블에서 영구 삭제됩니다.\n\n게시글 조회수 중복 방지를 위한 계정·접속 IP 기반 식별 정보는 게시글별로 최대 6시간 동안 보관한 후 자동 삭제됩니다.\n\n다만 관계 법령에 따라 계약·결제 기록은 5년, 소비자 불만·분쟁 처리 기록은 3년, 표시·광고 기록은 6개월 등 법정 보존기간 동안 별도로 보관할 수 있습니다. 법정 보존기간이 끝나면 지체 없이 파기합니다.",
  },
  {
    title: "4. 회원 탈퇴 전 확인사항",
    body: "회사는 다음 순서로 탈퇴 가능 여부를 확인하며, 하나라도 충족하지 않으면 탈퇴 처리를 중단합니다.\n\n1) 이미 탈퇴한 계정인지 확인\n2) 진행 중인 예약 존재 여부 확인\n3) 진행 중인 환불 존재 여부 확인\n4) 탈퇴 전용 이메일 인증 완료 여부 확인\n\n예약·환불 확인을 이메일 인증보다 먼저 수행하여 탈퇴할 수 없는 이용자가 불필요하게 인증 절차를 거치지 않도록 합니다.",
  },
  {
    title: "5. 탈퇴 시 즉시 삭제되는 정보",
    body: "탈퇴가 완료되면 쿠폰, 마일리지, 수강 중인 강의와 퀴즈·진단평가 등 학습 정보, 친구, 채팅, 캘린더, 알림 내역, 수료증, 강의 Q&A 및 뱃지 정보가 즉시 삭제됩니다.\n\n로그인 상태를 유지하는 정보도 즉시 삭제되어 이용 중인 모든 기기에서 로그아웃됩니다.",
  },
  {
    title: "6. 탈퇴 후에도 보존되는 정보",
    body: "거래·분쟁 처리와 서비스 기록 보존을 위해 게시글과 해당 좋아요·싫어요·신고 내역, 댓글, 결제, 예약, 환불, 문의, 챗봇 내역 및 강의 후기는 회원 탈퇴 후에도 보존될 수 있습니다.\n\n보존 정보는 관련 법령과 내부 보존 목적에 필요한 범위에서만 이용하며, 목적 달성 또는 법정 보존기간 종료 후 파기합니다.",
  },
  {
    title: "7. 식별정보 변경 및 재가입 제한",
    body: "탈퇴 즉시 이메일, 아이디, 휴대전화번호에는 삭제 계정임을 나타내는 임의의 식별값이 추가되어 원래 값과 분리됩니다.\n\n탈퇴한 이메일은 부정 재가입과 혜택 중복 수령 방지를 위해 30일 동안 재사용할 수 없습니다. 회원 정보가 14일 후 영구 삭제되더라도 이메일 재가입 제한은 탈퇴일로부터 30일까지 유지됩니다. 아이디와 휴대전화번호는 별도의 제한 기간 없이 다시 사용할 수 있습니다.",
  },
  {
    title: "8. 개별 콘텐츠 삭제 정책",
    body: "회원이 커뮤니티 게시글·댓글·채팅·알림 내역을 개별 삭제하면 즉시 비활성화되며 14일 후 영구 삭제됩니다. 문의 내역, 강의 Q&A 및 강의 후기는 기록의 신뢰성과 답변 이력 보존을 위해 사용자가 직접 수정하거나 삭제할 수 없습니다.",
  },
  {
    title: "9. 개인정보의 파기",
    body: "보유기간이 끝나거나 처리 목적을 달성한 개인정보는 복구할 수 없는 방법으로 파기합니다. 소프트 삭제 대상 정보는 비활성화 기간 동안 접근을 제한하고, 14일이 지나면 자동 삭제합니다. 법령에 따라 보존해야 하는 정보는 다른 정보와 분리하여 보관합니다.",
  },
  {
    title: "10. 제3자 제공 및 처리위탁",
    body: "회사는 이용자의 동의 또는 법적 근거 없이 개인정보를 제3자에게 제공하지 않습니다. 결제, 이메일 발송, 클라우드 운영 등 서비스 제공에 필요한 업무를 외부 사업자에게 위탁하는 경우 수탁자와 업무 내용을 공개하고 안전하게 관리합니다.",
  },
  {
    title: "11. 이용자의 권리",
    body: "이용자는 자신의 개인정보에 대한 열람, 정정, 삭제, 처리정지 및 동의 철회를 요청할 수 있습니다. 다만 관계 법령 또는 본 방침의 보존 정책에 따라 일부 요청이 제한될 수 있으며, 제한 사유를 이용자에게 안내합니다.",
  },
  {
    title: "12. 안전성 확보조치",
    body: "회사는 접근 권한 관리, 인증정보 보호, 접속기록 보관, 전송구간 암호화 및 보안 점검 등 개인정보 보호에 필요한 관리적·기술적 조치를 시행합니다.",
  },
  {
    title: "13. 개인정보 보호 문의",
    body: "개인정보 관련 문의, 불만 및 권리 행사는 algoga.official@gmail.com으로 접수할 수 있습니다. 개인정보 보호책임자와 담당 부서의 상세 정보는 실제 서비스 운영 주체 확정 후 본 방침에 반영합니다.",
  },
];

export default function LegalPolicyModal({
  type,
  onClose,
}: LegalPolicyModalProps) {
  useEffect(() => {
    if (!type) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const isPrivacy = type === "privacy";
  const title = isPrivacy ? "개인정보처리방침" : "이용약관";
  const sections = isPrivacy ? privacySections : termsSections;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-policy-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="flex max-h-[min(760px,90dvh)] w-full max-w-[760px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-[#E4E7EC] px-5 py-4 sm:px-7">
          <div>
            <h2 id="legal-policy-title" className="text-xl font-bold text-[#111827] sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1 text-xs text-[#667085]">시행일: 2026년 7월 23일</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`${title} 닫기`}
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-[#667085] transition hover:bg-[#F2F4F7] hover:text-[#111827]"
          >
            ×
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="mb-6 rounded-[12px] bg-[#F2F8F7] px-4 py-3 text-sm leading-6 text-[#456865]">
            본 문서는 알고가 서비스 운영을 위한 기본 초안입니다. 실제 적용 전
            사업자 정보, 수탁업체, 개인정보 보호책임자, 수집 항목과 보유기간을
            운영 환경에 맞게 확인해야 합니다.
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <section key={section.title}>
                <h3 className="text-base font-bold text-[#111827]">{section.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#475467]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>

        <footer className="border-t border-[#E4E7EC] px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-[12px] bg-[#439A97] text-sm font-bold text-white transition hover:bg-[#367C79]"
          >
            확인
          </button>
        </footer>
      </section>
    </div>
  );
}
