export type AxiosError = {
  response?: {
    status: number;
    data?: {
      error?: string;
    };
  };
  message?: string;
};
