import React from 'react';

const ChatGPTLogo = ({ size = 200 }) => {
  return (
    <div className="fixed left-1/2 z-10 pointer-events-none" style={{ top: '397px', transform: 'translate(100px, 0)', animation: 'ghostPulse30 3.2s ease-in-out infinite' }}>
      <style>{`
        @keyframes draw {
          0%   { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          0%   { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(16, 163, 127, 0.4)); }
          50%      { filter: drop-shadow(0 0 20px rgba(16, 163, 127, 0.8)); }
        }
        @keyframes rotateSlow {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ghostPulse30 {
          0%, 100% { opacity: 0; }
          50%      { opacity: 0.3; }
        }
        .logo-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 2.5s ease-out forwards, pulse 3s ease-in-out 2.5s infinite;
        }
      `}</style>

      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Äußerer dekorativer Ring */}
        <g
          style={{
            animation: 'rotateSlow 20s linear infinite',
            transformOrigin: 'center',
            opacity: 0.15,
          }}
        >
          <circle cx="100" cy="100" r="90" stroke="#10A37F" strokeWidth="1" strokeDasharray="8 4" />
          <circle cx="100" cy="100" r="80" stroke="#10A37F" strokeWidth="0.5" />
        </g>

        {/* ChatGPT-Logo */}
        <g transform="translate(100,100)">
          {/* Äußeres Sechseck */}
          <path
            d="M0,-55 L47.6,-27.5 L47.6,27.5 L0,55 L-47.6,27.5 L-47.6,-27.5 Z"
            stroke="#10A37F"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="logo-path"
            style={{ animationDelay: '0s' }}
          />

          {/* Innere Verbindungslinien – erster Satz */}
          <path
            d="M0,-55 L0,-20 M47.6,-27.5 L20,-10 M47.6,27.5 L20,10 M0,55 L0,20 M-47.6,27.5 L-20,10 M-47.6,-27.5 L-20,-10"
            stroke="#10A37F"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="logo-path"
            style={{ animationDelay: '0.3s' }}
          />

          {/* Innere Verbindungslinien – zweiter Satz */}
          <path
            d="M0,-20 L28,-35 M20,-10 L35,0 M20,10 L28,35 M0,20 L-28,35 M-20,10 L-35,0 M-20,-10 L-28,-35"
            stroke="#10A37F"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="logo-path"
            style={{ animationDelay: '0.6s' }}
          />

          {/* Zentrale Verbindungen */}
          <path
            d="M0,-20 L0,20 M20,-10 L-20,10 M20,10 L-20,-10"
            stroke="#10A37F"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="logo-path"
            style={{ animationDelay: '0.9s' }}
          />

          {/* Zentrale Füllung */}
          <circle
            cx="0"
            cy="0"
            r="8"
            fill="#10A37F"
            style={{
              opacity: 0,
              animation: 'fadeIn 0.5s ease-out 2s forwards',
            }}
          />
        </g>
      </svg>
    </div>
  );
};

export default ChatGPTLogo;
