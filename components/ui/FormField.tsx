"use client";

import React, { useId } from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  name?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
  className?: string;
}

export default function FormField({
  label,
  name,
  id: explicitId,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  required = false,
  disabled = false,
  error,
  hint,
  icon,
  rightSlot,
  autoComplete,
  className = "",
}: FormFieldProps) {
  const generatedId = useId();
  const inputId = explicitId || name || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {/* Label & Required Indicator */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="font-sans font-semibold text-[13px] md:text-[14px] text-on-surface flex items-center gap-1"
        >
          <span>{label}</span>
          {required && (
            <span className="text-tertiary font-bold" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {required && (
          <span className="font-mono text-[11px] text-primary font-semibold">
            Wajib
          </span>
        )}
      </div>

      {/* Input Field Container */}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center justify-center text-outline pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full min-h-[48px] rounded-xl font-sans text-[16px] text-on-surface placeholder:text-outline transition-all duration-200 outline-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? "pl-11" : "pl-4"
          } ${rightSlot ? "pr-11" : "pr-4"} ${
            error
              ? "bg-error-container/20 border-2 border-error text-error placeholder:text-error/60 focus:ring-2 focus:ring-error/20"
              : "bg-surface-container-low border border-surface-variant/80 hover:border-surface-variant focus:bg-surface-container focus:border-primary focus:ring-2 focus:ring-primary/20"
          }`}
        />

        {rightSlot && (
          <div className="absolute right-3 flex items-center justify-center">
            {rightSlot}
          </div>
        )}
      </div>

      {/* Error Message with role="alert" */}
      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-[12px] font-medium text-error mt-0.5"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Optional Hint Text */}
      {!error && hint && (
        <span id={hintId} className="font-sans text-[12px] text-secondary">
          {hint}
        </span>
      )}
    </div>
  );
}
