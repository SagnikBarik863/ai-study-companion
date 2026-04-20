/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#f8fafc',
        surface: '#ffffff',
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        coral: {
          500: '#f97316',
        },
      },
      boxShadow: {
        glow: '0 24px 80px rgba(15, 23, 42, 0.12)',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        mesh:
          'radial-gradient(circle at top left, rgba(20, 184, 166, 0.18), transparent 35%), radial-gradient(circle at right, rgba(249, 115, 22, 0.15), transparent 25%), linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%)',
      },
    },
  },
  plugins: [],
};

