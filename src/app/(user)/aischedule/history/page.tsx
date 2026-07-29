import AiScheduleAuthGate from "@/features/aischedule/components/AiScheduleAuthGate";
import ItineraryHistoryList from "@/features/aischedule/components/ItineraryHistoryList";

export default function AiScheduleHistoryPage() {
  return (
    <AiScheduleAuthGate redirectPath="/aischedule/history">
      <ItineraryHistoryList />
    </AiScheduleAuthGate>
  );
}
