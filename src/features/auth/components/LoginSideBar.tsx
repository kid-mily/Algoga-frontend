import { LoginSidebarProps } from "../types"

export default function LoginSidebar({
  title,
  description,
}: LoginSidebarProps) {
  return (
    <aside className="flex h-screen w-[320px] flex-col justify-center bg-[#315e61] px-10 text-white">
      <h1 className="text-4xl font-bold leading-tight">
        {title.normal}
        <br />

        <span className="text-[#00FFEA]">
          {title.accent}
        </span>
      </h1>

      <p className="mt-6 text-sm leading-6 text-white">
        {description}
      </p>
    </aside>
  );
}