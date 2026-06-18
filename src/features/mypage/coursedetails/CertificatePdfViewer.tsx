interface CertificatePdfViewerProps {
  pdfUrl: string;
  title?: string;
}

export default function CertificatePdfViewer({
  pdfUrl,
  title = "수료증",
}: CertificatePdfViewerProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#D9E2EC] bg-white shadow-sm">
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0`}
        title={title}
        className="h-[540px] w-full"
      />
    </section>
  );
}