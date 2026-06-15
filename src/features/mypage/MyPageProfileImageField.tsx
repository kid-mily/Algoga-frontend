import Image from "next/image";

interface MyPageProfileImageFieldProps {
  initial: string;
  profileImageUrl?: string | null;
  previewUrl: string | null;
  onChange: (file: File | null) => void;
}

export default function MyPageProfileImageField({
  initial,
  profileImageUrl,
  previewUrl,
  onChange,
}: MyPageProfileImageFieldProps) {
  const imageSrc = previewUrl || profileImageUrl || null;

  return (
    <section className="rounded-t-2xl bg-[#EAF3FF] px-8 py-8">
      <h2 className="text-base font-bold text-[#0A1628]">프로필 사진</h2>

      <div className="mt-5 flex items-center gap-6">
        <label className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[#6A9F9A] text-4xl font-bold text-white">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="프로필 사진"
              fill
              className="object-cover"
            />
          ) : (
            initial
          )}

          <span className="absolute bottom-2 right-2 rounded-full bg-white/90 px-1.5 py-1 text-[10px] font-bold text-[#439A97]">
            📷
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onChange(file);
            }}
          />
        </label>

        <div>
          <p className="font-bold text-[#0A1628]">프로필 사진 변경</p>
          <p className="mt-1 text-sm text-[#8A9BB0]">
            JPG, PNG 파일 최대 5MB
          </p>
        </div>
      </div>
    </section>
  );
}