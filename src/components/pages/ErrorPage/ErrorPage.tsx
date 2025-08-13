"use client";

import { AppContainer } from "@components";
import Link from "next/link";
import type { ErrorPageProps } from "./types";

export const ErrorPage = ({ title = "400", message = "Страница не найдена", showHomeLink = true }: ErrorPageProps) => {
  return (
    <main>
      <AppContainer>
        <section>
          <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="lg:text-8xl text-6xl font-bold lg:mb-4 mb-2 text-tw-light-error dark:text-tw-dark-error">
              {title}
            </h1>
            <p className="lg:text-2xl text-lg text-tw-light-text-primary dark:text-tw-dark-text-primary lg:mb-8 mb-4">
              {message}
            </p>
            {showHomeLink && (
              <button
                type="button"
                className="
                  px-6 py-3
                  lg:text-base text-xs
                  bg-tw-mono-black dark:bg-tw-mono-white
                  text-tw-mono-white dark:text-tw-mono-black
                  rounded-lg
                  font-medium
                  hover:bg-tw-mono-800 dark:hover:bg-tw-mono-200
                "
              >
                <Link href="/" className="no-underline text-inherit">
                  Вернуться на главную
                </Link>
              </button>
            )}
          </div>
        </section>
      </AppContainer>
    </main>
  );
};

export default ErrorPage;
