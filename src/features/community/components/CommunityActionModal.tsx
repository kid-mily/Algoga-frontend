"use client";

import { Check } from "lucide-react";
import { CommunityActionModalProps } from '../types'

export default function CommunityActionModal({
  open,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel,
  isPending = false,
  onConfirm,
  onCancel,
}: CommunityActionModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/35 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-[14px] border border-[#CFE0DE] bg-[#FFFDF8] p-6 text-center shadow-[0_18px_42px_rgba(47,42,38,0.18)]"
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4F4] text-[#5F928E]"
        >
          <Check size={24} />
        </div>

        <h2 className="mt-4 text-[20px] font-extrabold text-[#2F2A26]">{title}</h2>
        {description && (
          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#7A6F66]">
            {description}
          </p>
        )}

        <div className={`mt-6 grid gap-3 ${cancelLabel ? "grid-cols-2" : "grid-cols-1"}`}>
          {cancelLabel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="h-11 cursor-pointer rounded-[10px] border border-[#CFE0DE] bg-white text-[14px] font-bold text-[#7A6F66] transition hover:bg-[#F8F5EF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-11 cursor-pointer rounded-[10px] bg-[#6BA19D] text-[14px] font-bold text-white transition hover:bg-[#5F928E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "처리 중" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
