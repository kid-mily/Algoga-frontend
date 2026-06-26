"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import SubHeader from "@/features/common/components/SubHeader";
import { useCertificatePdf } from "@/features/mypage/coursedetails/useCertificatePdf";
import CertificatePdfViewer from "@/features/mypage/coursedetails/CertificatePdfViewer";
import { openCertificatePdf } from "@/features/mypage/coursedetails/certificate.action";
import CertificateDownloadButton from "@/features/mypage/coursedetails/CertificateDownloadButton";

export default function CertificateCompletionPage() {
  const params = useParams<{ id: string }>();
  const courseId = Number(params.id);

  const { certificatePdf, isLoading, errorMessage } =
    useCertificatePdf(courseId);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA]">
        <p className="text-sm font-medium text-[#8A9BB0]">
          수료증을 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (errorMessage || !certificatePdf) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA] px-4">
        <section className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#0A1628]">
            수료증을 불러올 수 없습니다
          </h1>

          <p className="mt-2 text-sm text-red-500">
            {errorMessage || "수료증 PDF가 존재하지 않습니다."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F5F7FA] px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <SubHeader
          backHref="/mypage/coursedetails"
          backText="수강 강좌로 돌아가기"
          title=""
          description=""
        />

        <section className="mt-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Image
              src="/images/check-active.svg"
              alt=""
              width={28}
              height={28}
            />
          </div>

          <h1 className="mt-3 text-xl font-bold text-[#0A1628]">
            강의 이수 완료!
          </h1>

          <p className="mt-1 text-sm text-[#8A9BB0]">
            축하합니다. 수료증이 발급되었습니다.
          </p>
        </section>

        <div className="mt-5">
          <CertificatePdfViewer
            pdfUrl={certificatePdf.url}
            title="강의 수료증"
          />
        </div>

        <div className="mx-auto mt-4 grid w-full max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openCertificatePdf(certificatePdf.url)}
            className="h-11 rounded-xl border border-[#5F9C98] bg-white text-sm font-bold text-[#5F9C98] transition hover:bg-[#F0F7F6]"
          >
            새 창에서 보기
          </button>

          <CertificateDownloadButton
            blob={certificatePdf.blob}
            fileName={certificatePdf.fileName}
          />
        </div>

        <section className="mx-auto mt-4 w-full max-w-[520px] rounded-xl border border-[#E5EDF5] bg-white px-5 py-4 shadow-sm">
          <h2 className="text-sm font-bold text-[#0A1628]">
            안내
          </h2>

          <ul className="mt-3 space-y-1.5 text-xs leading-5 text-[#4A5568]">
            <li>수료증은 마이페이지에서 다시 확인할 수 있습니다.</li>
            <li>PDF 다운로드 버튼으로 수료증을 저장할 수 있습니다.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}