import { boardService } from "./boardService";
import { messageService } from "./messageService";
import { sessionService } from "./sessionService";
import { threadService } from "./threadService";
import { userService } from "./userService";

export const services = {
  session: sessionService,
  user: userService,
  board: boardService,
  thread: threadService,
  message: messageService,
};

export type Services = typeof services;
