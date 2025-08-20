import { boardService } from "./boardService";
import { sessionService } from "./sessionService";
import { threadService } from "./threadService";
import { userService } from "./userService";

export const services = {
  session: sessionService,
  user: userService,
  board: boardService,
  thread: threadService,
};

export type Services = typeof services;
