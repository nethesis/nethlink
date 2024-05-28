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
        //borders
        borderDark: '#374151', //gray-700
        borderLight: '#E5E7EB', //gray-200

        //primary
        primary: '#1d4ed8', // blue-700
        primaryHover: '#1e40af', // blue-800
        primaryRing: '#3b82f6', // blue-500

        //primary dark
        primaryDark: '#3b82f6', // blue-500
        primaryDarkHover: '#93c5fd', // blue-300
        primaryRingDark: '#bfdbfe', // blue-200

        //text
        titleLight: '#111827', // gray-900
        titleDark: '#F9FAFB', // gray-50

        //blue text
        textBlueLight: '#1d4ed8', //blue-700
        textBlueDark: '#3b82f6', // blue-500

        //amber icon
        iconAmberLight: '#b45309', //amber-700
        iconAmberDark: '#fef3c7', // amber-100

        //buttonPrimary
        primaryButtonText: '#fff', // white
        primaryButtonTextDark: '#030712', // gray-950

        //input
        bgInput: '#fff', // white
        inputText: '#111827', // gray-900
        inputLabelTitle: '#111827', // gray-900
        placeHolderInputText: '#111827', // gray-900
        inputIcon: '#374151', // gray-700

        //input dark
        bgInputDark: '#030712', // gray-950
        inputTextDark: '#F9FAFB', // gray-50
        inputLabelTitleDark: '#F9FAFB', // gray-50
        placeHolderInputTextDark: '#F9FAFB', // gray-50
        inputIconDark: '#F9FAFB', // gray-50

        //loadingSpinnerBackground
        spinnerBgLight: '#f9fafb', // gray-50
        spinnerBgDark: '#030712', // gray-950

        //background
        bgLight: '#f9fafb', // gray-50
        bgDark: '#111827', // gray-900

        //modal
        bgAmberLight: '#fef3c7', //amber-100
        bgAmberDark: '#b45309', //amber-700

        //hover
        hoverDark: '#1f2937', // gray-800
        hoverLight: '#E5E7EB', // gray-200

        //ring
        ringBlueDark: '#bfdbfe', // blue-200
        ringBlueLight: '#3b82f6', // blue-500

        //ring-offset
        ringOffsetDark: '#111827', // gray-900
        ringOffsetLight: '#F9FAFB' // gray-50
        //
      },
      screens: {
        '3xl': '1792px',
        '4xl': '2048px',
        '5xl': '2560px',
        '6xl': '3072px',
        '7xl': '3584px'
      },
      fontFamily: {
        Poppins: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'selector'
}
