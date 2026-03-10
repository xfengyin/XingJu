/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f3ff',
          pink: '#ff00ff',
          purple: '#bf00ff',
          yellow: '#ffe600',
        },
        cyber: {
          dark: '#0a0a0f',
          panel: '#12121a',
          glass: 'rgba(18, 18, 26, 0.8)',
        }
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'scanline': 'scanline 8s linear infinite',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0,243,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.1) 1px, transparent 1px)',
        'neon-glow': 'radial-gradient(circle, rgba(0,243,255,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
        'neon-lg': '0 0 20px #00f3ff, 0 0 40px #00f3ff',
      }
    },
  },
  plugins: [],
}
