"use client";

import { AppContainer } from "@components";

export const ErrorScreen = () => {
  return (
    <div className="fixed inset-0 z-50  bg-tw-light-background-default dark:bg-tw-dark-background-default">
      <AppContainer>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="lg:text-8xl text-6xl font-bold mb-2 text-tw-light-error dark:text-tw-dark-error">Ошибка</h1>
          <p className="lg:text-2xl text-lg text-tw-light-text-primary dark:text-tw-dark-text-primary mb-2">
            Что-то пошло не так
          </p>
          <p className="lg:text-base text-xs text-tw-light-text-secondary dark:text-tw-dark-text-secondary mb-6">
            Попробуйте перезагрузить страницу
          </p>
        </div>
      </AppContainer>
    </div>
  );
};
