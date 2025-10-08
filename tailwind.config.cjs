module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // brighter, bolder blue for primary UI actions
        primary: 'hsl(216 92% 45%)',
        'primary-strong': 'hsl(216 92% 40%)',
        // warm red for important states
        'accent-red': 'hsl(7 85% 55%)',
        muted: '#6b7280'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
}
