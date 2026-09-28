/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          bg: "#F7F5EF",
          surface: "#FFFFFF",
          dark: "#173B32",
          darker: "#0F2620",
          primary: "#246B55",
          primaryHover: "#1B5241",
          primaryLight: "#E8F3EE",
          accent: "#D9A441",
          accentHover: "#C28E2E",
          accentLight: "#FCF5E8",
          text: "#1F2933",
          muted: "#6B7280",
          border: "#E5E0D8",
          borderLight: "#F0ECE1",
          emerald: "#059669",
          amber: "#D97706",
          rose: "#DC2626"
        },
        gov: {
          blue: "#246B55",
          dark: "#173B32",
          light: "#F7F5EF",
          accent: "#D9A441",
          emerald: "#059669",
          amber: "#D97706",
          rose: "#DC2626"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
