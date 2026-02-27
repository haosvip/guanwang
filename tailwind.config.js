
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Use CSS variables for dynamic theming
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-secondary)", // Mapping secondary to light for now or separate
          dark: "var(--color-primary-dark)", // Could derive or add to config
        },
        secondary: "var(--color-secondary)",
        accent: {
          orange: "var(--color-accent)",
          green: "#0BD9A7", // Keep static or add to config if needed
        },
        // Dark mode / Theme colors
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: {
          DEFAULT: "var(--color-text)",
          secondary: "var(--color-text-secondary)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "sans-serif"],
        heading: ["var(--font-heading)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 15px -3px rgba(0,0,0,0.2)", // Darker shadow for dark mode
        "card-hover": "0 20px 25px -5px rgba(0,0,0,0.3)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "1.5rem", // Fallback
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-primary-dark) 100%)",
      },
    },
  },
  plugins: [],
};
