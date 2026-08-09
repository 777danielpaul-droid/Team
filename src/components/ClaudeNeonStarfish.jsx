import React from 'react';

export default function ClaudeNeonStarfish() {
  return (
    <div className="fixed top-2 left-1/2 z-10 pointer-events-none" style={{ transform: 'translateX(calc(-50% + 65px))' }}>
      <style>{`
        @keyframes neonPulseStar {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 2px #FF8C00) drop-shadow(0 0 4px #FF6B00) drop-shadow(0 0 8px #FF4500);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            filter: drop-shadow(0 0 3px #FFA726) drop-shadow(0 0 6px #FF9800) drop-shadow(0 0 12px #FF5722);
            opacity: 0.75;
          }
        }
        @keyframes neonBlinkStar {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.75; }
        }
        .starfish-wrapper {
          animation: neonPulseStar 2.2s ease-in-out infinite, neonBlinkStar 3.5s ease-in-out infinite;
          display: block;
        }
        @keyframes ghostPulse30 {
          0%, 100% { opacity: 0; }
          50%      { opacity: 0.3; }
        }
      `}</style>

      <div className="starfish-wrapper" style={{ animation: 'ghostPulse30 3.2s ease-in-out infinite' }}>
        <svg width="100" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="starGradientClaude" cx="50%" cy="50%" r="55%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="30%" stopColor="#FF8C00" />
              <stop offset="70%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#CC3300" />
            </radialGradient>
            <filter id="glowClaude" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="14" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 12-armiger Seestern, ausgemalt, tiefe Einschnitte */}
          <path
            d="M98.4 94.2 C 92.8 64.6 97.2 29.6 100.0 8.0 C 102.8 29.6 107.2 64.6 101.6 94.2 C 111.4 65.8 132.8 37.6 146.0 20.3 C 137.7 40.4 123.9 73.0 104.2 95.8 C 127.0 76.1 159.6 62.3 179.7 54.0 C 162.4 67.2 134.2 88.6 105.8 98.4 C 135.4 92.8 170.4 97.2 192.0 100.0 C 170.4 102.8 135.4 107.2 105.8 101.6 C 134.2 111.4 162.4 132.8 179.7 146.0 C 159.6 137.7 127.0 123.9 104.2 104.2 C 123.9 127.0 137.7 159.6 146.0 179.7 C 132.8 162.4 111.4 134.2 101.6 105.8 C 107.2 135.4 102.8 170.4 100.0 192.0 C 97.2 170.4 92.8 135.4 98.4 105.8 C 88.6 134.2 67.2 162.4 54.0 179.7 C 62.3 159.6 76.1 127.0 95.8 104.2 C 73.0 123.9 40.4 137.7 20.3 146.0 C 37.6 132.8 65.8 111.4 94.2 101.6 C 64.6 107.2 29.6 102.8 8.0 100.0 C 29.6 97.2 64.6 92.8 94.2 98.4 C 65.8 88.6 37.6 67.2 20.3 54.0 C 40.4 62.3 73.0 76.1 95.8 95.8 C 76.1 73.0 62.3 40.4 54.0 20.3 C 67.2 37.6 88.6 65.8 98.4 94.2 Z"
            fill="url(#starGradientClaude)"
            stroke="#FF4500"
            strokeWidth="1.2"
            filter="url(#glowClaude)"
          />

          {/* Kern-Glow */}
          <circle cx="100" cy="100" r="16" fill="#FFD700" opacity="0.35" filter="url(#glowClaude)" />
          <circle cx="100" cy="100" r="7" fill="#FFF5CC" opacity="0.6" filter="url(#glowClaude)" />
        </svg>
      </div>
    </div>
  );
}
