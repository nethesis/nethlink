/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nethesis/phone_island/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#047857', // emerald-700
        primaryHover: '#065f46', // emerald-800
        primaryFocus: '#10b981', // emerald-500
        primaryLighter: '#ecfdf5', // emerald-100
        primaryLight: '#10b981', // emerald-500
        primaryDark: '#10b981', // emerald-500
        primaryDarkHover: '#6ee7b7', // emerald-300
        primaryDarkFocus: '#a7f3d0', // emerald-200
        primaryDarker: '#064e3b' // emerald-900
      },
      screens: {
        '3xl': '1792px',
        '4xl': '2048px',
        '5xl': '2560px',
        '6xl': '3072px',
        '7xl': '3584px'
      }
    }
  },
  plugins: []
}
