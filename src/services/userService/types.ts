export type GetUserBySessionKeyParams = {
  session_key: string;
};

export type UpdateNicknameParams = {
  session_key: string;
  nickname: string;
};

export type GetCooldownResponse = {
  lastNicknameChangeUnix: number | null;
};
