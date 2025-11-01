/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFA500",
          50: "#FFF6E5",
          100: "#FFE6B8",
          200: "#FFD680",
          300: "#FFC44D",
          400: "#FFB533",
          500: "#FFA500",
          600: "#E69500",
          700: "#B36F00",
          800: "#804C00",
          900: "#4D2D00",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};