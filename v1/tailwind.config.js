/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Material Design 3 色彩系統設定
        md: {
          primary: 'var(--md-sys-color-primary)',
          'on-primary': 'var(--md-sys-color-on-primary)',
          secondary: 'var(--md-sys-color-secondary)',
          surface: 'var(--md-sys-color-surface)',
          'on-surface': 'var(--md-sys-color-on-surface)',
          outline: 'var(--md-sys-color-outline)',
          'container': 'var(--md-sys-color-surface-container)',
        }
      },
      borderRadius: {
        'md-lg': '28px', // M3 標準大圓角
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}