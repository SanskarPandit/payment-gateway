import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bcd0ff",
          300: "#8eb0ff",
          400: "#5a87ff",
          500: "#345fff",
          600: "#1f3ff5",
          700: "#1a31d8",
          800: "#1b2ca9",
          900: "#1c2b85",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(15, 23, 42, 0.18)",
        card: "0 25px 50px -20px rgba(15, 23, 42, 0.45)",
      },
      backgroundImage: {
        "card-gradient":
          "linear-gradient(135deg, #1f2937 0%, #1e3a8a 50%, #4f46e5 100%)",
        "card-gradient-amex":
          "linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #1e40af 100%)",
        "card-gradient-mc":
          "linear-gradient(135deg, #7f1d1d 0%, #c2410c 50%, #b45309 100%)",
        "card-gradient-visa":
          "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #312e81 100%)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "pop": { "0%": { transform: "scale(0.85)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-in": "fade-in 220ms ease-out",
        "pop": "pop 260ms cubic-bezier(0.18, 0.89, 0.32, 1.28)",
        "spin-slow": "spin-slow 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
