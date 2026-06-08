"use client";

import { useEffect, useState } from "react";

export default function Error500Page() {
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("errorData");

    if (data) {
      setError(JSON.parse(data));
    }
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-5xl font-bold mb-6">500</h1>

      <h2 className="mb-4 text-xl">
        서버 오류가 발생했습니다.
      </h2>

      {error && (
        <div className="rounded border p-4 bg-gray-100">
          <p><b>timestamp:</b> {error.timestamp}</p>
          <p><b>status:</b> {error.status}</p>
          <p><b>errorCode:</b> {error.errorCode}</p>
          <p><b>message:</b> {error.message}</p>
          <p><b>traceId:</b> {error.traceId}</p>
        </div>
      )}
    </main>
  );
}