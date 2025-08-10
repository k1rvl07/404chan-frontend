"use client";

import { AppContainer } from "@components";

export const SplashScreen = () => {
  return (
    <AppContainer>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-4 text-tw-light-text-primary dark:text-tw-dark-text-primary">404chan</h1>
        <p className="text-xl text-tw-light-text-secondary dark:text-tw-dark-text-secondary">Инициализация сессии...</p>
      </div>
    </AppContainer>
  );
};
