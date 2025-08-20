import { UserPage } from "@components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профиль — 404chan",
  description: "Ваш личный профиль",
};

export default function UserPageRoute() {
  return <UserPage />;
}
