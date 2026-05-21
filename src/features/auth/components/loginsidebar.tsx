interface LoginSidebarProps {
  title: {
    normal: string;
    accent: string;
  };
  description: string;
}

export default function LoginSidebar({
  title,
  description,
}: LoginSidebarProps) {
  return (
    <aside className="w-[320px] bg-[#315e61] text-white p-10 flex flex-col justify-center">
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