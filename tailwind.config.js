/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 霓虹色
        neon: {
          blue: '#00f3ff',
          pink: '#ff00ff',
          purple: '#bf00ff',
          yellow: '#ffe600',
          cyan: '#00f3ff',
          magenta: '#ff00ff',
        },
        // 赛博背景色
        cyber: {
          dark: '#0a0a0f',
          panel: '#12121a',
          glass: 'rgba(18, 18, 26, 0.8)',
          gray: {
            400: '#a0a0b0',
            500: '#6b6b8a',
            700: '#1a1a2e',
          }
        },
        // 设计系统颜色
        void: {
          black: '#050508',
        },
        deep: {
          space: '#0a0a12',
        },
        nebula: {
          dark: '#12121f',
        },
        cosmic: {
          gray: '#1a1a2e',
        },
        starlight: '#252540',
        // 文本颜色
        text: {
          primary: '#ffffff',
          secondary: '#b8b8d0',
          tertiary: '#6b6b8a',
          accent: '#00f3ff',
        },
        // 强调色
        electric: {
          blue: '#2d6cdf',
        },
        sunset: {
          orange: '#ff6b35',
        },
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'scanline': 'scanline 8s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-scale': 'fade-in-scale 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'float-particle': 'float-particle 20s infinite linear',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0,243,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.1) 1px, transparent 1px)',
        'neon-glow': 'radial-gradient(circle, rgba(0,243,255,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
        'neon-lg': '0 0 20px #00f3ff, 0 0 40px #00f3ff',
        'cyan-500/30': '0 0 30px rgba(0, 243, 255, 0.3)',
        'purple-500/30': '0 0 30px rgba(191, 0, 255, 0.3)',
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
