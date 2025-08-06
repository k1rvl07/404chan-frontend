"use client";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { AppContainer } from "@components";
import { useThemeStore } from "@stores";
import { Button } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Header = () => {
  const { mode, toggleTheme } = useThemeStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header
        className="border-b border-tw-light-divider dark:border-tw-dark-divider
                   bg-tw-light-background-default dark:bg-tw-dark-background-default
                   text-tw-light-text-primary dark:text-tw-dark-text-primary"
      >
        <AppContainer>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xl font-bold text-tw-mono-black dark:text-tw-mono-white">404chan</span>
            <button disabled type="button" aria-label="theme toggle" className="opacity-50 cursor-not-allowed">
              <MoonOutlined />
            </button>
          </div>
        </AppContainer>
      </header>
    );
  }

  return (
    <header className="border-b border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-background-default dark:bg-tw-dark-background-default text-tw-light-text-primary dark:text-tw-dark-text-primary">
      <AppContainer>
        <div className="flex items-center justify-between py-1.5">
          <h1 className="text-xl font-bold text-tw-mono-black dark:text-tw-mono-white">
            <Link href="/" className="no-underline text-inherit hover:opacity-80 transition-opacity">
              404chan
            </Link>
          </h1>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="py-1.5 px-2.5 rounded-lg text-tw-light-text-primary dark:text-tw-dark-text-primary hover:bg-tw-light-surface dark:hover:bg-tw-dark-surface"
          >
            {mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
          </button>
        </div>
      </AppContainer>
    </header>
  );
};
