/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        glow: "glow 1s ease-in-out infinite alternate",
        spotlight: "spotlight 2.5s linear infinite",
      },
      keyframes: {
        glow: {
          from: { opacity: "0.4" },
          to: { opacity: "1" },
        },
        spotlight: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
