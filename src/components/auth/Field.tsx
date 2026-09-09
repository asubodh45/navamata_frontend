import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

/**
 * Premium underline-style input. No rounded boxes — a hairline rule and an attentive label.
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="group flex flex-col">
      <label htmlFor={inputId} className="eyebrow mb-3">
        {label}
      </label>
      <input
        id={inputId}
        ref={ref}
        className={cn(
          "h-11 w-full border-0 border-b hairline bg-transparent px-0 text-base text-ink placeholder:text-warm-gray/60",
          "transition-colors focus:border-ink focus:outline-none focus:ring-0",
          error && "border-destructive",
          className,
        )}
        {...props}
      />
      {(hint || error) && (
        <p className={cn("mt-2 text-xs", error ? "text-destructive" : "text-warm-gray")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextAreaField(
  { label, hint, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col">
      <label htmlFor={inputId} className="eyebrow mb-3">
        {label}
      </label>
      <textarea
        id={inputId}
        ref={ref}
        rows={4}
        className={cn(
          "w-full resize-none border-0 border-b hairline bg-transparent px-0 py-2 text-base text-ink placeholder:text-warm-gray/60",
          "transition-colors focus:border-ink focus:outline-none focus:ring-0",
          error && "border-destructive",
          className,
        )}
        {...props}
      />
      {(hint || error) && (
        <p className={cn("mt-2 text-xs", error ? "text-destructive" : "text-warm-gray")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});
