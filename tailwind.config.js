export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: '#1b1b1b',
        muted: '#3a3a3a',
        gov: {
          blue: '#000091',
          red: '#e1000f',
          yellow: '#ffe800',
        },
        rule: '#dcdcdc',
        navy: {
          950: '#04102b',
          900: '#071a3d',
          800: '#0b2559',
          700: '#123170',
          600: '#1b3f86',
        },
        brand: {
          50: '#eff4ff',
          100: '#dde7ff',
          200: '#c2d2ff',
          400: '#5b82ea',
          500: '#2a58d4',
          600: '#1a46c2',
          700: '#1438a0',
        },
        ink: {
          900: '#0d1b3e',
          800: '#1e2c4f',
          700: '#3b4a68',
          500: '#6b7893',
          400: '#8d97ac',
        },
        canvas: '#f4f6fb',
        line: '#e3e8f1',
        ok: {
          50: '#f4fef3',
          100: '#b7fbca',
          600: '#1b6736',
          700: '#17592f',
        },
        warn: {
          50: '#fdf6e3',
          100: '#f9ecc4',
          700: '#8a6512',
        },
        danger: {
          50: '#fff6f7',
          100: '#ffe6e9',
          600: '#e1000f',
          700: '#b8000c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13, 27, 62, 0.04), 0 1px 3px rgba(13, 27, 62, 0.06)',
        pop: '0 12px 32px -8px rgba(13, 27, 62, 0.18)',
      },
    },
  },
}
