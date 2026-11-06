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
      animation: {
        "cart-pop": "cart-pop .45s cubic-bezier(.34,1.56,.64,1)",
        "fade-up": "fade-up .5s ease-out both",
      },
      keyframes: {
        "cart-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
