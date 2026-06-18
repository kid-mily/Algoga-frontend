"use client";

import Image from "next/image";
import { downloadCertificatePdf } from "./certificate.action";



interface CertificateDownloadButtonProps {
  blob: Blob;
  fileName: string;
}

export default function CertificateDownloadButton({
  blob,
  fileName,
}: CertificateDownloadButtonProps) {
  const handleDownload = () => {
    downloadCertificatePdf(blob, fileName);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5F9C98] text-sm font-bold text-white transition hover:bg-[#4D8582]"
    >
      <Image
        src="/images/download.svg"
        alt=""
        width={18}
        height={18}
      />

      PDF 다운로드
    </button>
  );
}