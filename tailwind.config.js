/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
  ],
  safelist: [
    // alignment
    'text-left', 'text-center', 'text-right',
    // text sizes
    'text-sm','text-base','text-lg','text-xl','text-2xl','text-3xl',
    // radius
    'rounded-none','rounded-sm','rounded','rounded-md','rounded-lg','rounded-xl','rounded-2xl','rounded-full',
    // spacing
    'mt-0','mt-2','mt-4','mt-6','mt-8','mt-12','mt-16',
    'mb-0','mb-2','mb-4','mb-6','mb-8','mb-12','mb-16',
    'px-0','px-2','px-4','px-6','px-8','px-12','px-16',
    'py-0','py-2','py-4','py-6','py-8','py-12','py-16',
    // button color variants
    'bg-blue-500','hover:bg-blue-600','bg-rose-500','hover:bg-rose-600','bg-emerald-500','hover:bg-emerald-600','bg-slate-600','hover:bg-slate-700',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        bg: 'hsl(var(--bg))',
        fg: 'hsl(var(--fg))',
        muted: 'hsl(var(--muted))',
        card: 'hsl(var(--card))',
        accent: 'hsl(var(--accent))',
      },
      borderRadius: {
        xl: '12px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
