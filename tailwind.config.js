/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      xsm: '375px',
      // => @media (min-width: 375px) { ... }

      xmd: '390px',
      // => @media (min-width: 390px) { ... }

      xlg: '414px',
      // => @media (min-width: 414px) { ... }

      tablet: '690px',
      // => @media (min-width: 690px) { ... }

      xxl: '768px',
      // => @media (min-width: 768px) { ... }

      xxs: { max: '374px' },
      // => @media (max-width: 374px) { ... }
    },
  },
  plugins: [],
};
