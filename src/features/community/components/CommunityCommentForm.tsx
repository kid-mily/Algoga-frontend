import { CommunityCommentFormProps } from '../types'

export default function CommunityCommentForm({
  profileText,
  value,
  placeholder = "댓글을 입력하세요...",
  submitLabel = "등록",
  disabled = false,
  onChange,
  onSubmit,
}: CommunityCommentFormProps) {
  return (
    <form
      className="flex items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
        {profileText}
      </div>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
      />

      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="h-11 cursor-pointer rounded-2xl bg-teal-600 px-5 text-sm font-bold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? "처리 중" : submitLabel}
      </button>
    </form>
  );
}
