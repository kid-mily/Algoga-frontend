import { managerRoleOptions, ManagerRole } from "../types";

const managerSearchRoleOptions = managerRoleOptions.filter(
  (role) => role.value !== "SUPER_ADMIN"
);

type ManagerToolbarProps = {
  searchKeyword: string;
  selectedRole: ManagerRole | "ALL";
  onSearchKeywordChange: (value: string) => void;
  onSelectedRoleChange: (value: ManagerRole | "ALL") => void;
};

export default function ManagerToolbar({
  searchKeyword,
  selectedRole,
  onSearchKeywordChange,
  onSelectedRoleChange,
}: ManagerToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="관리자 계정 검색 및 필터"
        className="flex flex-wrap items-center gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="sr-only" htmlFor="manager-role-filter">
          권한 필터
        </label>
        <select
          id="manager-role-filter"
          value={selectedRole}
          onChange={(event) =>
            onSelectedRoleChange(event.target.value as ManagerRole | "ALL")
          }
          className="h-[42px] w-[160px] shrink-0 rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] text-[#344054] outline-none"
        >
          <option value="ALL">전체 권한</option>
          {managerSearchRoleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        <div className="flex h-[42px] min-w-[260px] flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
          <img
            src="/images/search.svg"
            alt=""
            aria-hidden="true"
            className="h-[18px] w-[18px]"
          />
          <label htmlFor="manager-search" className="sr-only">
            이름 또는 로그인 ID 검색
          </label>
          <input
            id="manager-search"
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="이름 또는 로그인 ID 검색..."
            className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>
      </form>
    </section>
  );
}
