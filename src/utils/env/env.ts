declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MINIO_URL: string;
      NEXT_PUBLIC_MINIO_BUCKET_URL: string;
      NEXT_PUBLIC_WS_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_ENV: "development" | "production";
    }
  }
}

export const env = {
  MINIO_URL: process.env.NEXT_PUBLIC_MINIO_URL,
  MINIO_BUCKET_URL: process.env.NEXT_PUBLIC_MINIO_BUCKET_URL,
  WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  ENV: process.env.NEXT_PUBLIC_ENV,
};
