import LoadingSpinner from "./LoadingSpinner";

type AdminLoadingStateProps = {
  text?: string;
};

export default function AdminLoadingState({
  text = "데이터를 불러오는 중입니다...",
}: AdminLoadingStateProps) {
  return (
    <div className="mt-5 flex justify-center rounded-[20px] border border-[#E4E7EC] bg-white py-10">
      <LoadingSpinner text={text} />
    </div>
  );
}
