/**
 * Example tailwind.config.js for NativeWind / Tailwind RN integration.
 * Place this file at the project root (frontend/) and run nativewind setup.
 */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F80ED',
        secondary: '#7C3AED',
        bg: '#F7F9FB',
      },
      borderRadius: {
        'md': '12px',
      },
      spacing: {
        '9': '36px',
      }
    },
  },
  plugins: [],
};
