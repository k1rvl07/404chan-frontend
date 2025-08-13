import { ErrorPage } from "@components";

export const metadata = {
  title: "404",
  description: "Страница не найдена",
};

export default function NotFound() {
  return <ErrorPage />;
}
