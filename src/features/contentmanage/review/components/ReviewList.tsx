import type { AdminReview } from "../types";
import ReviewCard from "./ReviewCard";

type ReviewListProps = {
  reviews: AdminReview[];
  totalElements: number;
  isLoading: boolean;
  onVisibilityChange: (review: AdminReview) => void;
  onDelete: (review: AdminReview) => void;
};

export default function ReviewList({
  reviews,
  totalElements,
  isLoading,
  onVisibilityChange,
  onDelete,
}: ReviewListProps) {
  return (
    <section
      aria-labelledby="review-list-title"
      className="overflow-hidden rounded-t-[16px] border border-b-0 border-[#E4E7EC] bg-white"
    >
      <h2 id="review-list-title" className="sr-only">
        후기 목록
      </h2>

      <header className="border-b border-[#EEF0F3] px-6 py-5 text-[15px] font-semibold text-[#344054]">
        {isLoading ? "후기 목록을 불러오는 중입니다." : `총 ${totalElements}개 후기`}
      </header>

      {isLoading ? (
        <p
          role="status"
          aria-live="polite"
          className="px-6 py-12 text-center text-[14px] text-[#667085]"
        >
          후기를 불러오는 중입니다...
        </p>
      ) : reviews.length === 0 ? (
        <p className="px-6 py-12 text-center text-[14px] text-[#667085]">
          조건에 맞는 후기가 없습니다.
        </p>
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onVisibilityChange={onVisibilityChange}
            onDelete={onDelete}
          />
        ))
      )}
    </section>
  );
}
