import { AppContainer } from "@components";

export const Loading = () => {
  return (
    <main className="min-h-screen flex">
      <AppContainer className="py-6 my-auto">
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="h-8 w-3/4 bg-tw-mono-200 dark:bg-tw-mono-700 rounded animate-pulse" />
          <div className="h-4 w-full max-w-lg bg-tw-mono-200 dark:bg-tw-mono-700 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-tw-mono-200 dark:bg-tw-mono-700 rounded animate-pulse" />
        </div>
      </AppContainer>
    </main>
  );
};
