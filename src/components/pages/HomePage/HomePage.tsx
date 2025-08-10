"use client";
import { AppContainer } from "@components";

export const HomePage = () => {
  return (
    <main>
      <AppContainer className="py-4">
        <section className="text-center max-w-2xl mx-auto">
          <h2 className="text-tw-mono-black dark:text-tw-mono-white text-3xl font-medium mb-4">О проекте</h2>
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
      </AppContainer>
    </main>
  );
};
