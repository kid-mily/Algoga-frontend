interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export default function FormLabel({
  children,
  required = false,
  htmlFor,
  className = "",
}: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-3 block text-[14px] font-semibold text-[#344054] ${className}`}
    >
      {children}

      {required && (
        <span className="ml-1 text-[#EF4444]" aria-label="필수 입력">
          *
        </span>
      )}
    </label>
  );
}