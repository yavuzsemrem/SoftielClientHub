/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0056b8",
        secondary: "#ff9700",
        background: "#f8f9fb",
        surface: "#ffffff",
        text: "#1f1f1f",
      },
    },
  },
  plugins: [],
}

