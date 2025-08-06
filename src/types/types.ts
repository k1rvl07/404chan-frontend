import type { MouseEvent, ReactNode } from "react";

export type WithChildren<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  children?: ReactNode;
};

export type WithClassName = {
  className?: string;
};

export type WithId = {
  id?: string;
};

export type WithInputOnChange = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type WithSelectOnChange = {
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type WithOnSubmit = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export type WithOnClick<T = HTMLElement> = {
  onClick?: (e: MouseEvent<T>) => void;
};

export type WithValue = {
  value?: string | number;
};

export type WithAction = {
  action?: string;
};

export type WithDisabled = {
  disabled?: boolean;
};

export type WithCustom<T = unknown> = {
  custom?: T;
};

export type WithHref = {
  href?: string;
};

export type AsTag =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "span"
  | "div"
  | "ul"
  | "ol"
  | "li"
  | "label"
  | "a"
  | "button"
  | "input"
  | "img"
  | "form"
  | "select"
  | "nav"
  | "option";

export type InputType = "text" | "email" | "password" | "number" | "checkbox" | "radio";

export type CustomComponent<P extends Record<string, unknown> = Record<string, unknown>> =
  React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<unknown>>;

export type NavLink = {
  id: string;
  name: string;
  link: string;
};
