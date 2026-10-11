/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf0',
          100: '#fffae1',
          200: '#fff4b8',
          300: '#ffe985',
          400: '#ffd64d',
          500: '#d9a71e',
          600: '#b88212',
          700: '#935f11',
          800: '#7a4b15',
          900: '#683e17',
          950: '#3d200a',
        },
        slate: {
          750: '#1e293b',
          850: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
