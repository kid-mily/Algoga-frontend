type CharCounterProps = {
  length: number;
  maxLength: number;
  className?: string;
};

export default function CharCounter({
  length,
  maxLength,
  className = "",
}: CharCounterProps) {
  return (
    <span
      className={`text-[12px] ${
        length >= maxLength ? "text-[#DC2626]" : "text-[#98A2B3]"
      } ${className}`}
    >
      {length.toLocaleString()} / {maxLength.toLocaleString()}
    </span>
  );
}
