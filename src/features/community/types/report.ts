export type CommunityReportReasonType =
  | "SPAM"
  | "ABUSE"
  | "FALSE_INFO"
  | "INAPPROPRIATE"
  | "COPYRIGHT"
  | "ETC";

export type CommunityReportModalProps = {
  open: boolean;
  targetType: "게시글" | "댓글";
  isPending?: boolean;
  onCancel: () => void;
  onSubmit: (payload: {
    reasonType: CommunityReportReasonType;
    detail: string;
  }) => void;
};

export const REPORT_REASONS: Array<{
  label: string;
  value: CommunityReportReasonType;
}> = [
  { label: "스팸/광고", value: "SPAM" },
  { label: "욕설/비방", value: "ABUSE" },
  { label: "허위정보", value: "FALSE_INFO" },
  { label: "부적절한 콘텐츠", value: "INAPPROPRIATE" },
  { label: "저작권 침해", value: "COPYRIGHT" },
  { label: "기타", value: "ETC" },
];

export type ReportCommunityPostPayload = {
  postId: number;
  reasonType?: CommunityReportReasonType;
  detail: string;
};

export type ReportCommunityCommentPayload = {
  commentId: number;
  reasonType?: CommunityReportReasonType;
  detail: string;
};
