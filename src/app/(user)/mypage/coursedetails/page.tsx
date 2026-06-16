import MyPageLayout from "@/features/mypage/MyPageLayout";
import CourseHistoryList from "@/features/mypage/coursedetails/CourseHistoryList";

export default function CourseDetailsPage() {
  return (
    <MyPageLayout title="수강 내역">
      <CourseHistoryList />
    </MyPageLayout>
  );
}