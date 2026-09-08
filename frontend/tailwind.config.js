/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
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
          pureblack: '#000000',
          nearblack: '#0A0A0A',
          deepsurface: '#111111',
          mediumdark: '#1A1A1A',
          charcoal: '#3A3A3A',
          neutralgray: '#888888',
          silver: '#B0B0B0',
          lightgray: '#D4D4D4',
          offwhite: '#F5F5F0',
          purewhite: '#FFFFFF',
          gold: '#C9A84C',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
      },
      maxWidth: {
        site: '80rem',
      },
    },
  },
  plugins: [],
};
