/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",   // slate-900 (legacy)
        accent: "#6366f1",     // indigo-500 (legacy)
        "legal-dark": "#0A1F44",
        "legal-blue": "#0F2A5F",
        "legal-cyan": "#00D4FF",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      }
    }
  },
  plugins: []
};
