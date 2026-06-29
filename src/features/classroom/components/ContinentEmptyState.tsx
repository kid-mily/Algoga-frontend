interface Props {
    message: string;
}

export default function ContinentEmptyState({ message }: Props) {
    return (
        <div className="rounded-2xl border border-[#E3E8F0] bg-white p-8 text-center text-sm text-[#8A94A6]">
            {message}
        </div>
    );
}