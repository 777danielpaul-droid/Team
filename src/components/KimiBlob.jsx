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

    let mouseX = -64, mouseY = -64; // far outside canvas (128x128) — lasers OFF by default
    let ballX = 0, ballY = 0;
    let velX = 0, velY = 0;
    let time = 0;
    let blinkState = 0;
    let blinkTimer = 0;
    let blinkProgress = 0;
    let laserIntensity = 0;
    let rafId;

    const handleMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / (r.width / canvasSize);
      mouseY = (e.clientY - r.top) / (r.height / canvasSize);

      // Update laser intensity IMMEDIATELY on mousemove (no timer dependency)
      const dLeft = Math.sqrt((mouseX - 48) ** 2 + (mouseY - 56) ** 2);
      const dRight = Math.sqrt((mouseX - 80) ** 2 + (mouseY - 56) ** 2);
      const minDist = Math.min(dLeft, dRight);
      const targetLaser = minDist < 128
        ? Math.max(0, 1 - minDist / 128)
        : 0;
      laserIntensity = targetLaser;
      renderLasers(); // render immediately — don't wait for rAF which may be throttled
    };

    const handleMouseLeave = () => {
      mouseX = -64;
      mouseY = -64;
      laserIntensity = 0; // Force laser off when mouse leaves
      renderLasers();
    };

    // window mousemove: fires everywhere, even when cursor is outside wrap bounds
    // wrap mouseleave: fires when cursor leaves the blob's interaction area
    window.addEventListener('mousemove', handleMouseMove);
    wrap.addEventListener('mouseleave', handleMouseLeave);

    // --- Laser DOM renderer (always ticks via rAF + immediate on mousemove) ---
    function renderLasers() {
      const alpha = laserIntensity > 0.001 ? laserIntensity : 0;
      if (alpha <= 0.001) {
        laser.innerHTML = '';
        return;
      }

      const flicker = 0.85 + Math.random() * 0.30; // wider flicker range for vivid blink
      const a = alpha * flicker;

      // Live DOM measurement — works for ANY displaySize (string or number)
      const canvasRect = canvas.getBoundingClientRect();
      const cssScale = canvasRect.width / canvasSize;

      // Eye positions in VIEWPORT space (laser overlay is position:fixed)
      const eyeLX = canvasRect.left + 48 * cssScale;
      const eyeLY = canvasRect.top + 56 * cssScale;
      const eyeRX = canvasRect.left + 80 * cssScale;
      const eyeRY = canvasRect.top + 56 * cssScale;

      // Mouse in VIEWPORT space
      const mouseWrapX = mouseX * cssScale + canvasRect.left;
      const mouseWrapY = mouseY * cssScale + canvasRect.top;

      // Beam vectors & lengths to mouse
      const angleL = Math.atan2(mouseWrapY - eyeLY, mouseWrapX - eyeLX);
      const lenL = Math.hypot(mouseWrapX - eyeLX, mouseWrapY - eyeLY);
      const angleR = Math.atan2(mouseWrapY - eyeRY, mouseWrapX - eyeRX);
      const lenR = Math.hypot(mouseWrapX - eyeRX, mouseWrapY - eyeRY);

      // Laser beams extend to the cursor AND beyond — spanning the full screen
      const maxLen = Math.hypot(window.innerWidth, window.innerHeight) * 0.9;
      const endLX = eyeLX + Math.cos(angleL) * Math.max(lenL, maxLen);
      const endLY = eyeLY + Math.sin(angleL) * Math.max(lenL, maxLen);
      const endRX = eyeRX + Math.cos(angleR) * Math.max(lenR, maxLen);
      const endRY = eyeRY + Math.sin(angleR) * Math.max(lenR, maxLen);

      laser.innerHTML = '';

      const createBeam = (eyeX, eyeY, endX, endY, angle) => {
        const beamLen = Math.hypot(endX - eyeX, endY - eyeY);

        // --- Layer 1: Soft volumetric glow (atmospheric scatter) ---
        const glow = document.createElement('div');
        glow.style.position = 'absolute';
        glow.style.left = `${eyeX}px`;
        glow.style.top = `${eyeY}px`;
        glow.style.width = `${Math.max(beamLen, 1)}px`;
        glow.style.height = '70px';
        glow.style.transformOrigin = '0 50%';
        glow.style.transform = `rotate(${angle}rad)`;
        glow.style.borderRadius = '50%';
        glow.style.background = `radial-gradient(ellipse at center, rgba(0, 250, 255, ${a * 0.9}) 0%, rgba(2, 229, 255, ${a * 0.6}) 25%, rgba(2, 136, 209, ${a * 0.3}) 50%, transparent 70%)`;
        glow.style.filter = 'blur(5px) saturate(1.5)';
        glow.style.animation = 'kiki-beam-glow-pulse 1.9s steps(3, jump-none) infinite';
        glow.style.pointerEvents = 'none';
        laser.appendChild(glow);

        // --- Layer 2: Wide core beam (white-hot → cyan) ---
        const beam = document.createElement('div');
        beam.style.position = 'absolute';
        beam.style.left = `${eyeX}px`;
        beam.style.top = `${eyeY}px`;
        beam.style.width = `${Math.max(beamLen, 1)}px`;
        beam.style.height = '16px';
        beam.style.transformOrigin = '0 50%';
        beam.style.transform = `rotate(${angle}rad)`;
        beam.style.borderRadius = '8px';
        beam.style.background = 'linear-gradient(90deg, #ffffff 0%, #00faff 25%, #00e5ff 40%, #4fc3f7 65%, #0288d1 100%)';
        beam.style.boxShadow = `
          0 0 3px 2px rgba(255, 255, 255, ${a * 1}),
          0 0 6px 3px rgba(0, 250, 255, ${a * 1}),
          0 0 12px 5px rgba(2, 229, 255, ${a * 0.95}),
          0 0 24px 8px rgba(79, 195, 247, ${a * 0.85}),
          0 0 48px 12px rgba(2, 229, 255, ${a * 0.7}),
          0 0 80px 16px rgba(2, 136, 209, ${a * 0.4})
        `;
        beam.style.animation = 'kiki-beam-core-pulse 1.6s steps(4, jump-none) infinite';
        beam.style.pointerEvents = 'none';
        laser.appendChild(beam);

        // --- Layer 3: Sharp white-hot core (thin central line, like Octocat's laser-core) ---
        const sharpCore = document.createElement('div');
        sharpCore.style.position = 'absolute';
        sharpCore.style.left = `${eyeX}px`;
        sharpCore.style.top = `${eyeY - 2}px`; // vertikal zentriert in 16px Core (4px hoch → -2px)
        sharpCore.style.width = `${Math.max(beamLen, 1)}px`;
        sharpCore.style.height = '4px';
        sharpCore.style.transformOrigin = '0 50%';
        sharpCore.style.transform = `rotate(${angle}rad)`;
        sharpCore.style.borderRadius = '1px';
        sharpCore.style.background = 'linear-gradient(90deg, #ffffff 0%, #ffffff 45%, #e0f7ff 50%, #ffffff 55%, #ffffff 100%)';
        sharpCore.style.boxShadow = `
          0 0 1px 1px rgba(255, 255, 255, ${a * 1}),
          0 0 3px 2px rgba(0, 250, 255, ${a * 1}),
          0 0 6px 3px rgba(255, 255, 255, ${a * 0.9}),
          0 0 12px 4px rgba(2, 229, 255, ${a * 0.7})
        `;
        sharpCore.style.animation = 'kiki-beam-core-pulse 1.6s steps(4, jump-none) infinite';
        sharpCore.style.pointerEvents = 'none';
        laser.appendChild(sharpCore);
      };

      createBeam(eyeLX, eyeLY, endLX, endLY, angleL);
      createBeam(eyeRX, eyeRY, endRX, endRY, angleR);

      // --- Impact effects ---
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
        f.style.animation = 'kiki-impact-flash 0.8s steps(2, jump-none) infinite';
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
          f.style.animation = `kiki-flare ${0.9 + Math.random() * 0.3}s steps(2, jump-none) infinite`;
          f.style.pointerEvents = 'none';
          laser.appendChild(f);
        };
        createFlare(endLX, endLY);
        createFlare(endRX, endRY);
      }

      // Distant impact halo
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
        f.style.animation = 'kiki-impact-halo 1.1s steps(3, jump-none) infinite';
        f.style.pointerEvents = 'none';
        laser.appendChild(f);
      };
      createHalo(endLX, endLY);
      createHalo(endRX, endRY);
    }

    // --- Canvas animation (blob body + ball) via requestAnimationFrame ---
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

      // Re-render lasers for idle-fade-out even when rAF ticks
      renderLasers();

      rafId = requestAnimationFrame(draw);
    }

    draw();
    renderLasers();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
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
          0%, 100% { opacity: 0.15; }
          0.5% { opacity: 0.95; }
          50% { opacity: 1; }
          50.5% { opacity: 0.25; }
          99.5% { opacity: 0.9; }
        }

        @keyframes kiki-beam-glow-pulse {
          0%, 100% { opacity: 0.15; filter: blur(3px) saturate(1); }
          0.5% { opacity: 0.8; filter: blur(6px) saturate(1.5); }
          50% { opacity: 1; filter: blur(8px) saturate(2); }
          50.5% { opacity: 0.2; filter: blur(2px) saturate(1); }
          99.5% { opacity: 0.7; filter: blur(5px) saturate(1.3); }
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
        className="relative"
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
      </div>
      {/* Laser overlay — fixed to viewport, outside transform containers */}
      <div ref={laserRef} className="fixed inset-0 pointer-events-none" style={{ overflow: 'visible' }} />
    </>
  );
}
