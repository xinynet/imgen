import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  important: '#playground-root',
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class',
  content: ['./src/playground/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
      },
      fontFamily: {
        sans: ['var(--font-ui-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}
