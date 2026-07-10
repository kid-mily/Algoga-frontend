import Image from "next/image";
import Link from "next/link";

import { CommunityCardProps, CommunityStatProps } from "../types";

export default function CommunityCard({
  postId,
  authorName,
  authorInitial,
  authorProfileImageUrl,
  countryId,
  country,
  category,
  createdAt,
  title,
  content,
  imageUrl,
  imageAlt,
  likeCount,
  dislikeCount,
  commentCount,
}: CommunityCardProps) {
  return (
    <Link
      href={`/community/${postId}`}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BA19D] focus-visible:ring-offset-2"
    >
      <article className="relative flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-[#CFE0DE] bg-[#FFFDF8] px-6 py-5 shadow-[0_10px_24px_rgba(72,52,35,0.07)] transition duration-200 hover:-translate-y-0.5 hover:border-[#6BA19D] hover:shadow-[0_14px_30px_rgba(72,52,35,0.1)]">
        <header className="relative flex items-center gap-3">
          {authorProfileImageUrl ? (
            <div className="relative h-[44px] w-[44px] shrink-0 overflow-hidden rounded-full ring-4 ring-[#EEF4F4]">
              <Image
                src={authorProfileImageUrl}
                alt={`${authorName} 프로필 이미지`}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
          ) : (
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#6BA19D] text-[19px] font-bold text-white ring-4 ring-[#EEF4F4]">
              {authorInitial}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-extrabold leading-5 text-[#2F2A26]">
              {authorName}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {countryId && (
                <span className="flex h-6 items-center rounded-full bg-[#EEF4F4] px-2.5 text-[12px] font-bold text-[#5F928E]">
                  {country}
                </span>
              )}

              <span className="flex h-6 items-center rounded-full border border-[#6BA19D] bg-[#6BA19D] px-2.5 text-[12px] font-bold text-white">
                {category}
              </span>

              <time className="text-[12px] font-semibold text-[#9A8B7D]">
                {createdAt}
              </time>
            </div>
          </div>
        </header>

        <div
          className={`relative mt-5 border-t border-[#CFE0DE] pt-5 ${
            imageUrl ? "h-[116px]" : "min-h-[310px]"
          }`}
        >
          <h2 className="line-clamp-1 text-[19px] font-extrabold text-[#2F2A26]">
            {title}
          </h2>

          <p
            className={`mt-2 text-[14px] font-semibold leading-6 text-[#7A6F66] ${
              imageUrl ? "line-clamp-2" : "line-clamp-[11]"
            }`}
          >
            {content}
          </p>
        </div>

        {imageUrl && (
          <div className="relative mt-4 h-[230px] w-full overflow-hidden rounded-[10px] border border-[#CFE0DE] bg-white">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 920px"
            />
          </div>
        )}

        <footer className="relative mt-auto flex items-center gap-4 border-t border-[#CFE0DE] pt-4 text-[14px] font-bold text-[#7A6F66]">
          <CommunityStat
            icon="/images/commulike.svg"
            label="좋아요"
            count={likeCount}
          />
          <CommunityStat
            icon="/images/commudislike.svg"
            label="싫어요"
            count={dislikeCount}
          />
          <CommunityStat
            icon="/images/commucomment.svg"
            label="댓글"
            count={commentCount}
          />
        </footer>
      </article>
    </Link>
  );
}

function CommunityStat({ icon, label, count }: CommunityStatProps) {
  return (
    <div className="flex items-center gap-2">
      <Image src={icon} alt={label} width={17} height={17} />
      <span>{count.toLocaleString()}</span>
    </div>
  );
}
