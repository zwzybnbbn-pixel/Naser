/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // هذا السطر يخبر تيلويند أن يراقب كل ملفات المشروع
  ],
  theme: {
    extend: {
      colors: {
        // إضافة ألوان مخصصة لهوية نظام المجد
        'majd-dark': '#02040a',
        'majd-card': '#0d1117',
        'neon-blue': '#2563eb',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      }
    },
  },
  plugins: [],
}
