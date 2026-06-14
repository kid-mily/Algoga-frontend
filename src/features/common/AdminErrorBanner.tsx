// src/features/common/AdminErrorBanner.tsx

type AdminErrorBannerProps = {
  message?: string;
  className?: string;
};

export default function AdminErrorBanner({
  message,
  className = "mt-4",
}: AdminErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`${className} rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]`}
    >
      {message}
    </div>
  );
}
