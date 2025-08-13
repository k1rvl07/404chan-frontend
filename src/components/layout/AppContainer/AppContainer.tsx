"use client";
import type { AppContainerProps } from "./types";

export const AppContainer = ({ children, className = "" }: AppContainerProps) => {
  return (
    <div
      className={`
        mx-auto box-border
        lg:w-[1200px]
        w-[360px]
        ${className}
      `}
    >
      {children}
    </div>
  );
};
