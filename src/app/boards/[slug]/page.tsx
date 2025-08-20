import { BoardPage } from "@components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Доска — 404chan",
  description: "Доска тредов",
};

export default function Page() {
  return <BoardPage />;
}
