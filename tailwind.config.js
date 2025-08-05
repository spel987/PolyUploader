/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      opacity: {
        '7': '0.07',
        '9': '0.09',
        '12': '0.12'
      }
    },
  },
  plugins: [],
}