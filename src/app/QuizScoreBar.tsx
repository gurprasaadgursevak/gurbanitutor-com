"use client";

export default function QuizScoreBar({
  score,
  attempts,
  streak,
  best,
}: {
  score: number;
  attempts: number;
  streak: number;
  best: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      <Stat label="Score" value={`${score} / ${attempts}`} />
      <Stat label="Streak" value={String(streak)} />
      <Stat label="Best" value={String(best)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
      <div className="text-lg font-bold text-amber-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-amber-900/60">
        {label}
      </div>
    </div>
  );
}
