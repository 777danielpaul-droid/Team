import KimiBlob from './components/KimiBlob';
import LaserOctocat from './components/LaserOctocat';
import ClaudeNeonStarfish from './components/ClaudeNeonStarfish';

export default function App() {
  return (
    <div
      className="fixed top-0 left-0 w-full h-screen z-0"
      style={{
        backgroundImage: "linear-gradient(135deg, #1a0033 0%, #2a004d 50%, #0f001a 100%)"
      }}>
      {/* Bild als Hintergrund in lila Tönung */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: "url('/Users/danielpaul/Desktop/images.jpeg')",
          filter: "sepia(0.8) hue-rotate(225deg) saturate(3) brightness(0.6) contrast(1.2)"
        }}
      />

      {/* Globale Styles: lila Icon-Tönung + Mond-Glow */}
      <style>{`
        /* Mondlicht-Glow nur auf das cat-SVG-Symbol */
        .cat-svg.moonlit {
          filter: sepia(0.9) hue-rotate(225deg) saturate(2.5) brightness(1.1)
                  drop-shadow(0 0 30px #e0b0ff)
                  drop-shadow(0 0 60px #a870ff);
          animation: moonGlow 4.2s ease-in-out infinite;
        }

        /* Lila-Tönung für Sternstern */
        .starfish-wrapper {
          filter: sepia(0.9) hue-rotate(225deg) saturate(2.5) brightness(1.1);
        }

        @keyframes moonGlow {
          0%, 100% {
            filter: sepia(0.9) hue-rotate(225deg) saturate(2.5) brightness(1.1)
                    drop-shadow(0 0 30px #e0b0ff)
                    drop-shadow(0 0 60px #a870ff);
          }
          50% {
            filter: sepia(0.9) hue-rotate(225deg) saturate(2.5) brightness(1.15)
                    drop-shadow(0 0 24px #e0b0ff)
                    drop-shadow(0 0 48px #a870ff);
          }
        }
      `}</style>

      {/* LaserOctocat: top-left, kein wrapper — laser-container hat fixed Position selbst */}
      <LaserOctocat />

      {/* KI-Blob: bottom-right area */}
      <div className="fixed bottom-8 right-8 z-20 flex items-end justify-center">
        <KimiBlob canvasSize={256} displaySize="min(40vw, 35vh)" autoAim={true} />
      </div>

      {/* Neon Starfish: top-right corner */}
      <ClaudeNeonStarfish />
    </div>
  );
}
