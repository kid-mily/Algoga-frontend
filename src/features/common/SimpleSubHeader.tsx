"use client";

interface SimpleSubHeaderProps {
  title: string;

  description?: string;
}

export default function SimpleSubHeader({
  title,
  description,
}: SimpleSubHeaderProps) {

  return (
    <div className="mb-6">

      {/* 제목 */}
      <h1 className="text-[28px] font-bold leading-[1.2] text-[#111827]">

        {title}
      </h1>

      {/* 설명 */}
      {description && (

        <p className="mt-1 text-[15px] font-medium text-[#98A2B3]">

          {description}
        </p>
      )}
    </div>
  );
}