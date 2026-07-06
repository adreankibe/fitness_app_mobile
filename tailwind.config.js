/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./navigation/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#f8f9fb",
          dark: "#0f172a",
        },
        foreground: {
          DEFAULT: "#171717",
          dark: "#f8fafc",
        },
        primary: {
          DEFAULT: "#1b1b41",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f0f4ff",
          foreground: "#1b1b41",
          dark: "#1e293b",
          "foreground-dark": "#e2e8f0",
        },
        muted: {
          DEFAULT: "#f1f4f8",
          foreground: "#64748b",
          dark: "#1e293b",
          "foreground-dark": "#94a3b8",
        },
        accent: {
          DEFAULT: "#eef2ff",
          foreground: "#1b1b41",
          dark: "#25304a",
          "foreground-dark": "#e2e8f0",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#171717",
          dark: "#111827",
          "foreground-dark": "#f8fafc",
        },
        border: {
          DEFAULT: "#e4e7ec",
          dark: "#334155",
        },
        input: {
          DEFAULT: "#e4e7ec",
          dark: "#334155",
        },
        ring: "#1b1b41",
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#22c55e",
        },
        warning: {
          DEFAULT: "#f59e0b",
        },
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#374151",
          muted: "#6b7280",
          accent: "#1b1b41",
          "accent-foreground": "#ffffff",
          border: "#e2e8f0",
          dark: "#111827",
          "foreground-dark": "#cbd5e1",
          "muted-dark": "#94a3b8",
          "border-dark": "#334155",
        },
        chart: {
          1: "#1b1b41",
          2: "#3b82f6",
          3: "#10b981",
          4: "#f59e0b",
          5: "#ef4444",
          6: "#8b5cf6",
          7: "#06b6d4",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "4xl": "9999px",
      },
    },
  },
  plugins: [],
};
