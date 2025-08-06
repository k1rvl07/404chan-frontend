export type ThemeMode = "light" | "dark";

export type ThemeState = {
  mode: ThemeMode;
  toggleTheme: () => void;
};
