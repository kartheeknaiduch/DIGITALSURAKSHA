import RadarAnimation from '@/components/RadarAnimation';

export default async function CheckIndex() {
  return (
    <div className="bg-panel rounded-3xl border border-line p-12 text-center h-full min-h-[400px] flex flex-col items-center justify-center animate-fadein">
      <div className="scale-75 -my-8 opacity-70 pointer-events-none">
        <RadarAnimation label="Ready" caption="Select a tool" isActive={false} />
      </div>
      <h2 className="text-2xl font-display font-bold text-ink mb-2">Select a scanning tool</h2>
      <p className="text-ink/60">Choose a tool from the menu to start analyzing for threats.</p>
    </div>
  );
}
