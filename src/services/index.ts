import { sessionService } from "./sessionService";

export const services = {
  session: sessionService,
};

export type Services = typeof services;
