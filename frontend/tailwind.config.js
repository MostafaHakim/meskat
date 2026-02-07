/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "marn-blue": "#3498db",
        "marn-dark": "#2c3e50",
        "marn-green": "#2ecc71",
        "marn-red": "#e74c3c",
      },
    },
  },
  plugins: [],
};
