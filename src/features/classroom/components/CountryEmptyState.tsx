interface Props {
    message: string;
    tone?: "default" | "error";
}

export default function CountryEmptyState({
    message,
    tone = "default",
}: Props) {
    return (
        <div
        className={`rounded-2xl border bg-white p-8 text-center text-sm ${
            tone === "error"
            ? "border-red-100 text-red-500"
            : "border-[#E3E8F0] text-[#8A94A6]"
        }`}
        >
        {message}
        </div>
    );
}