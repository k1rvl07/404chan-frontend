"use client";

import { AppContainer, Loading } from "@components";
import { useService } from "@hooks";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

import { getErrorStatus } from "@utils";

export const BoardPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: board,
    isLoading,
    isError,
    error,
  } = useService<"board", "getBoardBySlug">("board", "getBoardBySlug", slug, {
    enabled: !!slug,
  });

  if (isError) {
    const status = getErrorStatus(error);
    if (status === 404) {
      notFound();
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    throw error;
  }

  if (!board) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <AppContainer className="py-6">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-tw-mono-black dark:text-tw-mono-white">{board.title}</h2>

          {board.description ? (
            <p className="text-tw-light-text-primary dark:text-tw-dark-text-primary leading-relaxed max-w-2xl">
              {board.description}
            </p>
          ) : (
            <p className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary italic">
              Описание отсутствует
            </p>
          )}

          <div className="mt-6 space-y-2 text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
            <div>
              <strong className="font-medium">Slug:</strong>{" "}
              <code className="font-mono bg-tw-light-surface dark:bg-tw-dark-surface px-1.5 py-0.5 rounded border border-tw-light-divider dark:border-tw-dark-divider">
                {board.slug}
              </code>
            </div>
            <div>
              <strong className="font-medium">Создана:</strong>{" "}
              {new Date(board.created_at).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="border-t border-tw-light-divider dark:border-tw-dark-divider my-8" />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-tw-mono-black dark:text-tw-mono-white">Треды</h3>
            <div className="text-center py-8 bg-tw-light-surface dark:bg-tw-dark-surface border border-tw-light-divider dark:border-tw-dark-divider rounded text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
              <p>Пока нет тредов. Хочешь создать первый?</p>
              <button
                type="button"
                className="mt-4 px-5 py-2 bg-tw-mono-black dark:bg-tw-mono-white text-tw-mono-white dark:text-tw-mono-black rounded text-sm hover:opacity-90 transition"
              >
                Создать тред
              </button>
            </div>
          </div>
        </section>
      </AppContainer>
    </main>
  );
};
