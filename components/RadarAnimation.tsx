'use client';

export default function RadarAnimation({
  label,
  caption,
  isActive = true
}: {
  label: string;
  caption: string;
  isActive?: boolean;
}) {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square rounded-full flex items-center justify-center p-8 bg-panel glass-card">
      {/* Outer Ring */}
      <div className="absolute inset-0 rounded-full border border-line m-4" />
      <div className="absolute inset-0 rounded-full border border-line m-12 opacity-50" />
      <div className="absolute inset-0 rounded-full border border-line m-20 opacity-20" />
      
      {/* Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-full h-px bg-ink" />
        <div className="absolute h-full w-px bg-ink" />
      </div>

      {/* Radar Sweep */}
      {isActive && (
        <div className="absolute inset-0 m-4 rounded-full overflow-hidden">
          <div className="w-full h-full radar-sweep" />
        </div>
      )}

      {/* Blips */}
      {isActive && (
        <>
          <div className="absolute w-2 h-2 rounded-full bg-danger top-1/4 left-1/3 animate-blip" />
          <div className="absolute w-2 h-2 rounded-full bg-safe top-2/3 right-1/4 animate-blip-delay" />
        </>
      )}

      {/* Center Label */}
      <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm border border-line min-w-[160px]">
        <div className="font-display font-bold text-ink mb-1">{label}</div>
        <div className="text-xs text-ink/60">{caption}</div>
      </div>
    </div>
  );
}
