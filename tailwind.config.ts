module.exports = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/antd/es/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "tw-light": {
          background: {
            default: "#fafafa",
            paper: "#ffffff",
          },
          text: {
            primary: "#111111",
            secondary: "#555555",
          },
          surface: "#ffffff",
          divider: "#bdbdbd",
          error: "#d32f2f",
        },
        "tw-dark": {
          background: {
            default: "#111111",
            paper: "#212121",
          },
          text: {
            primary: "#e0e0e0",
            secondary: "#9e9e9e",
          },
          surface: "#212121",
          divider: "#424242",
          error: "#d50000",
        },
        "tw-mono": {
          black: "#000000",
          white: "#ffffff",
          "900": "#111111",
          "800": "#212121",
          "700": "#424242",
          "600": "#757575",
          "500": "#9e9e9e",
          "400": "#bdbdbd",
          "300": "#e0e0e0",
          "200": "#eeeeee",
          "100": "#f5f5f5",
          "50": "#fafafa",
        },
      },
      screens: {
        lg: "1280px",
      },
    },
  },
  plugins: [],
};
