export function downloadCertificatePdf(
  blob: Blob,
  fileName: string
) {
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = fileUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(fileUrl);
}

export function openCertificatePdf(pdfUrl: string) {
  window.open(pdfUrl, "_blank", "noopener,noreferrer");
}