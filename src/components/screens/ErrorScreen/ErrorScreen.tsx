"use client";

import { AppContainer } from "@components";

export const ErrorScreen = () => {
  return (
    <AppContainer>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-8xl font-bold mb-2 text-tw-light-error dark:text-tw-dark-error">400</h1>
        <p className="text-2xl text-tw-light-text-primary dark:text-tw-dark-text-primary mb-2">Что-то пошло не так</p>
        <p className="text-base text-tw-light-text-secondary dark:text-tw-dark-text-secondary mb-6">
          Попробуйте перезагрузить страницу
        </p>
      </div>
    </AppContainer>
  );
};
