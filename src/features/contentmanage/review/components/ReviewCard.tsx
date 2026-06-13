import { AdminReview, ReviewLevel } from "../types";
import RatingStars from "./RatingStars";

type ReviewCardProps = {
  review: AdminReview;
  onDelete: (review: AdminReview) => void;
};

const levelStyle: Record<ReviewLevel, string> = {
  초급: "bg-[#DCFCE7] text-[#16A34A]",
  중급: "bg-[#DBEAFE] text-[#2563EB]",
  고급: "bg-[#F3E8FF] text-[#7E22CE]",
};

export default function ReviewCard({ review, onDelete }: ReviewCardProps) {
  return (
    <article className="flex items-start justify-between border-b border-[#EEF0F3] px-6 py-6 last:border-b-0">
      <div className="min-w-0 flex-1 pr-5">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${levelStyle[review.level]}`}
          >
            {review.level}
          </span>

          <h2 className="truncate text-[15px] font-bold text-[#111827]">
            {review.packageName}
          </h2>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <RatingStars rating={review.rating} />

          <span className="text-[14px] font-semibold text-[#344054]">
            {review.rating.toFixed(1)}
          </span>

          <span className="text-[#D0D5DD]">·</span>

          <span className="text-[13px] font-semibold text-[#667085]">
            {review.user}
          </span>

          <span className="text-[12px] text-[#98A2B3]">
            ({review.userId})
          </span>
        </div>

        <p className="mb-3 text-[14px] text-[#344054]">{review.content}</p>

        <p className="text-[12px] text-[#98A2B3]">
          수료일 {review.completedAt}
          <span className="mx-3">·</span>
          후기 작성 {review.reviewedAt}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDelete(review)}
        aria-label={`${review.packageName} ${review.user} 후기 삭제`}
        className="mt-1 shrink-0 text-[#EF4444]"
      >
        <img
          src="/images/delete.svg"
          alt=""
          aria-hidden="true"
          className="h-[17px] w-[17px]"
        />
      </button>
    </article>
  );
}
