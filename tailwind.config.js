/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        oledBlack: '#000000',
        panelDark: '#121214',
        surfaceDark: '#191a1e',
        neonGreen: '#d8fc22',
        candleGreen: '#2ebd85',
        candleRed: '#f6465d',
        priceOrange: '#e66514',
        textGray: '#848e9c',
        subtleBorder: '#23252a'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
