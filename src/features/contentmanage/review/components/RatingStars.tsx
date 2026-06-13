type RatingStarsProps = {
  rating: number;
};

export default function RatingStars({ rating }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`평점 ${rating}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          aria-hidden="true"
          className={`text-[16px] ${
            star <= rating ? "text-[#FACC15]" : "text-[#D0D5DD]"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
