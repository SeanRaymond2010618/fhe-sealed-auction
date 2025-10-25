/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Auction-specific color palette
        'auction': {
          'primary': '#ff6b35',      // Orange for bidding energy
          'secondary': '#f7931e',    // Gold for winners
          'accent': '#ffd23f',       // Yellow for highlights
          'success': '#00d4aa',      // Green for success
          'danger': '#ff4757',       // Red for urgent actions
          'dark': '#1a1a2e',         // Dark background
          'darker': '#16213e',       // Darker panels
          'light': '#e94560'         // Light accent
        },
        'bid': {
          'high': '#00d4aa',         // High bid color
          'medium': '#ffd23f',       // Medium bid color
          'low': '#ff6b35'           // Low bid color
        }
      },
      fontFamily: {
        'auction': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      animation: {
        'bid-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'countdown': 'countdown 1s linear infinite',
        'winner-glow': 'winner-glow 2s ease-in-out infinite alternate',
        'bid-flash': 'bid-flash 0.5s ease-in-out'
      },
      keyframes: {
        'countdown': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        'winner-glow': {
          '0%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.8)' }
        },
        'bid-flash': {
          '0%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(255, 107, 53, 0.2)' },
          '100%': { backgroundColor: 'transparent' }
        }
      },
      backgroundImage: {
        'auction-gradient': 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd23f 100%)',
        'bid-gradient': 'linear-gradient(45deg, #1a1a2e 0%, #16213e 100%)',
        'winner-gradient': 'linear-gradient(135deg, #00d4aa 0%, #ffd23f 100%)'
      }
    },
  },
  plugins: [],
}


