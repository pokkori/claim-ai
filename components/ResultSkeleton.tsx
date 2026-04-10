"use client";

interface ResultSkeletonProps {
  accentColor?: string;
  rows?: number;
}

export default function ResultSkeleton({ accentColor = "#3B82F6", rows = 4 }: ResultSkeletonProps) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        minHeight: "192px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      aria-busy="true"
      aria-label="AI分析中"
    >
      {/* accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
      {/* shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.8s ease-in-out infinite",
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-pulse { animation: none !important; }
        }
      `}} />
      {/* skeleton rows */}
      <div className="space-y-3 mt-2">
        <div
          className="skeleton-pulse h-3 rounded-full opacity-20"
          style={{ width: "75%", background: accentColor, animation: "pulse 1.5s ease-in-out infinite" }}
        />
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="skeleton-pulse h-2.5 rounded-full bg-white opacity-10"
            style={{
              width: `${[95, 88, 72, 82, 65, 90, 78][i % 7]}%`,
              animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-5">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2" style={{ borderColor: accentColor }} />
        <span className="text-xs opacity-50" style={{ color: accentColor }}>AI分析中...</span>
      </div>
    </div>
  );
}
