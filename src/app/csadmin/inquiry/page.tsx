import type { Metadata } from "next";
import CsInquiryManageClient from "@/features/csadmin/inquiry/components/CsInquiryManageClient";
import { mockCsInquiries } from "@/features/csadmin/inquiry/types";

export const metadata: Metadata = {
  title: "고객 문의 관리 | 알고가 CS 관리자",
  description:
    "고객 문의를 검색, 필터링하고 처리 상태를 확인하는 CS 관리자 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CsInquiryPage() {
  return <CsInquiryManageClient initialInquiries={mockCsInquiries} />;
}
