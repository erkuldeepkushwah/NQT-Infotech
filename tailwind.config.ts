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
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bfd3ff",
          300: "#93b4ff",
          400: "#6089ff",
          500: "#3b62f6",
          600: "#2543e0",
          700: "#1d34b8",
          800: "#1c2f93",
          900: "#1b2c74",
          950: "#121b45",
        },
        accent: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -15px rgba(27, 44, 116, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
