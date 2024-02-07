/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'orange_1': '#F7BF52',
        'green_txt': '#5D997A',
        'gray': '#EBEFF0',
        'darkBlue': '#EBEFF0',
      },
    },
    
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('preline/plugin'),
  ],
}

