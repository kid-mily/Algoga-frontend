interface EditFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

export default function EditField({ label, value, placeholder, disabled, onChange }: EditFieldProps) {
    return (
        <label className="block">
        <span className="mb-2 block text-sm font-bold">
            {label}
        </span>

        <input
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(event) =>
                onChange?.(event.target.value)
            }
            className="h-12 w-full rounded-2xl border px-4"
        />
        </label>
    );
}