"use client";
import type { InputProps } from "./types";

export const Input = ({ label, error, helperText, fullWidth = true, className = "", ...props }: InputProps) => {
  const baseClasses =
    "w-full px-3 py-2 border border-tw-light-divider dark:border-tw-dark-divider rounded focus:outline-none bg-tw-light-background-paper dark:bg-tw-dark-background-paper text-tw-mono-black dark:text-tw-mono-white";

  const focusClasses = "focus:bg-tw-mono-50 dark:focus:bg-tw-mono-900";
  const errorClasses = error ? "border-tw-light-error dark:border-tw-dark-error" : "";
  const disabledClasses = props.disabled ? "bg-tw-mono-200 cursor-not-allowed" : "";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <div className={widthClass}>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-tw-light-text-secondary dark:text-tw-dark-text-secondary mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={props.id}
        className={`
          ${baseClasses} 
          ${focusClasses} 
          ${errorClasses} 
          ${disabledClasses} 
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-tw-light-error dark:text-tw-dark-error">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">{helperText}</p>
      )}
    </div>
  );
};
