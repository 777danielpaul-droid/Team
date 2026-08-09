import { useState } from 'react';
import KimiBlob from './components/KimiBlob';
import LaserOctocat from './components/LaserOctocat';

export default function App() {
  const [showLaser, setShowLaser] = useState(false);

  if (showLaser) {
    return (
      <>
        <LaserOctocat />
        <button
          onClick={() => setShowLaser(false)}
          className="fixed top-4 right-4 z-50 px-3 py-1 text-xs bg-black/30 hover:bg-black/50 text-white rounded transition-colors"
        >
          ← Zurück zu KI-Blob
        </button>
      </>
    );
  }

  return (
    <main className="relative h-screen w-full overflow-hidden flex items-end justify-center pb-20">
      <KimiBlob canvasSize={384} displaySize="min(80vw, 70vh)" autoAim={true} />
      <button
        onClick={() => setShowLaser(true)}
        className="fixed top-4 right-4 z-50 px-3 py-1 text-xs bg-black/30 hover:bg-black/50 text-white rounded transition-colors"
      >
        🎯 Laser-Octocat
      </button>
    </main>
  );
}
