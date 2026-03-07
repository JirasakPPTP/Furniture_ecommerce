/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f3ef",
          100: "#ede3d9",
          200: "#dbc7b2",
          300: "#c9ab8c",
          400: "#b58d63",
          500: "#9f7146",
          600: "#7e5938",
          700: "#5d4129",
          800: "#3f2c1d",
          900: "#24180f"
        }
      }
    }
  },
  plugins: [],
};
