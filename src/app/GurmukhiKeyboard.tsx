"use client";

type Props = {
  onInsert: (ch: string) => void;
  onBackspace: () => void;
  onClose: () => void;
};

const MATRAS = ["ਾ", "ਿ", "ੀ", "ੁ", "ੂ", "ੇ", "ੈ", "ੋ", "ੌ", "ੰ"];
const ROW1 = ["ੳ", "ਅ", "ੲ", "ਸ", "ਹ", "ਕ", "ਖ", "ਗ", "ਘ", "ਙ"];
const ROW2 = ["ਚ", "ਛ", "ਜ", "ਝ", "ਞ", "ਟ", "ਠ", "ਡ", "ਢ", "ਣ"];
const ROW3 = ["ਤ", "ਥ", "ਦ", "ਧ", "ਨ", "ਪ", "ਫ", "ਬ", "ਭ", "ਮ"];
const ROW4 = ["ਯ", "ਰ", "ਲ", "ਵ", "ੜ", "ਸ਼", "ਖ਼", "ਗ਼", "ਜ਼", "ਫ਼"];
const EXTRAS = ["ਂ", "ਃ", "੍", "ੑ", "਼", "ੴ"];
// Punctuation Sangat type when writing a shabad: dandi end-marker ॥, single
// danda ।, visram pauses ; . , and Gurmukhi digits for verse numbers.
const PUNCT = ["॥", "।", ";", ".", ",", "(", ")"];
const DIGITS = ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"];

function Key({
  ch,
  onTap,
  className = "",
}: {
  ch: string;
  onTap: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onTap}
      className={`flex h-10 min-w-0 flex-1 items-center justify-center rounded-md border border-amber-200 bg-white text-lg leading-none text-slate-900 shadow-sm transition active:bg-amber-100 ${className}`}
    >
      {ch}
    </button>
  );
}

function Row({ keys, onInsert }: { keys: string[]; onInsert: (ch: string) => void }) {
  return (
    <div className="flex gap-1.5">
      {keys.map((ch) => (
        <Key key={ch} ch={ch} onTap={() => onInsert(ch)} />
      ))}
    </div>
  );
}

export default function GurmukhiKeyboard({ onInsert, onBackspace, onClose }: Props) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-2 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <Row keys={MATRAS} onInsert={onInsert} />
        <Row keys={ROW1} onInsert={onInsert} />
        <Row keys={ROW2} onInsert={onInsert} />
        <Row keys={ROW3} onInsert={onInsert} />
        <Row keys={ROW4} onInsert={onInsert} />
        <Row keys={DIGITS} onInsert={onInsert} />
        <Row keys={PUNCT} onInsert={onInsert} />
        <div className="flex gap-1.5">
          {EXTRAS.map((ch) => (
            <Key key={ch} ch={ch} onTap={() => onInsert(ch)} />
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onInsert(" ")}
            className="flex h-10 flex-[3] items-center justify-center rounded-md border border-amber-200 bg-white text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm transition active:bg-amber-100"
          >
            Space
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onBackspace}
            aria-label="Backspace"
            className="flex h-10 flex-1 items-center justify-center rounded-md border border-amber-200 bg-white text-base text-amber-700 shadow-sm transition active:bg-amber-100"
          >
            ⌫
          </button>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-3 py-1 text-xs font-medium text-slate-600 hover:bg-amber-100 hover:text-slate-900"
        >
          Hide keyboard
        </button>
      </div>
    </div>
  );
}
