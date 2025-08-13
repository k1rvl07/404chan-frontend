"use client";

import { AppContainer, ErrorScreen, Loading } from "@components";
import { useService } from "@hooks";
import Link from "next/link";

export const HomePage = () => {
  const { data: boards, isLoading, isError } = useService<"board", "getBoards">("board", "getBoards", undefined, {});

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorScreen />;
  }

  return (
    <main className="min-h-screen">
      <AppContainer className="py-6">
        <section className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-tw-mono-black dark:text-tw-mono-white text-2xl font-bold mb-4">О проекте</h2>
          <p className="text-tw-light-text-primary dark:text-tw-dark-text-primary leading-relaxed">
            <strong>404chan</strong> — анонимная имиджборда, где каждый может высказаться без регистрации, логов и
            привязки к личности.
            <br />
            <br />
            Все сообщения и треды автоматически удаляются через 24 часа. Никакой истории. Никакой слежки.
            <br />
            <br />
            Только ты, твой пост и интернет.
          </p>
        </section>

        <section className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-tw-mono-black dark:text-tw-mono-white text-center">Доски</h3>

          {!boards || boards.length === 0 ? (
            <p className="text-center text-tw-light-text-secondary dark:text-tw-dark-text-secondary py-8">
              Нет доступных досок.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-3 justify-center">
              {boards.map((board) => (
                <li key={board.id} className="w-[174px] lg:w-[158px]">
                  <Link
                    href={`/boards/${board.slug}`}
                    className="
                      block p-3 rounded border border-tw-light-divider dark:border-tw-dark-divider
                      hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900
                      transition-colors duration-150
                      text-tw-light-text-primary dark:text-tw-dark-text-primary
                      text-sm font-medium text-center
                    "
                  >
                    <span className="font-mono text-tw-mono-black dark:text-tw-mono-white">[{board.slug}]</span>
                    <br />
                    <span className="text-xs block mt-1">{board.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </AppContainer>
    </main>
  );
};
