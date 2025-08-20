"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TextareaProps } from "./types";

export const Textarea = ({
  label,
  error,
  helperText,
  fullWidth = true,
  minRows = 1,
  maxRows = 10,
  className = "",
  value,
  onChange,
  ...props
}: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentValue, setCurrentValue] = useState<string>((value as string) || "");

  useEffect(() => {
    setCurrentValue((value as string) || "");
  }, [value]);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    const lineHeight = 24;
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows ? maxRows * lineHeight : Number.POSITIVE_INFINITY;

    let newHeight = textarea.scrollHeight;

    if (newHeight < minHeight) {
      newHeight = minHeight;
    }

    if (maxHeight && newHeight > maxHeight) {
      newHeight = maxHeight;
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }

    textarea.style.height = `${newHeight}px`;
  }, [minRows, maxRows]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(e.target.value);
    if (onChange) {
      onChange(e);
    }

    requestAnimationFrame(adjustHeight);
  };

  const baseClasses = `w-full px-3 py-2 border border-tw-light-divider dark:border-tw-dark-divider rounded focus:outline-none 
                       bg-tw-light-background-paper dark:bg-tw-dark-background-paper 
                       text-tw-mono-black dark:text-tw-mono-white
                       resize-none overflow-hidden`;

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
      <textarea
        ref={textareaRef}
        id={props.id}
        className={`
          ${baseClasses} 
          ${focusClasses} 
          ${errorClasses} 
          ${disabledClasses} 
          ${className}
        `}
        value={currentValue}
        onChange={handleChange}
        rows={minRows}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-tw-light-error dark:text-tw-dark-error">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">{helperText}</p>
      )}
    </div>
  );
};
