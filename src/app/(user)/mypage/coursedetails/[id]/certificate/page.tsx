"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import SubHeader from "@/features/contentmanage/common/SubHeader";
import { useCertificatePdf } from "@/features/mypage/coursedetails/useCertificatePdf";
import CertificatePdfViewer from "@/features/mypage/coursedetails/CertificatePdfViewer";
import { openCertificatePdf } from "@/features/mypage/coursedetails/certificate.action";
import CertificateDownloadButton from "@/features/mypage/coursedetails/CertificateDownloadButton";



export default function CertificateCompletionPage() {
  const params = useParams<{ id: string }>();
  const courseId = Number(params.id);

  const {
    certificatePdf,
    isLoading,
    errorMessage,
  } = useCertificatePdf(courseId);

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
    <main className="min-h-[calc(100vh-64px)] bg-[#F5F7FA] px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <SubHeader
          backHref="/mypage/courses"
          backText="수강 내역으로 돌아가기"
          title=""
          description=""
        />

        <section className="mt-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Image
              src="/images/check-active.svg"
              alt=""
              width={32}
              height={32}
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[#0A1628]">
            강의 이수 완료!
          </h1>

          <p className="mt-2 text-sm text-[#8A9BB0]">
            축하합니다. 수료증이 발급되었습니다.
          </p>
        </section>

        <div className="mt-7">
          <CertificatePdfViewer
            pdfUrl={certificatePdf.url}
            title="강의 수료증"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openCertificatePdf(certificatePdf.url)}
            className="h-12 rounded-xl border border-[#5F9C98] bg-white text-sm font-bold text-[#5F9C98] transition hover:bg-[#F0F7F6]"
          >
            새 창에서 보기
          </button>

          <CertificateDownloadButton
            blob={certificatePdf.blob}
            fileName={certificatePdf.fileName}
          />
        </div>

        <section className="mt-6 rounded-xl border border-[#E5EDF5] bg-white px-7 py-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#0A1628]">
            추가 혜택
          </h2>

          <ul className="mt-4 space-y-2 text-sm leading-6 text-[#4A5568]">
            <li>✓ 마이페이지 지도에 뱃지가 추가되었습니다.</li>
            <li>
              ✓ 진도율과 정답률 기준을 충족하면 페이백 포인트가
              지급됩니다.
            </li>
            <li>✓ 패키지 수강 시 쿠폰과 마일리지가 지급됩니다.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}