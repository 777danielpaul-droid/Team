import React, { useRef, useEffect } from 'react';

export default function KimiBlob({ canvasSize = 128, displaySize = 320 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const ballWrapRef = useRef(null);
  const laserRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const wrap = wrapRef.current;
    const ballWrap = ballWrapRef.current;
    const laser = laserRef.current;

    let mouseX = 8, mouseY = 127;
    let ballX = 0, ballY = 0;
    let velX = 0, velY = 0;
    let time = 0;
    let blinkState = 0;
    let blinkTimer = 0;
    let blinkProgress = 0;
    let laserIntensity = 0;
    let rafId;
    let lastMouseMove = Date.now();

    const handleMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / (r.width / canvasSize);
      mouseY = (e.clientY - r.top) / (r.height / canvasSize);
      lastMouseMove = Date.now();
    };
    const handleMouseLeave = () => {
      mouseX = 8;
      mouseY = 127;
      laserIntensity = 0; // Force laser off when mouse leaves
    };

    wrap.addEventListener('mousemove', handleMouseMove);
    wrap.addEventListener('mouseleave', handleMouseLeave);

    function draw() {
      time += 0.025;

      blinkTimer++;
      if (blinkState === 0 && blinkTimer > 250 + Math.random() * 300) {
        blinkState = 1; blinkTimer = 0;
      }
      if (blinkState === 1) {
        blinkProgress += 0.08;
        if (blinkProgress >= 1) { blinkProgress = 1; blinkState = 2; }
      }
      if (blinkState === 2) {
        blinkProgress -= 0.08;
        if (blinkProgress <= 0) { blinkProgress = 0; blinkState = 0; blinkTimer = 0; }
      }

      const cx = canvasSize / 2;
      const cy = canvasSize / 2;

      const targetX = (mouseX - cx) * 0.6;
      const targetY = (mouseY - cy) * 0.6;
      velX += (targetX - ballX) * 0.02;
      velY += (targetY - ballY) * 0.02;
      velX *= 0.92; velY *= 0.92;
      ballX += velX; ballY += velY;

      // Float animation — ballWrap floats gently (also read live for laser alignment)
      const floatX = Math.sin(time) * 2;
      const floatY = Math.cos(time * 0.6) * 2.5;
      ballWrap.style.transform = `translate(${ballX + floatX}px, ${ballY + floatY}px)`;

      ctx.clearRect(0, 0, canvasSize, canvasSize);
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.10, 3.5);
      const lookX = Math.cos(angle) * dist;
      const lookY = Math.sin(angle) * dist;

      const eyeRx = 9;
      const eyeRy = 11;
      const closedH = 1.8;
      const currentH = eyeRy * (1 - blinkProgress) + closedH * blinkProgress;

      const leftEyeX = 48 + lookX;
      const leftEyeY = 56 + lookY;
      const rightEyeX = 80 + lookX;
      const rightEyeY = 56 + lookY;

      const dLeft = Math.sqrt((mouseX - leftEyeX) ** 2 + (mouseY - leftEyeY) ** 2);
      const dRight = Math.sqrt((mouseX - rightEyeX) ** 2 + (mouseY - rightEyeY) ** 2);
      const minDist = Math.min(dLeft, dRight);

      // Inaktivitäts-Reset: Wenn die Maus > 150ms nicht bewegt wurde,
      // schalten die Laser automatisch aus — verhindert "dauerfeuer"
      const now = Date.now();
      const inactive = now - lastMouseMove > 150;
      const targetLaser = (minDist < 128 && !inactive)
        ? Math.max(0, 1 - minDist / 128)
        : 0;
      laserIntensity += (targetLaser - laserIntensity) * 0.1;

      // --- Blob body ---
      const innerGlow = ctx.createRadialGradient(64, 56, 0, 64, 62, 42);
      innerGlow.addColorStop(0, '#E0F8FF');
      innerGlow.addColorStop(0.2, '#4DD0E1');
      innerGlow.addColorStop(0.5, '#00B0FF');
      innerGlow.addColorStop(0.8, '#0091EA');
      innerGlow.addColorStop(1, '#006064');
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.ellipse(64, 64, 38, 34, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(48, 42, 10, 6, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.beginPath();
      ctx.ellipse(54, 48, 14, 9, -0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(leftEyeX, leftEyeY, eyeRx, currentH, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(rightEyeX, rightEyeY, eyeRx, currentH, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 160, 180, 0.12)';
      ctx.beginPath();
      ctx.ellipse(36, 66, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(92, 66, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // --- Laser: DOM-based beams (separate overlay, no canvas clip) ---
      const alpha = laserIntensity > 0.01 ? laserIntensity : 0;
      if (alpha <= 0.01) {
        laser.innerHTML = '';
      } else {
        const flicker = 0.88 + Math.random() * 0.12;
        const a = alpha * flicker;

        // Live DOM measurement — works for ANY displaySize (string or number)
        const canvasRect = canvas.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        const cssScale = canvasRect.width / canvasSize; // actual rendered scale

        // getBoundingClientRect returns TRANSFORMED position — already includes ballWrap offset
        // No need to add ballOffsetX/Y; it's already baked into canvasRect
        const eyeLX = canvasRect.left + leftEyeX * cssScale - wrapRect.left;
        const eyeLY = canvasRect.top + leftEyeY * cssScale - wrapRect.top;
        const eyeRX = canvasRect.left + rightEyeX * cssScale - wrapRect.left;
        const eyeRY = canvasRect.top + rightEyeY * cssScale - wrapRect.top;

        // Mouse in wrapper-space (mouseX/Y in canvas coords, scaled to css)
        const mouseWrapX = mouseX * cssScale + (canvasRect.left - wrapRect.left);
        const mouseWrapY = mouseY * cssScale + (canvasRect.top - wrapRect.top);

        // Beam vectors & lengths to mouse
        const angleL = Math.atan2(mouseWrapY - eyeLY, mouseWrapX - eyeLX);
        const lenL = Math.hypot(mouseWrapX - eyeLX, mouseWrapY - eyeLY);
        const angleR = Math.atan2(mouseWrapY - eyeRY, mouseWrapX - eyeRX);
        const lenR = Math.hypot(mouseWrapX - eyeRX, mouseWrapY - eyeRY);

        // Long-range beams (1.5x viewbox) so lasers extend beyond the blob
        const maxLen = canvasRect.width * 1.5;
        const endLX = eyeLX + Math.cos(angleL) * Math.max(lenL, maxLen);
        const endLY = eyeLY + Math.sin(angleL) * Math.max(lenL, maxLen);
        const endRX = eyeRX + Math.cos(angleR) * Math.max(lenR, maxLen);
        const endRY = eyeRY + Math.sin(angleR) * Math.max(lenR, maxLen);

        laser.innerHTML = '';

        /**
         * Laser-Cannon beam: two DOM layers per eye.
         *
         * Layer 1: Soft volumetric glow — wide, blurred, cyan-blue backdrop
         *          that simulates atmospheric scattering around the beam.
         * Layer 2: Sharp core beam — white-hot → cyan → deep blue gradient
         *          with a dense multi-ring bloom shadow.
         *
         * Each layer has its own CSS animation for independent pulsing,
         * giving the laser a living, energetic feel.
         */
        const createBeam = (eyeX, eyeY, endX, endY, angle) => {
          const beamLen = Math.hypot(endX - eyeX, endY - eyeY);

          // --- Layer 1: Soft volumetric glow (atmospheric scatter) ---
          const glow = document.createElement('div');
          glow.style.position = 'absolute';
          glow.style.left = `${eyeX}px`;
          glow.style.top = `${eyeY}px`;
          glow.style.width = `${Math.max(beamLen, 1)}px`;
          glow.style.height = '30px';
          glow.style.transformOrigin = '0 50%';
          glow.style.transform = `rotate(${angle}rad)`;
          glow.style.borderRadius = '50%';
          glow.style.background = `radial-gradient(ellipse at center, rgba(2, 136, 209, ${a * 0.55}) 0%, transparent 70%)`;
          glow.style.filter = 'blur(5px) saturate(1.5)';
          glow.style.animation = 'kiki-beam-glow-pulse 1.7s ease-in-out infinite';
          glow.style.pointerEvents = 'none';
          laser.appendChild(glow);

          // --- Layer 2: Sharp core beam (white-hot → cyan → deep blue) ---
          const beam = document.createElement('div');
          beam.style.position = 'absolute';
          beam.style.left = `${eyeX}px`;
          beam.style.top = `${eyeY}px`;
          beam.style.width = `${Math.max(beamLen, 1)}px`;
          beam.style.height = '8px';
          beam.style.transformOrigin = '0 50%';
          beam.style.transform = `rotate(${angle}rad)`;
          beam.style.borderRadius = '4px';
          beam.style.background = 'linear-gradient(90deg, #ffffff 0%, #00e5ff 35%, #4fc3f7 65%, #0288d1 100%)';
          beam.style.boxShadow = `
            0 0 2px 1px rgba(255, 255, 255, ${a * 0.95}),
            0 0 4px 2px rgba(255, 229, 255, ${a * 0.8}),
            0 0 8px 3px rgba(79, 195, 247, ${a * 0.7}),
            0 0 16px 6px rgba(2, 229, 255, ${a * 0.45}),
            0 0 28px 10px rgba(2, 136, 209, ${a * 0.25})
          `;
          beam.style.animation = 'kiki-beam-core-pulse 1.3s ease-in-out infinite';
          beam.style.pointerEvents = 'none';
          laser.appendChild(beam);
        };

        createBeam(eyeLX, eyeLY, endLX, endLY, angleL);
        createBeam(eyeRX, eyeRY, endRX, endRY, angleR);

        // --- Impact effects ---

        // Bright core flash — sharp white-cyan burst at the beam impact point
        const createImpactFlash = (x, y) => {
          const f = document.createElement('div');
          f.style.position = 'absolute';
          f.style.left = `${x}px`;
          f.style.top = `${y}px`;
          f.style.width = '14px';
          f.style.height = '14px';
          f.style.background = `rgba(255, 255, 255, ${a * 0.9})`;
          f.style.borderRadius = '50%';
          f.style.transform = 'translate(-50%, -50%)';
          f.style.boxShadow = `0 0 8px 2px rgba(0, 229, 255, ${a * 0.8})`;
          f.style.animation = 'kiki-impact-flash 2s ease-out infinite';
          f.style.pointerEvents = 'none';
          laser.appendChild(f);
        };
        createImpactFlash(endLX, endLY);
        createImpactFlash(endRX, endRY);

        // Concentric rings — pulsing outward with bloom (cyan-blue)
        const flares = [[34, 0.55, 0.9], [24, 0.4, 0.82], [16, 0.6, 0.75], [10, 0.75, 0.95]];
        for (const [sz, coreOp, bloomOp] of flares) {
          const createFlare = (x, y) => {
            const f = document.createElement('div');
            f.style.position = 'absolute';
            f.style.left = `${x}px`;
            f.style.top = `${y}px`;
            f.style.width = `${sz}px`;
            f.style.height = `${sz}px`;
            f.style.background = `rgba(2, 136, 209, ${a * coreOp})`;
            f.style.borderRadius = '50%';
            f.style.transform = 'translate(-50%, -50%)';
            f.style.boxShadow = `0 0 ${sz * 2}px ${sz}px rgba(79, 195, 247, ${a * bloomOp})`;
            f.style.animation = `kiki-flare ${1.5 + Math.random() * 0.5}s ease-out infinite`;
            f.style.pointerEvents = 'none';
            laser.appendChild(f);
          };
          createFlare(endLX, endLY);
          createFlare(endRX, endRY);
        }

        // Distant impact halo — large, soft, very faint, expanding
        const createHalo = (x, y) => {
          const f = document.createElement('div');
          f.style.position = 'absolute';
          f.style.left = `${x}px`;
          f.style.top = `${y}px`;
          f.style.width = '60px';
          f.style.height = '60px';
          f.style.background = `rgba(2, 136, 209, ${a * 0.15})`;
          f.style.borderRadius = '50%';
          f.style.transform = 'translate(-50%, -50%)';
          f.style.boxShadow = `0 0 30px 12px rgba(2, 229, 255, ${a * 0.08})`;
          f.style.animation = 'kiki-impact-halo 2.5s ease-out infinite';
          f.style.pointerEvents = 'none';
          laser.appendChild(f);
        };
        createHalo(endLX, endLY);
        createHalo(endRX, endRY);
      }

      rafId = setTimeout(draw, 16); // ~60fps — tickt auch im Hintergrund-Tab
    }

    draw();
    return () => {
      clearTimeout(rafId);
      wrap.removeEventListener('mousemove', handleMouseMove);
      wrap.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasSize, displaySize]);

  return (
    <>
      <style>{`
        @keyframes kiki-flare {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.8); }
        }

        @keyframes kiki-beam-core-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        @keyframes kiki-beam-glow-pulse {
          0%, 100% { opacity: 0.5; filter: blur(5px) saturate(1); }
          50% { opacity: 0.7; filter: blur(8px) saturate(1.3); }
        }

        @keyframes kiki-impact-flash {
          0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.3); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(0.6); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes kiki-impact-halo {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.4); filter: blur(2px); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); filter: blur(4px); }
        }

        .kiki-beam-core { animation: kiki-beam-core-pulse 1.3s ease-in-out infinite; }
        .kiki-beam-glow { animation: kiki-beam-glow-pulse 1.7s ease-in-out infinite; }
        .kiki-flare { animation: kiki-flare 1.5s ease-out infinite; }
      `}</style>
      <div
        ref={wrapRef}
        className="relative flex-center"
        style={{
          width: displaySize,
          height: displaySize,
          overflow: 'visible',
        }}
      >
        <div
          ref={ballWrapRef}
          className="absolute"
          style={{ transition: 'transform 0.15s ease-out', overflow: 'visible' }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="block"
            style={{ width: displaySize, height: displaySize, imageRendering: 'pixelated', overflow: 'visible' }}
          />
        </div>
        {/* Laser overlay — separate, overflow:visible, no clipping */}
        <div ref={laserRef} className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }} />
      </div>
    </>
  );
}
