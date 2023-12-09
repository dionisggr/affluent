/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,vue}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-grey': '#202123',
        'darker-grey': '#121212',
      },
    },
  },
  plugins: [],
}
