/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
        },
        background: {
          start: '#eef2ff',
          end: '#ffffff',
        },
        text: {
          DEFAULT: '#0f172a',
          dark: '#0b1220',
        },
        muted: '#6b7280',
        surface: 'rgba(255, 255, 255, 0.88)',
        accent: '#7c3aed',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 22px rgba(2, 6, 23, 0.04)',
      },
      borderRadius: {
        'xl': '14px',
      },
    },
  },
  plugins: [],
}