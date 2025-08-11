"use client";

import { AppContainer } from "@components";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-background-default dark:bg-tw-dark-background-default">
      <AppContainer className="py-3">
        <div className="flex items-center lg:gap-8 gap-2 lg:flex-row flex-col text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
          <h1 className="text-xl font-bold text-tw-mono-black dark:text-tw-mono-white">
            <Link href="/" className="no-underline text-inherit hover:opacity-80 transition-opacity">
              404chan
            </Link>
          </h1>

          <Link
            href="https://github.com/k1rvl07/404chan-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-tw-mono-black text-sm  dark:hover:text-tw-mono-white transition-colors"
          >
            GitHub
          </Link>
          <p className="text-center lg:ml-auto text-xs">
            Все материалы добавляются анонимно. Администрация не несёт ответственности за содержимое. Ни одно право не
            защищено.
          </p>
        </div>
      </AppContainer>
    </footer>
  );
};
