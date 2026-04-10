/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Linear 设计系统 - 主色
        linear: {
          bg: '#fafafa',
          surface: '#f5f6f7',
          elevated: '#f0f0f2',
          border: '#e5e5e5',
          'border-subtle': '#ededed',
        },
        // Linear 品牌色
        brand: {
          DEFAULT: '#5e6ad2',
          accent: '#7170ff',
          hover: '#828fff',
          muted: '#7a7fad',
        },
        // Linear 文字色
        text: {
          primary: '#1a1a1a',
          secondary: '#62666d',
          tertiary: '#8a8f98',
          quaternary: '#b0b4ba',
          accent: '#5e6ad2',
        },
        // 状态色
        status: {
          success: '#27a644',
          emerald: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'Berkeley Mono',
          'ui-monospace',
          'SF Mono',
          'Menlo',
          'monospace',
        ],
      },
      fontWeight: {
        '510': '510',
        '590': '590',
      },
      fontSize: {
        'display-xl': ['4.50rem', { lineHeight: '1.00', letterSpacing: '-1.584px' }],
        'display-lg': ['4.00rem', { lineHeight: '1.00', letterSpacing: '-1.408px' }],
        'display': ['3.00rem', { lineHeight: '1.00', letterSpacing: '-1.056px' }],
        'heading-1': ['2.00rem', { lineHeight: '1.13', letterSpacing: '-0.704px' }],
        'heading-2': ['1.50rem', { lineHeight: '1.33', letterSpacing: '-0.288px' }],
        'heading-3': ['1.25rem', { lineHeight: '1.33', letterSpacing: '-0.24px' }],
        'body-lg': ['1.13rem', { lineHeight: '1.60', letterSpacing: '-0.165px' }],
        'body': ['1.00rem', { lineHeight: '1.50' }],
        'small': ['0.94rem', { lineHeight: '1.60', letterSpacing: '-0.165px' }],
        'caption-lg': ['0.88rem', { lineHeight: '1.50', letterSpacing: '-0.182px' }],
        'caption': ['0.81rem', { lineHeight: '1.50', letterSpacing: '-0.13px' }],
        'label': ['0.75rem', { lineHeight: '1.40' }],
        'micro': ['0.69rem', { lineHeight: '1.40' }],
      },
      borderRadius: {
        'micro': '2px',
        'standard': '4px',
        'comfortable': '6px',
        'card': '8px',
        'panel': '12px',
      },
      boxShadow: {
        'linear-subtle': '0 1px 2px rgba(0,0,0,0.04)',
        'linear-card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'linear-elevated': '0 4px 12px rgba(0,0,0,0.08)',
        'linear-focus': '0 0 0 2px rgba(94,106,210,0.3)',
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
    },
  },
  plugins: [],
}
