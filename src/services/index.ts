import { sessionService } from "./sessionService";
import { userService } from "./userService";

export const services = {
  session: sessionService,
  user: userService,
};

export type Services = typeof services;
