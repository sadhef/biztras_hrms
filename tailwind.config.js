/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface:  'var(--c-bg-surface)',
        elevated: 'var(--c-bg-elevated)',
        base:     'var(--c-bg-base)',
        'chart-label': 'var(--chart-label)',
        'chart-tooltip-background': 'var(--chart-tooltip-background)',
        'chart-tooltip-foreground': 'var(--chart-tooltip-foreground)',
        'chart-tooltip-muted': 'var(--chart-tooltip-muted)',
      },
    },
  },
  plugins: [],
};
