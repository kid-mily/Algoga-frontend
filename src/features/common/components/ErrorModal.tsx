"use client";

import { useEffect, useState } from "react";

type ErrorData = {
  timestamp?: string;
  status?: number;
  errorCode?: string;
  message?: string;
  traceId?: string;
};

export default function GlobalErrorModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<ErrorData | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ErrorData>;

      setError(customEvent.detail);
      setOpen(true);
    };

    window.addEventListener("api-error", handler);

    return () => {
      window.removeEventListener("api-error", handler);
    };
  }, []);

  if (!open || !error) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-[500px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-red-500">
          오류가 발생했습니다
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Status:</strong> {error.status}
          </p>

          <p>
            <strong>Error Code:</strong> {error.errorCode}
          </p>

          <p>
            <strong>Message:</strong> {error.message}
          </p>

          <p>
            <strong>Trace ID:</strong> {error.traceId}
          </p>

          <p>
            <strong>Timestamp:</strong> {error.timestamp}
          </p>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-lg bg-red-500 py-2 text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}