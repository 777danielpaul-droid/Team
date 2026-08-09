import KimiBlob from './components/KimiBlob';
import LaserOctocat from './components/LaserOctocat';
import ClaudeNeonStarfish from './components/ClaudeNeonStarfish';

export default function App() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black z-0">
      {/* LaserOctocat: top-left corner, compact container */}
      <div className="fixed top-4 left-4 z-10 w-64 h-48 octocat-corner">
        <LaserOctocat />
      </div>

      {/* KI-Blob: bottom-right area */}
      <div className="fixed bottom-8 right-8 z-20 flex items-end justify-center">
        <KimiBlob canvasSize={256} displaySize="min(40vw, 35vh)" autoAim={true} />
      </div>

      {/* Neon Starfish: bottom-right corner (above KI-Blob) */}
      <ClaudeNeonStarfish />
    </div>
  );
}
