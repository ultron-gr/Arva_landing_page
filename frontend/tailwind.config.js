/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Spec breakpoints: 360 / 640 / 768 / 1024 / 1280 / 1536
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        arva: {
          black: '#0A0A0A',
          coal: '#111111',
          panel: '#161616',
          border: '#262626',
          white: '#F5F4F0',
          cream: '#F3F0E8',
          creamdeep: '#EAE6DA',
          gray: '#A3A3A3',
          graydim: '#8A8A8A',
          gold: '#D4AF37',
          goldmuted: '#C9A227',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        btn: '8px',
      },
      maxWidth: {
        site: '80rem',
      },
    },
  },
  plugins: [],
};
