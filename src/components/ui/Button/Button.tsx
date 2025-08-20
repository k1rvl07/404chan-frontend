"use client";
import type { ButtonProps } from "./types";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses = "rounded font-medium transition-colors duration-150 focus:outline-none";

  const variantClasses = {
    primary: disabled
      ? "bg-tw-light-surface dark:bg-tw-dark-surface text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
      : "bg-tw-mono-black dark:bg-tw-mono-white text-tw-mono-white dark:text-tw-mono-black hover:opacity-90",
    secondary: disabled
      ? "bg-tw-light-surface dark:bg-tw-dark-surface text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
      : "bg-tw-light-surface dark:bg-tw-dark-surface text-tw-light-text-primary dark:text-tw-dark-text-primary hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900",
    danger: disabled
      ? "bg-tw-light-surface dark:bg-tw-dark-surface text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
      : "bg-tw-light-error dark:bg-tw-dark-error text-tw-mono-white dark:text-tw-mono-black hover:opacity-90",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${disabledClasses} 
        ${widthClass} 
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
