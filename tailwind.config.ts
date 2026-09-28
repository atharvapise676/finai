import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        fin: {
          dark: "#080c14",
          surface: "#0f172a",
          card: "rgba(15, 23, 42, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#10b981",
          accentCyan: "#06b6d4",
          accentIndigo: "#6366f1",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-glow": "0 0 25px -5px rgba(16, 185, 129, 0.15)",
        "card-glow": "0 10px 40px -10px rgba(6, 182, 212, 0.12)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
