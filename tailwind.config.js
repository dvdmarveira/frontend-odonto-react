/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        74: "74px",
      },
      height: {
        74: "74px",
      },
      colors: {
        blue_primary: "#28385D",
        blue_secondary: "#004C82",
        blue_tertiary: "#8aadc6",
        blue_dark: "#00223a",
        gray_primary: "#8A879C",
        gray_neutro: "#DEDDDD",
        red_secondary: "#AB0535",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        lora: ["Lora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
