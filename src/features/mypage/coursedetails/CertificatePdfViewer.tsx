interface CertificatePdfViewerProps {
  pdfUrl: string;
  title?: string;
}

export default function CertificatePdfViewer({
  pdfUrl,
  title = "수료증",
}: CertificatePdfViewerProps) {
  const viewerUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`;

  return (
    <section className="mx-auto w-full max-w-[520px] overflow-hidden bg-white">
      <iframe
        src={viewerUrl}
        title={title}
        className="aspect-[210/297] w-full border-0 bg-white outline-none"
      />
    </section>
  );
}