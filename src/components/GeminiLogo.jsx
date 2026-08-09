import React from 'react';

const GeminiLogo = ({ size = 30 }) => {
  return (
    <div className="fixed z-10 pointer-events-none" style={{ left: 'calc(50% + 82px)', top: 'calc(50% - 90px)', transform: 'translateY(-50%)' }}>
      <style>{`
        @keyframes soft-pulse {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(139,92,246,0.35)) drop-shadow(0 0 40px rgba(59,130,246,0.2)); opacity: 0.88; }
          50% { filter: drop-shadow(0 0 28px rgba(139,92,246,0.55)) drop-shadow(0 0 60px rgba(59,130,246,0.35)); opacity: 1; }
        }
        @keyframes flash {
          0% { opacity: 0; transform: scale(0.3); }
          10% { opacity: 1; transform: scale(1); }
          30% { opacity: 0; transform: scale(0.3); }
          100% { opacity: 0; transform: scale(0.3); }
        }
        @keyframes ghostPulseDezent {
          0%, 100% { opacity: 0; }
          50%      { opacity: 0.15; }
        }
        .gemini-wrap {
          position: relative;
          width: ${size}px;
          height: ${size}px;
          animation: ghostPulseDezent 1.5s ease-in-out infinite;
        }
        .gemini-wrap svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .flash {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px 3px rgba(255,255,255,0.9), 0 0 24px 8px rgba(255,255,255,0.3);
          pointer-events: none;
          animation: flash 2.8s ease-in-out infinite;
        }
        .flash-star {
          position: absolute;
          pointer-events: none;
          animation: flash 2.2s ease-in-out infinite;
        }
        .flash-star::before, .flash-star::after {
          content: '';
          position: absolute;
          background: white;
          border-radius: 1px;
          box-shadow: 0 0 8px 2px rgba(255,255,255,0.8);
        }
        .flash-star::before { width: 100%; height: 20%; top: 40%; left: 0; }
        .flash-star::after { width: 20%; height: 100%; top: 0; left: 40%; }
      `}</style>

      <div className="gemini-wrap">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="lbGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path d="M100,6 C108,54 146,92 194,100 C146,108 108,146 100,194 C92,146 54,108 6,100 C54,92 92,54 100,6 Z"
                fill="url(#lbGrad)" opacity="0.92" />
          <path d="M100,6 C108,54 146,92 194,100 C146,108 108,146 100,194 C92,146 54,108 6,100 C54,92 92,54 100,6 Z"
                fill="url(#lbGrad2)" opacity="0.15" style={{ mixBlendMode: "overlay" }} />
        </svg>

        {/* Dot flashes */}
        <div className="flash" style={{ width: "5px", height: "5px", top: "18%", left: "52%", animationDelay: "0s" }} />
        <div className="flash" style={{ width: "4px", height: "4px", top: "38%", left: "78%", animationDelay: "0.9s" }} />
        <div className="flash" style={{ width: "6px", height: "6px", top: "62%", left: "72%", animationDelay: "1.7s" }} />
        <div className="flash" style={{ width: "4px", height: "4px", top: "80%", left: "42%", animationDelay: "0.4s" }} />
        <div className="flash" style={{ width: "5px", height: "5px", top: "68%", left: "18%", animationDelay: "1.2s" }} />
        <div className="flash" style={{ width: "3px", height: "3px", top: "42%", left: "12%", animationDelay: "2.1s" }} />
        <div className="flash" style={{ width: "4px", height: "4px", top: "22%", left: "28%", animationDelay: "2.6s" }} />

        {/* Star flashes */}
        <div className="flash-star" style={{ width: "10px", height: "10px", top: "12%", left: "48%", animationDelay: "0.6s" }} />
        <div className="flash-star" style={{ width: "8px", height: "8px", top: "32%", left: "82%", animationDelay: "1.4s" }} />
        <div className="flash-star" style={{ width: "10px", height: "10px", top: "76%", left: "76%", animationDelay: "0.2s" }} />
        <div className="flash-star" style={{ width: "8px", height: "8px", top: "84%", left: "36%", animationDelay: "1.9s" }} />
        <div className="flash-star" style={{ width: "10px", height: "10px", top: "58%", left: "8%", animationDelay: "2.4s" }} />
        <div className="flash-star" style={{ width: "7px", height: "7px", top: "20%", left: "16%", animationDelay: "1.0s" }} />
      </div>
    </div>
  );
};

export default GeminiLogo;
