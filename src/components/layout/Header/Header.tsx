"use client";

import { HomeOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { AppContainer } from "@components";
import { useThemeStore } from "@stores";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Header = () => {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <header
      className="border-b border-tw-light-divider dark:border-tw-dark-divider
                 bg-tw-light-background-default dark:bg-tw-dark-background-default"
    >
      <AppContainer className="py-1.5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-tw-mono-black dark:text-tw-mono-white">
            <Link href="/" className="no-underline text-inherit hover:opacity-80 transition-opacity">
              404chan
            </Link>
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/" aria-label="Go to home">
              <button
                type="button"
                className="
                  py-1.5 px-2.5 rounded-lg
                  text-tw-light-text-primary dark:text-tw-dark-text-primary
                  hover:bg-tw-light-surface dark:hover:bg-tw-dark-surface
                  transition-colors
                "
              >
                <HomeOutlined />
              </button>
            </Link>
            <Link href="/user" aria-label="Go to user profile">
              <button
                type="button"
                className="
                  py-1.5 px-2.5 rounded-lg
                  text-tw-light-text-primary dark:text-tw-dark-text-primary
                  hover:bg-tw-light-surface dark:hover:bg-tw-dark-surface
                  transition-colors
                "
              >
                <UserOutlined />
              </button>
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="
                py-1.5 px-2.5 rounded-lg
                text-tw-light-text-primary dark:text-tw-dark-text-primary
                hover:bg-tw-light-surface dark:hover:bg-tw-dark-surface
              "
            >
              {mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
            </button>
          </div>
        </div>
      </AppContainer>
    </header>
  );
};
