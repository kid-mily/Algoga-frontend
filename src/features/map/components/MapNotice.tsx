interface MapNoticeProps {
    message: string;
}

export default function MapNotice({ message }: MapNoticeProps) {
    if (!message) return null;

    return (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2">
            <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-[#BFE7E4] bg-white px-6 py-5 text-center text-sm font-bold text-[#0F3F3D] shadow-[0_18px_45px_rgba(15,23,42,0.24)]"
            >
                {message}
            </div>
        </div>
    );
}