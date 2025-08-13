import { boardService } from "./boardService";
import { sessionService } from "./sessionService";
import { userService } from "./userService";

export const services = {
  session: sessionService,
  user: userService,
  board: boardService,
};

export type Services = typeof services;
