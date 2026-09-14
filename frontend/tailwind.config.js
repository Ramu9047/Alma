/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-warm': 'var(--surface-warm)',
        'surface-glass': 'var(--surface-glass)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        cobalt: 'var(--cobalt)',
        'cobalt-deep': 'var(--cobalt-deep)',
        gold: 'var(--gold)',
        success: 'var(--success)',
        risk: 'var(--risk)',
        warning: 'var(--warning)',
        // Compatibility aliases
        'text-hi': 'var(--ink)',
        'text-lo': 'var(--ink-muted)',
        border: 'var(--border-color)',
        accent: 'var(--cobalt)',
        'accent-2': 'var(--gold)',
        signal: 'var(--warning)',
        danger: 'var(--risk)',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '20px',
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px 0 rgba(15, 23, 42, 0.04)',
        'warm-md': '0 6px 20px -2px rgba(15, 23, 42, 0.06)',
        'warm-lg': '0 16px 36px -4px rgba(15, 23, 42, 0.10)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'cobalt-glow': '0 6px 20px 0 rgba(99, 102, 241, 0.35)',
        'gold-glow': '0 6px 20px 0 rgba(245, 158, 11, 0.35)',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        staggerFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        }
      },
      animation: {
        'pulse-ticker': 'ticker 30s linear infinite',
        'stagger-fade': 'staggerFade 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
