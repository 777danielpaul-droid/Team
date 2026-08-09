import React, { useEffect, useRef, useState, useCallback } from 'react';
import './LaserOctocat.css';

const THRESHOLD = 440;
const PURPLE = '#a855f7';
const PURPLE_GLOW = '#7c3aed';
const PURPLE_BEAM = '#c084fc';
const CORE_WHITE = '#f3e8ff';

const LaserOctocat = () => {
  const containerRef = useRef(null);
  const catSvgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);
  const [eyePositions, setEyePositions] = useState({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 }
  });

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (catSvgRef.current) {
      const rect = catSvgRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) +
        Math.pow(e.clientY - centerY, 2)
      );

      const scaleX = rect.width / 98;
      const scaleY = rect.height / 96;

      setEyePositions({
        left: {
          x: rect.left + 36 * scaleX,
          y: rect.top + 42 * scaleY
        },
        right: {
          x: rect.left + 58 * scaleX,
          y: rect.top + 42 * scaleY
        }
      });

      setIsNear(dist < THRESHOLD);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div ref={containerRef} className="laser-container">
      <div className={`cat-wrapper ${isNear ? 'near' : ''}`}>
        <svg ref={catSvgRef} className={`cat-svg ${isNear ? 'moonlit' : ''}`} viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="white"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          />

          {/* Katzenauge links – 90° gedreht, vertikal länglich, keine Pupille */}
          <g className={`eye-group ${isNear ? 'on' : ''}`}>
            <ellipse
              cx="36"
              cy="42"
              rx="8"
              ry="3.5"
              fill={PURPLE}
              filter="drop-shadow(0 0 10px #7c3aed)"
              transform="rotate(90, 36, 42)"
            />
          </g>

          {/* Katzenauge rechts – 90° gedreht, vertikal länglich, keine Pupille */}
          <g className={`eye-group ${isNear ? 'on' : ''}`}>
            <ellipse
              cx="58"
              cy="42"
              rx="8"
              ry="3.5"
              fill={PURPLE}
              filter="drop-shadow(0 0 10px #7c3aed)"
              transform="rotate(90, 58, 42)"
            />
          </g>
        </svg>
      </div>

      {/* Segmented laser overlay — beams with gaps, spanning full screen */}
      <svg className="laser-overlay">
        {isNear && (() => {
          const MAX_DIST = Math.hypot(window.innerWidth, window.innerHeight);
          const SEGMENTS = 7;             // number of beam segments per eye
          const SEG_LEN = MAX_DIST * 0.5; // length of each segment
          const GAP = 12;                 // gap between segments (px, viewport)

          const eyes = [
            { x: eyePositions.left.x, y: eyePositions.left.y },
            { x: eyePositions.right.x, y: eyePositions.right.y }
          ];

          // For each eye, cast segmented beams toward the cursor, crossing
          // the screen with gaps between segments.
          const allSegments = [];
          eyes.forEach((eye, i) => {
            const angle = Math.atan2(mousePos.y - eye.y, mousePos.x - eye.x);
            const dirX = Math.cos(angle);
            const dirY = Math.sin(angle);

            for (let s = 0; s < SEGMENTS; s++) {
              const offset = 20 + s * (SEG_LEN + GAP);
              const sx = eye.x + dirX * offset;
              const sy = eye.y + dirY * offset;
              const ex = eye.x + dirX * (offset + SEG_LEN);
              const ey = eye.y + dirY * (offset + SEG_LEN);
              allSegments.push(
                <line key={`seg-beam-${i}-${s}`} x1={sx} y1={sy} x2={ex} y2={ey} className="laser-beam" />,
                <line key={`seg-core-${i}-${s}`} x1={sx} y1={sy} x2={ex} y2={ey} className="laser-core" />
              );
            }
          });
          return allSegments;
        })()}
      </svg>
    </div>
  );
};

export default LaserOctocat;
