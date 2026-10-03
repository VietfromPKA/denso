import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F172A",
        teal: { DEFAULT: "#0D9488", 50: "#F0FDFA", 100: "#CCFBF1", 600: "#0D9488", 700: "#0F766E", 800: "#115E59" },
        // Status colors: base for dots, borders, solid fills; `fg` for text on light/tinted backgrounds (≥4.5:1)
        ok: { DEFAULT: "#16A34A", fg: "#15803D" },
        warn: { DEFAULT: "#D97706", fg: "#B45309" },
        ng: { DEFAULT: "#DC2626", fg: "#B91C1C" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
        flow: { "0%": { left: "0%", opacity: "0" }, "15%": { opacity: "1" }, "85%": { opacity: "1" }, "100%": { left: "100%", opacity: "0" } },
        ring: { "0%": { boxShadow: "0 0 0 0 rgba(220,38,38,0.45)" }, "100%": { boxShadow: "0 0 0 10px rgba(220,38,38,0)" } },
        slidein: { "0%": { opacity: "0", transform: "translateY(-4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        blink: "blink 1s ease-in-out infinite",
        flow: "flow 1.8s linear infinite",
        ring: "ring 1.2s ease-out infinite",
        slidein: "slidein 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
