import { ThreadPage } from "@components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тред — 404chan",
  description: "Тред на доске",
};

export default function ThreadPageRoute() {
  return <ThreadPage />;
}
