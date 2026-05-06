import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "background-beige": "#FAF9F6",
        magenta: "#99004C",
        "dark-background": "#2c2c2c",
        "light-pink": "#FFD1DC", // A lighter pink for text highlights
        "header-green": "#3A6B35", // New color for the header background
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Default sans-serif
      },
      boxShadow: {
        "custom-light": "0 4px 6px rgba(0, 0, 0, 0.05)",
        "custom-medium": "0 8px 16px rgba(0,0,0,0.1)",
        "magenta-glow": "0 4px 8px rgba(153,0,76,0.4)",
        "button-shadow-beige": "0 4px 8px #f6dfb7", // Custom shadow
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "shine-and-pulse": {
          "0%": { "background-position": "200% 0", transform: "scale(1)" }, // Shine starts off-right
          "80%": { "background-position": "-200% 0", transform: "scale(1)" }, // Shine completes, no pulse yet
          "90%": { transform: "scale(1.05)" }, // Pulse starts
          "100%": { transform: "scale(1)" }, // Pulse ends and resets
        },
        "text-shine-pulse": {
          "0%": {
            "background-position": "200% 0", // Start shine off-right
            "text-shadow": "0 0 0 rgba(246,223,183,0)", // No glow
            transform: "scale(1)", // No pulse
          },
          "25%": {
            "background-position": "-200% 0", // Shine moves across
            "text-shadow": "0 0 0 rgba(246,223,183,0)",
            transform: "scale(1)",
          },
          "30%": {
            "text-shadow": "0 0 10px #f6dfb7, 0 0 20px #f6dfb7", // Strong glow
            transform: "scale(1.05)", // Stronger pulse
          },
          "40%": {
            "text-shadow": "0 0 0 rgba(246,223,183,0)", // Glow fades
            transform: "scale(1)", // Pulse returns to normal
          },
          "100%": {
            "background-position": "200% 0", // Reset shine for next cycle
            "text-shadow": "0 0 0 rgba(246,223,183,0)",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shine-and-pulse": "shine-and-pulse 3s ease-in-out infinite", // Changed from 3s to 5s
        "text-shine-pulse": "text-shine-pulse 15s ease-in-out infinite", // Changed from 6s to 10s
      },
    },
  },
  plugins: [
  require("tailwindcss-animate"),
  typography,
  ({ addUtilities }) => {
    addUtilities(
      {
        ".text-shadow-glow-beige": {
          textShadow: "0 0 1px #f6dfb7, 0 0 2px #f6dfb7",
        },
        ".glow-gold-neon": {
          boxShadow: "0 0 6px #f6dfb7, 0 0 12px #f6dfb7, 0 0 15px #f6dfb7",
        },
      },
      ["responsive", "hover"]
    )
  },
],
}
export default config
