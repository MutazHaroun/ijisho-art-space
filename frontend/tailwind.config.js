/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // مهم لتفعيل الدارك مود

  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef7ee",
          100: "#fdedd3",
          200: "#f9d6a5",
          300: "#f5b96d",
          400: "#f09332",
          500: "#ed7a0f",
          600: "#de6009",
          700: "#b8480a",
          800: "#923a10",
          900: "#763110",
        },

        accent: {
          50: "#f0fdf6",
          100: "#dbfce9",
          200: "#baf7d5",
          300: "#85efb5",
          400: "#49de8b",
          500: "#21c46a",
          600: "#15a254",
          700: "#157f45",
          800: "#16643a",
          900: "#145232",
        },
      },
    },
  },

  plugins: [require("@tailwindcss/forms")],
};
