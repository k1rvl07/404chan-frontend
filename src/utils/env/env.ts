declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_WS_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_ENV: "development" | "production";
    }
  }
}

export const env = {
  WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  ENV: process.env.NEXT_PUBLIC_ENV,
};
