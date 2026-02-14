import { boardService } from "./boardService";
import { messageService } from "./messageService";
import { sessionService } from "./sessionService";
import { threadService } from "./threadService";
import { uploadService } from "./uploadService";
import { userService } from "./userService";

export { uploadService };

export const services = {
  session: sessionService,
  user: userService,
  board: boardService,
  thread: threadService,
  message: messageService,
  upload: uploadService,
};

export type Services = typeof services;
