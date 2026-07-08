type CommunityCommentFormProps = {
  profileText: string;
};

export default function CommunityCommentForm({
  profileText,
}: CommunityCommentFormProps) {
  return (
    <form className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
        {profileText}
      </div>

      <input
        type="text"
        placeholder="댓글을 입력하세요..."
        className="h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
      />

      <button
        type="submit"
        className="h-11 rounded-2xl bg-teal-600 px-5 text-sm font-bold text-white hover:bg-teal-700"
      >
        등록
      </button>
    </form>
  );
}