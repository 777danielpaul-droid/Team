import KimiBlob from './components/KimiBlob';
import LaserOctocat from './components/LaserOctocat';
import ClaudeNeonStarfish from './components/ClaudeNeonStarfish';
import ChatGPTLogo from './components/ChatGPTLogo';
import GeminiLogo from './components/GeminiLogo';

export default function App() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black z-0">
      {/* Bild als Hintergrund (etwas kleiner skaliert) */}
      <div
        className="absolute inset-0 bg-no-repeat opacity-15"
        style={{
          backgroundImage: "url('/hermi.png')",
          backgroundPosition: "center",
          backgroundSize: "65%",
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

      {/* Neon Starfish: top-center, slightly right */}
      <ClaudeNeonStarfish />

      {/* ChatGPT-Logo: centered below starfish */}
      <ChatGPTLogo size={200} />

      {/* Gemini-Logo: centered below ChatGPT */}
      <GeminiLogo size={36} />
    </div>
  );
}
