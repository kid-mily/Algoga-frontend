import { CsInquiry } from "../types";
import CsInquiryRow from "./CsInquiryRow";

type CsInquiryTableProps = {
  inquiries: CsInquiry[];
  isLoading?: boolean;
};

export default function CsInquiryTable({
  inquiries,
  isLoading = false,
}: CsInquiryTableProps) {
  return (
    <section
      aria-labelledby="cs-inquiry-table-title"
      className="overflow-hidden rounded-t-[16px] border border-b-0 border-[#E4E7EC] bg-white"
    >
      <h2 id="cs-inquiry-table-title" className="sr-only">
        고객 문의 목록
      </h2>

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th scope="col" className="w-[120px] px-6 py-4">
              문의번호
            </th>
            <th scope="col" className="w-[130px] px-6 py-4">
              작성자
            </th>
            <th scope="col" className="w-[140px] px-6 py-4">
              문의 유형
            </th>
            <th scope="col" className="px-6 py-4">
              제목
            </th>
            <th scope="col" className="w-[220px] px-6 py-4">
              등록일
            </th>
            <th scope="col" className="w-[160px] px-6 py-4">
              처리 상태
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-[14px] text-[#667085]"
              >
                고객 문의를 불러오는 중입니다...
              </td>
            </tr>
          ) : inquiries.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-[14px] text-[#667085]"
              >
                조건에 맞는 문의가 없습니다.
              </td>
            </tr>
          ) : (
            inquiries.map((inquiry) => (
              <CsInquiryRow key={inquiry.id} inquiry={inquiry} />
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
