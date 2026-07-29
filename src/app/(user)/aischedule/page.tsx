import AiScheduleAuthGate from "@/features/aischedule/components/AiScheduleAuthGate";
import AiScheduleClient from "@/features/aischedule/components/AiScheduleClient";

export default function AiSchedulePage() {
  return (
    <AiScheduleAuthGate redirectPath="/aischedule">
      <AiScheduleClient />
    </AiScheduleAuthGate>
  );
}
