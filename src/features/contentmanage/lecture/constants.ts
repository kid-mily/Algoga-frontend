export const ALLOWED_LECTURE_MATERIAL_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "hwp",
  "hwpx",
  "txt",
];

export const ALLOWED_LECTURE_MATERIAL_ACCEPT = ALLOWED_LECTURE_MATERIAL_EXTENSIONS.map(
  (ext) => `.${ext}`
).join(",");

export const LECTURE_MATERIAL_TYPE_ERROR_MESSAGE =
  "허용되지 않는 강의자료 형식입니다. 문서 파일(PDF, Word, PPT, Excel, HWP, TXT)만 업로드할 수 있습니다.";

export const getFileExtension = (fileName: string) =>
  fileName.split(".").pop()?.toLowerCase() ?? "";

export const isAllowedLectureMaterial = (file: File) =>
  ALLOWED_LECTURE_MATERIAL_EXTENSIONS.includes(getFileExtension(file.name));

// originalFileName이 없는 과거 데이터를 위해 URL에서 파일명을 추출하는 fallback입니다.
export const getFileNameFromUrl = (fileUrl: string) => {
  try {
    const url = new URL(fileUrl);
    const segments = url.pathname.split("/");
    return decodeURIComponent(segments[segments.length - 1] || fileUrl);
  } catch {
    const segments = fileUrl.split("/");
    return segments[segments.length - 1] || fileUrl;
  }
};

export const getCourseFileDisplayName = (file: {
  originalFileName?: string | null;
  fileUrl: string;
}) => file.originalFileName || getFileNameFromUrl(file.fileUrl);
