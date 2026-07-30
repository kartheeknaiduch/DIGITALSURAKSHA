import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2A4A",
          deep: "#12203a",
          light: "#243560",
        },
        marigold: {
          DEFAULT: "#E8A33D",
          deep: "#C97F1F",
          light: "#F2C06A",
          glow: "rgba(232,163,61,0.25)",
        },
        cream: {
          DEFAULT: "#FAF6EE",
          dark: "#F2EBD9",
        },
        danger: {
          DEFAULT: "#C1443D",
          light: "#fbeae9",
          deep: "#92322C",
          glow: "rgba(193,68,61,0.25)",
        },
        safe: {
          DEFAULT: "#2F8F6E",
          light: "#e6f4ee",
          glow: "rgba(47,143,110,0.25)",
        },
        panel: "#FFFFFF",
        line: "#E4DCC9",
      },
      fontFamily: {
        display: ["'Baloo 2'", "'Noto Sans Devanagari'", "'Noto Sans Telugu'", "sans-serif"],
        body: ["Inter", "'Noto Sans Devanagari'", "'Noto Sans Telugu'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
        "4xl": "32px",
      },
      animation: {
        "spin-slow": "spin 3.2s linear infinite",
        "blip": "blipfade 3.2s infinite",
        "blip-delay": "blipfade 3.2s 1.6s infinite",
        "dash": "dash 1.6s linear infinite",
        "shake": "shake 2.4s ease-in-out infinite",
        "pulse-safe": "pulseSafe 2s ease-in-out infinite",
        "pulse-risk": "pulseRisk 2s ease-in-out infinite",
        "fadein": "fadein 0.35s ease",
        "slide-up": "slideUp 0.4s ease",
      },
      keyframes: {
        blipfade: {
          "0%": { opacity: "0" },
          "10%": { opacity: "1" },
          "30%": { opacity: "0" },
          "100%": { opacity: "0" },
        },
        dash: {
          to: { strokeDashoffset: "-24" },
        },
        shake: {
          "0%, 100%": { transform: "rotate(0)" },
          "5%": { transform: "rotate(-4deg)" },
          "10%": { transform: "rotate(4deg)" },
          "15%": { transform: "rotate(0)" },
        },
        pulseSafe: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(47,143,110,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(47,143,110,0)" },
        },
        pulseRisk: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(193,68,61,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(193,68,61,0)" },
        },
        fadein: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "ink": "0 4px 0 #0d1730",
        "danger": "0 4px 0 #92322c",
        "card": "0 2px 16px rgba(27,42,74,0.07)",
        "card-hover": "0 8px 32px rgba(27,42,74,0.13)",
        "glass": "0 8px 32px rgba(27,42,74,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
      },
      backgroundImage: {
        "radar-radial": "radial-gradient(circle, #22345c 0%, #1B2A4A 70%)",
        "hero-gradient": "linear-gradient(135deg, #1B2A4A 0%, #243560 60%, #1a3050 100%)",
        "marigold-gradient": "linear-gradient(135deg, #E8A33D 0%, #C97F1F 100%)",
        "safe-gradient": "linear-gradient(135deg, #2F8F6E 0%, #1d6b52 100%)",
        "danger-gradient": "linear-gradient(135deg, #C1443D 0%, #92322c 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
