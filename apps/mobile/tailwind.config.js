/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary - Deep Aubergine (CTA buttons, primary text, headings)
        brand: {
          50: '#FAF5F7',
          100: '#F0E5EA',
          200: '#E0C9D2',
          300: '#C9A3B3',
          400: '#A67088',
          500: '#7D4560',
          600: '#5C3045',
          700: '#46222F',
          800: '#2E1020', // Main brand color
          900: '#1F0A16',
        },
        // Muted Lavender (mid-tone accent, secondary elements)
        lavender: {
          50: '#F8F8FA',
          100: '#EEEFF3',
          200: '#E0E1E8',
          300: '#D0D2DC',
          400: '#C0C2D3', // Main lavender
          500: '#A8AABE',
          600: '#8A8CA3',
          700: '#6D6F84',
          800: '#515364',
          900: '#363745',
        },
        // Soft Steel Blue (accent, secondary text, icons)
        steel: {
          50: '#F5F7F9',
          100: '#E8ECF1',
          200: '#D4DCE5',
          300: '#B9C7D6',
          400: '#9FB3C8', // Main steel blue
          500: '#7D98AF',
          600: '#607A8F',
          700: '#4A5F70',
          800: '#354551',
          900: '#212C34',
        },
        // Neutral whites and grays
        neutral: {
          50: '#FFFFFF', // Pure white - backgrounds
          100: '#FAFAFA',
          200: '#F5F5F7',
          300: '#E8E9ED',
          400: '#D4D6DD',
          500: '#B8BAC4',
          600: '#9496A3',
          700: '#6E7080',
          800: '#4A4C58',
          900: '#2A2B33',
        },
      },
      fontFamily: {
        sans: ['DMSans_400Regular', 'System'],
        'sans-medium': ['DMSans_500Medium', 'System'],
        'sans-semibold': ['DMSans_600SemiBold', 'System'],
        'sans-bold': ['DMSans_700Bold', 'System'],
        serif: ['DMSerifDisplay_400Regular', 'System'],
      },
    },
  },
  plugins: [],
};
