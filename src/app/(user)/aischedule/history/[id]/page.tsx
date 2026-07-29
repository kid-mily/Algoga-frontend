import AiScheduleAuthGate from "@/features/aischedule/components/AiScheduleAuthGate";
import ItineraryDetailClient from "@/features/aischedule/components/ItineraryDetailClient";

interface AiScheduleDetailPageProps {
  params: Promise<{ id: string }>;
}

// 일정 추천 상세는 로그인 유저 전용 데이터라, 클라이언트 컴포넌트에서 직접 조회한다
// (브라우저 쿠키가 자동으로 실리도록)
export default async function AiScheduleDetailPage({
  params,
}: AiScheduleDetailPageProps) {
  const { id } = await params;

  return (
    <AiScheduleAuthGate redirectPath={`/aischedule/history/${id}`}>
      <ItineraryDetailClient itineraryId={id} />
    </AiScheduleAuthGate>
  );
}
