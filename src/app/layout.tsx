import { Footer, Header } from "@components";
import { Providers } from "@providers";
import type { WithChildren } from "@types";
import type { Metadata } from "next";
import "antd/dist/reset.css";
import "@styles";

export const metadata: Metadata = {
  title: "404chan",
  description: "Online anonymous dashboard",
};

export default function Layout({ children }: WithChildren) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.ico" />
      </head>
      <body className="bg-tw-light-background-paper dark:bg-tw-dark-background-paper">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
