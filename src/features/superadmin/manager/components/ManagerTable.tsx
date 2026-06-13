import { AdminManager } from "../types";
import ManagerRow from "./ManagerRow";

type ManagerTableProps = {
  managers: AdminManager[];
  isLoading: boolean;
  onDelete: (manager: AdminManager) => void;
};

export default function ManagerTable({
  managers,
  isLoading,
  onDelete,
}: ManagerTableProps) {
  return (
    <section
      aria-labelledby="manager-table-title"
      className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white"
    >
      <h2 id="manager-table-title" className="sr-only">
        관리자 계정 목록
      </h2>

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th scope="col" className="w-[8%] px-3 py-4">
              관리자 ID
            </th>
            <th scope="col" className="w-[12%] px-3 py-4">
              로그인 ID
            </th>
            <th scope="col" className="w-[9%] px-3 py-4">
              이름
            </th>
            <th scope="col" className="w-[13%] px-3 py-4">
              전화번호
            </th>
            <th scope="col" className="w-[18%] px-3 py-4">
              이메일
            </th>
            <th scope="col" className="w-[13%] px-3 py-4">
              권한
            </th>
            <th scope="col" className="w-[10%] px-3 py-4">
              생성일
            </th>
            <th scope="col" className="w-[8%] px-3 py-4">
              상태
            </th>
            <th scope="col" className="w-[9%] px-3 py-4 text-center">
              관리
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={9}
                className="px-6 py-12 text-center text-[14px] text-[#667085]"
              >
                관리자 계정 목록을 불러오는 중입니다...
              </td>
            </tr>
          ) : managers.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="px-6 py-12 text-center text-[14px] text-[#667085]"
              >
                조건에 맞는 관리자 계정이 없습니다.
              </td>
            </tr>
          ) : (
            managers.map((manager) => (
              <ManagerRow
                key={manager.managerId}
                manager={manager}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
