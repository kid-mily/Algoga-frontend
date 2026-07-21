type ChartSkeletonProps = {
  /** 차트 렌더 영역(그래프)의 실제 높이 (px). 로딩 중 레이아웃 시프트 방지용 */
  height: number;
};

/**
 * recharts 차트 청크가 dynamic import로 로드되는 짧은 순간 표시되는 placeholder.
 * 실제 차트 카드(rounded + bg-white + p-6)와 동일한 footprint를 차지해
 * 레이아웃 튐(CLS)을 방지한다.
 */
export default function ChartSkeleton({ height }: ChartSkeletonProps) {
  return (
    <div className="rounded-[18px] bg-white p-6 shadow-sm">
      <div className="mb-5 h-5 w-40 animate-pulse rounded bg-[#EAECF0]" />
      <div
        className="w-full animate-pulse rounded-[12px] bg-[#F2F4F7]"
        style={{ height }}
        aria-hidden="true"
      />
    </div>
  );
}
