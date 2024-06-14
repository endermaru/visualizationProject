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
      },
      animation: {
        'bounce-down': 'bounce-down 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
