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
        'card': '16px',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px 0 rgba(27, 36, 48, 0.04)',
        'warm-md': '0 4px 20px -2px rgba(27, 36, 48, 0.07)',
        'warm-lg': '0 12px 32px -4px rgba(27, 36, 48, 0.10)',
        'cobalt-glow': '0 4px 14px 0 rgba(36, 80, 196, 0.25)',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        staggerFade: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawArc: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      },
      animation: {
        'pulse-ticker': 'ticker 30s linear infinite',
        'stagger-fade': 'staggerFade 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'draw-arc': 'drawArc 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
