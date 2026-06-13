import { AdminReview } from "../types";
import ReviewCard from "./ReviewCard";

type ReviewListProps = {
  reviews: AdminReview[];
  onDelete: (review: AdminReview) => void;
};

export default function ReviewList({ reviews, onDelete }: ReviewListProps) {
  return (
    <section
      aria-labelledby="review-list-title"
      className="overflow-hidden rounded-t-[16px] border border-b-0 border-[#E4E7EC] bg-white"
    >
      <h2 id="review-list-title" className="sr-only">
        후기 목록
      </h2>

      <header className="border-b border-[#EEF0F3] px-6 py-5 text-[15px] font-semibold text-[#344054]">
        총 {reviews.length}개 후기
      </header>

      {reviews.length === 0 ? (
        <p className="px-6 py-12 text-center text-[14px] text-[#667085]">
          조건에 맞는 후기가 없습니다.
        </p>
      ) : (
        reviews.map((review) => (
          <ReviewCard key={review.id} review={review} onDelete={onDelete} />
        ))
      )}
    </section>
  );
}
