/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        // "gradient-conic":
        //   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'Pretendard-Regular': ['Pretendard-regular'],
        'Pretendard-ExBold': ['Pretendard-ExtraBold'],
      },
      keyframes: {
        'bounce-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '20%': { transform: 'translateY(5px)' },
        },
        growAndFade: {
          '0%': { transform: 'scale(1)', opacity: '0' },
          '25%': {opacity: '1' },
          '75%': {opacity: '1' },
          '100%': { transform: 'scale(1.1)', opacity: '1' },
        },
      },
      animation: {
        'bounce-down': 'bounce-down 1.5s ease-in-out infinite',
        'grow-fade': 'growAndFade 8s ease-in-out forwards',
      },
      animationDelay: {
        '0s': '0s',
        '0.5s': '0.25s',
        '1s': '0.5s',
        '1.5s': '0.7s',
        '2s': '1s',
        '2.5s': '1.2s',
        '3s': '1.5s',
        '3.5s': '1.9s',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme, e }) {
      const delays = theme('animationDelay');
      const utilities = Object.keys(delays).map(key => ({
        [`.${e(`delay-${key}`)}`]: {
          animationDelay: delays[key],
        },
      }));
      addUtilities(utilities, ['responsive', 'hover']);
    },
  ],
};
