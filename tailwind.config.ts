import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF3FF",
          100: "#DBE6FF",
          200: "#BCD0FF",
          300: "#8FAEFF",
          400: "#5C82FF",
          500: "#3357F6",
          600: "#0B4FE0",
          700: "#0A41B8",
          800: "#0C3794",
          900: "#0E2F73",
          950: "#081B45",
        },
        navy: {
          700: "#0E2160",
          800: "#0A1740",
          900: "#071231",
          950: "#040A1F",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 12px 32px -18px rgba(11,79,224,0.35)",
      },
      maxWidth: {
        screen2xl: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
