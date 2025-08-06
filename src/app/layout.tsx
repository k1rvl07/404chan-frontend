import { Header } from "@components";
import { Providers } from "@providers";
import type { WithChildren } from "@types";
import classnames from "classnames";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "antd/dist/reset.css";
import "@styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404chan",
  description: "Online anonymous chat",
};

export default function Layout({ children }: WithChildren) {
  return (
    <html lang="en" className={classnames(roboto.variable)}>
      <body className="bg-tw-light-background-paper dark:bg-tw-dark-background-paper">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
