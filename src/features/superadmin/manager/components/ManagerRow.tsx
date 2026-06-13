import Link from "next/link";
import { AdminManager } from "../types";

type ManagerRowProps = {
  manager: AdminManager;
  onDelete: (manager: AdminManager) => void;
};

export default function ManagerRow({ manager, onDelete }: ManagerRowProps) {
  return (
    <tr className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
      <td className="px-3 py-5 font-semibold">{manager.displayId}</td>
      <td className="px-3 py-5 font-semibold text-[#111827]">
        <span className="block truncate">{manager.loginId}</span>
      </td>
      <td className="px-3 py-5">
        <span className="block truncate">{manager.name}</span>
      </td>
      <td className="px-3 py-5">
        <span className="block truncate">{manager.phone}</span>
      </td>
      <td className="px-3 py-5">
        <span className="block truncate">{manager.email}</span>
      </td>
      <td className="px-3 py-5">
        <span className="inline-block max-w-full truncate rounded-full bg-[#DCFCE7] px-3 py-1 text-[12px] font-bold text-[#439A97] align-middle">
          {manager.roleLabel}
        </span>
      </td>
      <td className="px-3 py-5 text-[#667085]">
        <span className="block truncate">{manager.createdAt}</span>
      </td>
      <td className="px-3 py-5">
        <span
          className={`inline-block max-w-full truncate rounded-full px-3 py-1 text-[12px] font-bold ${
            manager.active
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : "bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {manager.active ? "활동중" : "비활성"}
        </span>
      </td>
      <td className="px-3 py-5">
        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/superadmin/manage/${manager.managerId}`}
            aria-label={`${manager.name} 관리자 수정`}
            className="text-[#439A97]"
          >
            <img
              src="/images/edit.svg"
              alt=""
              aria-hidden="true"
              className="h-[17px] w-[17px]"
            />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(manager)}
            aria-label={`${manager.name} 관리자 삭제`}
            className="text-[#EF4444]"
          >
            <img
              src="/images/delete.svg"
              alt=""
              aria-hidden="true"
              className="h-[17px] w-[17px]"
            />
          </button>
        </div>
      </td>
    </tr>
  );
}
