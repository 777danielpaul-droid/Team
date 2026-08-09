import KimiBlob from './components/KimiBlob';

export default function App() {
  return (
    <main className="h-screen w-full overflow-hidden flex items-end justify-center pb-20">
      <KimiBlob canvasSize={384} displaySize="min(80vw, 70vh)" autoAim={true} />
    </main>
  );
}
