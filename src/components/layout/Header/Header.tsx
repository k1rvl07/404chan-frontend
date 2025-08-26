"use client";

import { HomeOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { AppContainer, Button } from "@components";
import { useThemeStore } from "@stores";
import Link from "next/link";

export const Header = () => {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <header className="border-b border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-background-default dark:bg-tw-dark-background-default">
      <AppContainer className="py-1.5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-tw-mono-black dark:text-tw-mono-white">
            <Link href="/" className="no-underline text-inherit hover:opacity-80 transition-opacity">
              404chan
            </Link>
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/" aria-label="Go to home">
              <Button
                variant="secondary"
                size="sm"
                className="py-2 px-2.5 rounded-lg !bg-tw-light-background-default dark:!bg-tw-dark-background-default hover:!bg-tw-mono-200 dark:hover:!bg-tw-mono-800"
              >
                <HomeOutlined className="text-[14px]" />
              </Button>
            </Link>
            <Link href="/user" aria-label="Go to user profile">
              <Button
                variant="secondary"
                size="sm"
                className="py-2 px-2.5 rounded-lg !bg-tw-light-background-default dark:!bg-tw-dark-background-default hover:!bg-tw-mono-200 dark:hover:!bg-tw-mono-800"
              >
                <UserOutlined className="text-[14px]" />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="py-2 px-2.5 rounded-lg !bg-tw-light-background-default dark:!bg-tw-dark-background-default hover:!bg-tw-mono-200 dark:hover:!bg-tw-mono-800"
            >
              {mode === "dark" ? <SunOutlined className="text-[14px]" /> : <MoonOutlined className="text-[14px]" />}
            </Button>
          </div>
        </div>
      </AppContainer>
    </header>
  );
};
