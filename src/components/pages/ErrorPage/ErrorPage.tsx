"use client";

import { AppContainer } from "@components";
import Link from "next/link";
import type { ErrorPageProps } from "./types";

export const ErrorPage = ({
  title = "400",
  message = "Страница не найдена",
  showHomeLink = true,
  onRetry,
}: ErrorPageProps) => {
  return (
    <main>
      <AppContainer>
        <section>
          <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-8xl font-bold mb-4 text-tw-light-error dark:text-tw-dark-error">{title}</h1>
            <p className="text-2xl text-tw-light-text-primary dark:text-tw-dark-text-primary mb-8">{message}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="
                  mt-4
                  px-6 py-3
                  bg-tw-mono-black dark:bg-tw-mono-white
                  text-tw-mono-white dark:text-tw-mono-black
                  rounded-lg
                  font-medium
                  hover:bg-tw-mono-800 dark:hover:bg-tw-mono-200
                "
              >
                Повторить попытку
              </button>
            )}
            {!onRetry && showHomeLink && (
              <button
                type="button"
                className="
                  px-6 py-3
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
