import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fdfaf5",
          100: "#f6efe6",
          200: "#efe5d7",
          300: "#e5d5bf",
          400: "#d3bea0",
          500: "#c3a783",
          600: "#a7875f",
          700: "#876d4a",
          800: "#6c573c",
          900: "#564734"
        },
        sea: {
          50: "#f2faf7",
          100: "#dff3ed",
          200: "#bfe6db",
          300: "#90d1c0",
          400: "#5cb69f",
          500: "#3a9d86",
          600: "#2f7f6d",
          700: "#296557",
          800: "#234f46",
          900: "#1d4139"
        },
        clay: {
          50: "#fdf4f0",
          100: "#f8e6dd",
          200: "#f0cbb9",
          300: "#e7aa8a",
          400: "#d9815f",
          500: "#c96244",
          600: "#ab4b35",
          700: "#8b3d2f",
          800: "#6f352b",
          900: "#5d2e27"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px -35px rgba(31, 31, 31, 0.4)",
        lift: "0 22px 50px -28px rgba(65, 54, 41, 0.55)"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        }
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease-out forwards",
        shimmer: "shimmer 6s ease infinite"
      }
    }
  },
  plugins: []
};

export default config;
