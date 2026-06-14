/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        samidha: {
          purple: '#7e22ce',
          blue: '#2563eb',
          light: '#f3f4f6',
          dark: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
