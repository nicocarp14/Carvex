/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        carvex: {
          50: "#f0f7ff",
          100: "#e0efff",
          200: "#b9d9fe",
          300: "#7eb8fc",
          400: "#3e92f8",
          500: "#0f6fe8",
          600: "#0a5bd0",
          700: "#084aa9",
          800: "#0a2e5c",
          900: "#0a1628", // azul oscurito principal
          950: "#060d1a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
