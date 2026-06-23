interface PasswordFieldProps {
    label: string;
    value: string;
    placeholder: string;
    visible: boolean;
    onChange: (value: string) => void;
    onToggle: () => void;
}

export default function PasswordField({
    label,
    value,
    placeholder,
    visible,
    onChange,
    onToggle,
}: PasswordFieldProps) {
    return (
        <label className="block">
        <span className="mb-2 block text-sm font-bold">
            {label}
        </span>

        <div className="relative">
            <input
            type={visible ? "text" : "password"}
            value={value}
            placeholder={placeholder}
            onChange={(event) =>
                onChange(event.target.value)
            }
            className="h-12 w-full rounded-2xl border px-4 pr-16"
            />

            <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
            >
            {visible ? "숨김" : "보기"}
            </button>
        </div>
        </label>
    );
}