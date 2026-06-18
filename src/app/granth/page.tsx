"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SocialLinks from "../SocialLinks";
import SehajPaathPlayer from "./SehajPaathPlayer";
import GurmukhiFontToggle from "./GurmukhiFontToggle";

type Granth = "sggs" | "dasam" | "bhaiGurdas" | "bhaiNandlal";

const GRANTH_META: Record<Granth, { title: string; unit: string; angKey: string; tsv: string }> = {
  sggs:        { title: "Sri Guru Granth Sahib Ji",       unit: "Ang",     angKey: "granth_sggs_ang",        tsv: "/sggs.tsv" },
  dasam:       { title: "Sri Dasam Guru Granth Sahib Ji", unit: "Ang",     angKey: "granth_dasam_ang",       tsv: "/dasam.tsv" },
  bhaiGurdas:  { title: "Bhai Gurdas Sahib Ji Vaaran",    unit: "Pauri",   angKey: "granth_bhai_gurdas_ang", tsv: "/bhai_gurdas.tsv" },
  bhaiNandlal: { title: "Bhai Nand Lal Sahib Ji",         unit: "Section", angKey: "granth_bhai_nandlal_ang", tsv: "/bhai_nandlal.tsv" },
};

type Line = {
  ang: number;
  gurmukhi: string;
  steek1?: string; // formerly SSK
  steek2?: string; // formerly BMS
  ucharanTip?: string;
  extendedUcharanTip?: string;
  arth?: string;
  romanized?: string;
};

const QUOTES = new Set(['"', "“", "”", "‘", "’", "'", "`"]);

function strip(s: string): string {
  return s
    .split("")
    .filter((c) => !QUOTES.has(c))
    .join("")
    .trim();
}

// IMPORTANT: do not use String.prototype.trim() on the row — \t is whitespace,
// and trim() would silently strip trailing tab-separated empty columns, dropping
// rows below the 9-column threshold. Only strip the trailing \r from CRLF lines.
function stripCR(s: string): string {
  return s.endsWith("\r") ? s.slice(0, -1) : s;
}

function parseSGGS(text: string): Line[] {
  const rows = text.split("\n");
  const out: Line[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = stripCR(rows[i]);
    if (!r) continue;
    const cols = r.split("\t");
    if (cols.length < 9) continue;
    const ang = parseInt((cols[0] || "").trim(), 10);
    if (Number.isNaN(ang)) continue;
    out.push({
      ang,
      gurmukhi: strip(cols[2] || ""),
      steek1: strip(cols[3] || ""),
      steek2: strip(cols[4] || ""),
      ucharanTip: strip(cols[5] || ""),
      extendedUcharanTip: strip(cols[6] || ""),
      arth: strip(cols[7] || ""),
    });
  }
  return out;
}

// Parses our 9-column auxiliary-granth TSV schema:
//   0 ang | 1 gurmukhi | 2 ucharan_tip | 3 extended_tip | 4 ssk_english
//   5 bms_english | 6 romanized | 7 arth | 8 extended_arth
//
// Used for Sri Dasam Granth (since the recent merge gave it SSK English
// steeks for ~50% of verses), Bhai Gurdas Sahib Ji Vaaran, and Bhai
// Nandlal Sahib Ji. The TSVs have no header row, so we start at i = 0.
function parseAuxiliary(text: string, startRow = 0): Line[] {
  const rows = text.split("\n");
  const out: Line[] = [];
  for (let i = startRow; i < rows.length; i++) {
    const r = stripCR(rows[i]);
    if (!r) continue;
    const cols = r.split("\t");
    if (cols.length < 2) continue;
    const ang = parseInt((cols[0] || "").trim(), 10);
    if (Number.isNaN(ang)) continue;
    out.push({
      ang,
      gurmukhi: strip(cols[1] || ""),
      ucharanTip: strip(cols[2] || ""),
      extendedUcharanTip: strip(cols[3] || ""),
      steek1: strip(cols[4] || ""),
      steek2: strip(cols[5] || ""),
      romanized: strip(cols[6] || ""),
      arth: strip(cols[7] || ""),
    });
  }
  return out;
}

// Kept as a thin alias so existing call sites still work — the canonical
// dasam.tsv is now the merged 9-col file, same schema as Bhai Gurdas.
function parseDasam(text: string): Line[] {
  return parseAuxiliary(text, 0);
}

// MARK: - Nitnem banis (ported from iOS BaniID.rowRanges)
//
// Each bani is a list of "segments" rendered in reading order. Simple banis
// have a single SGGS or Dasam segment; Sri Rehrass Sahib is composite and
// interleaves both Granths with literal Gurmukhi headers.

type BaniSegment =
  | { kind: "sggs"; range: [number, number] }
  | { kind: "dasam"; range: [number, number] }
  | { kind: "literal"; text: string };

type BaniDef = {
  id: string;
  name: string;
  subtitle: string;
  segments: BaniSegment[];
};

type ExtraBaniCategory = {
  id: number;
  name: string;
  nameGurmukhi: string;
  banis: BaniDef[];
};

const BANI_LIST: BaniDef[] = [
  {
    id: "moolMantar",
    name: "Mool Mantar",
    subtitle: "Beginning of Sri Guru Granth Sahib Ji",
    segments: [{ kind: "sggs", range: [2, 5] }],
  },
  {
    id: "japji",
    name: "Sri Japji Sahib",
    subtitle: "Morning Nitnem · M1",
    segments: [{ kind: "sggs", range: [2, 386] }],
  },
  {
    id: "jaap",
    name: "Sri Jaap Sahib",
    subtitle: "Morning Nitnem · Sri Dasam Guru Granth Sahib Ji",
    segments: [{ kind: "dasam", range: [1, 791] }],
  },
  {
    id: "tvaPrasaad",
    name: "Sri Tav Prasaad Savaiye",
    subtitle: "Morning Nitnem · from Akal Ustat",
    segments: [{ kind: "dasam", range: [881, 921] }],
  },
  {
    id: "chaupai",
    name: "Sri Chaupai Sahib",
    subtitle: "Evening Nitnem · M10",
    segments: [
      { kind: "literal", text: "ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹ॥" },
      { kind: "literal", text: "ਪਾਤਸਾਹੀ ੧੦॥" },
      { kind: "dasam", range: [67078, 67197] },
      { kind: "dasam", range: [13377, 13384] },
    ],
  },
  {
    id: "anand",
    name: "Sri Anand Sahib",
    subtitle: "Ramkali · M3",
    segments: [{ kind: "sggs", range: [39307, 39516] }],
  },
  {
    id: "rehras",
    name: "Sri Rehrass Sahib",
    subtitle: "Evening Nitnem · composite from SGGS and Sri Dasam",
    segments: [
      { kind: "sggs", range: [20473, 20476] },
      { kind: "literal", text: "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ॥" },
      { kind: "sggs", range: [21206, 21213] },
      { kind: "sggs", range: [387, 534] },
      { kind: "literal", text: "ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹ॥" },
      { kind: "literal", text: "ਪਾਤਸਾਹੀ ੧੦॥" },
      { kind: "literal", text: "ਚੌਪਈ॥" },
      { kind: "dasam", range: [67070, 67198] },
      { kind: "dasam", range: [15391, 15422] },
      { kind: "dasam", range: [3041, 3043] },
      { kind: "dasam", range: [3057, 3059] },
      { kind: "dasam", range: [2918, 2920] },
      { kind: "dasam", range: [5874, 5875] },
      { kind: "dasam", range: [9331, 9332] },
      { kind: "dasam", range: [13358, 13360] },
      { kind: "dasam", range: [13363, 13384] },
      { kind: "sggs", range: [39307, 39334] },
      { kind: "sggs", range: [39511, 39516] },
      { kind: "sggs", range: [60539, 60549] },
      { kind: "sggs", range: [41288, 41296] },
      { kind: "sggs", range: [23125, 23138] },
    ],
  },
  {
    id: "rakhiaDeShabad",
    name: "Rakhia Day Shabad",
    subtitle: "Read after Sri Rehrass Sahib",
    segments: [
      { kind: "sggs", range: [27245, 27255] },
      { kind: "sggs", range: [34984, 34990] },
      { kind: "sggs", range: [11273, 11275] },
      { kind: "sggs", range: [23210, 23212] },
    ],
  },
  {
    id: "kirtanSohila",
    name: "Sri Kirtan Sohila Sahib",
    subtitle: "Bedtime Nitnem",
    segments: [{ kind: "sggs", range: [535, 590] }],
  },
  {
    id: "sukhmani",
    name: "Sri Sukhmani Sahib Ji",
    subtitle: "Gauri · M5 · Ang 262–296",
    segments: [{ kind: "sggs", range: [11588, 13614] }],
  },
  {
    id: "aarti",
    name: "Aarti",
    subtitle: "Compiled · selected verses",
    segments: [
      { kind: "sggs", range: [28819, 28832] },
      { kind: "sggs", range: [30035, 30044] },
      { kind: "sggs", range: [30062, 30072] },
      { kind: "sggs", range: [57713, 57721] },
      { kind: "sggs", range: [30080, 30090] },
    ],
  },
  {
    id: "ramkaliKiVaar",
    name: "Ramkali Ki Vaar",
    subtitle: "Rai Balvand & Satta · Ang 966-968",
    segments: [{ kind: "sggs", range: [41523, 41612] }],
  },
  {
    id: "basantKiVaar",
    name: "Basant Ki Vaar",
    subtitle: "M5 · Ang 1193",
    segments: [{ kind: "sggs", range: [51519, 51535] }],
  },
  {
    id: "shabadHazareP10",
    name: "Shabad Hazaray Patshahi 10",
    subtitle: "Sri Dasam · Patshahi 10",
    segments: [{ kind: "dasam", range: [32756, 32842] }],
  },
  {
    id: "svaiyeDeenan",
    name: "Svaiye Deenan",
    subtitle: "Compiled · Patshahi 10",
    segments: [
      { kind: "dasam", range: [1, 1] },
      { kind: "dasam", range: [5880, 5880] },
      { kind: "dasam", range: [1770, 1810] },
    ],
  },
];

/// Builds the full Line[] for a bani from raw TSV rows, in reading order. SGGS
/// rows carry the full row (ang/arth/steek/ucharan); Dasam rows carry only
/// gurmukhi; literal segments synthesize a Line with ang=0.
function buildBaniLines(
  bani: BaniDef,
  sggsRows: string[],
  dasamRows: string[]
): Line[] {
  const out: Line[] = [];
  for (const seg of bani.segments) {
    if (seg.kind === "literal") {
      out.push({ ang: 0, gurmukhi: seg.text });
      continue;
    }
    const rows = seg.kind === "sggs" ? sggsRows : dasamRows;
    for (let n = seg.range[0]; n <= seg.range[1]; n++) {
      const raw = rows[n - 1];
      if (!raw) continue;
      const r = stripCR(raw);
      if (!r) continue;
      const cols = r.split("\t");
      if (seg.kind === "sggs") {
        if (cols.length < 9) continue;
        const ang = parseInt((cols[0] || "").trim(), 10);
        if (Number.isNaN(ang)) continue;
        out.push({
          ang,
          gurmukhi: strip(cols[2] || ""),
          steek1: strip(cols[3] || ""),
          steek2: strip(cols[4] || ""),
          ucharanTip: strip(cols[5] || ""),
          extendedUcharanTip: strip(cols[6] || ""),
          arth: strip(cols[7] || ""),
        });
      } else {
        if (cols.length < 2) continue;
        const ang = parseInt((cols[0] || "").trim(), 10);
        if (Number.isNaN(ang)) continue;
        out.push({ ang, gurmukhi: strip(cols[1] || "") });
      }
    }
  }
  return out;
}

export default function GranthReaderPage() {
  return (
    <Suspense fallback={null}>
      <GranthReader />
    </Suspense>
  );
}

function GranthReader() {
  const searchParams = useSearchParams();
  const [granth, setGranth] = useState<Granth>("sggs");
  const [sggs, setSggs] = useState<Line[] | null>(null);
  const [dasam, setDasam] = useState<Line[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [angSggs, setAngSggs] = useState(1);
  const [angDasam, setAngDasam] = useState(1);
  const [angBhaiGurdas, setAngBhaiGurdas] = useState(1);
  const [angBhaiNandlal, setAngBhaiNandlal] = useState(1);
  const [bhaiGurdas, setBhaiGurdas] = useState<Line[] | null>(null);
  const [bhaiNandlal, setBhaiNandlal] = useState<Line[] | null>(null);
  const [extraBaniCategories, setExtraBaniCategories] = useState<ExtraBaniCategory[]>([]);
  const [angInput, setAngInput] = useState("1");

  const [showArth, setShowArth] = useState(true);
  const [showSteek1, setShowSteek1] = useState(true);
  const [showSteek2, setShowSteek2] = useState(true);
  const [showUcharan, setShowUcharan] = useState(false);
  const [showExtendedUcharan, setShowExtendedUcharan] = useState(false);
  const [showRomanized, setShowRomanized] = useState(true);

  const [highlightLine, setHighlightLine] = useState<string | null>(null);
  // Reader font scale (5 steps). 0 = smallest, 2 = default, 4 = largest.
  const [fontScaleIdx, setFontScaleIdx] = useState(2);
  const fontScale = [0.875, 1.0, 1.125, 1.25, 1.4][fontScaleIdx] ?? 1.0;
  // Bani reading mode: when set, the reader shows the full bani text instead
  // of an Ang slice. Raw TSV rows are needed because banis are defined by
  // (1-based) row indices, not Ang numbers.
  const [sggsRows, setSggsRows] = useState<string[] | null>(null);
  const [dasamRows, setDasamRows] = useState<string[] | null>(null);
  const [selectedBaniId, setSelectedBaniId] = useState<string | null>(null);

  // On mount: read URL params first, fall back to localStorage. URL wins.
  useEffect(() => {
    const g = searchParams.get("g");
    const angStr = searchParams.get("ang");
    const line = searchParams.get("line");

    const validGranths: Granth[] = ["sggs", "dasam", "bhaiGurdas", "bhaiNandlal"];
    const urlGranth: Granth | null = validGranths.includes(g as Granth) ? (g as Granth) : null;
    const urlAng = angStr ? parseInt(angStr, 10) : NaN;

    if (urlGranth) {
      setGranth(urlGranth);
    } else {
      try {
        const savedG = localStorage.getItem("granth_active") as Granth | null;
        if (savedG && validGranths.includes(savedG)) setGranth(savedG);
      } catch {}
    }

    if (!Number.isNaN(urlAng) && urlAng > 0) {
      if (urlGranth === "dasam") setAngDasam(urlAng);
      else if (urlGranth === "bhaiGurdas") setAngBhaiGurdas(urlAng);
      else if (urlGranth === "bhaiNandlal") setAngBhaiNandlal(urlAng);
      else setAngSggs(urlAng);
    } else {
      try {
        const sa = localStorage.getItem("granth_sggs_ang");
        const da = localStorage.getItem("granth_dasam_ang");
        const ga = localStorage.getItem("granth_bhai_gurdas_ang");
        const na = localStorage.getItem("granth_bhai_nandlal_ang");
        if (sa) setAngSggs(Math.max(1, parseInt(sa, 10) || 1));
        if (da) setAngDasam(Math.max(1, parseInt(da, 10) || 1));
        if (ga) setAngBhaiGurdas(Math.max(1, parseInt(ga, 10) || 1));
        if (na) setAngBhaiNandlal(Math.max(1, parseInt(na, 10) || 1));
      } catch {}
    }

    if (line) setHighlightLine(line);
    else setHighlightLine(null);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sRes, dRes, bgRes, bnRes] = await Promise.all([
          fetch("/sggs.tsv"),
          fetch("/dasam.tsv"),
          fetch("/bhai_gurdas.tsv"),
          fetch("/bhai_nandlal.tsv"),
        ]);
        if (!sRes.ok || !dRes.ok) throw new Error("Failed to load Granth data.");
        const [sText, dText, bgText, bnText] = await Promise.all([
          sRes.text(),
          dRes.text(),
          bgRes.ok ? bgRes.text() : Promise.resolve(""),
          bnRes.ok ? bnRes.text() : Promise.resolve(""),
        ]);
        if (cancelled) return;
        setSggs(parseSGGS(sText));
        setDasam(parseDasam(dText));
        setSggsRows(sText.split("\n"));
        setDasamRows(dText.split("\n"));
        if (bgText) setBhaiGurdas(parseAuxiliary(bgText, 0));
        if (bnText) setBhaiNandlal(parseAuxiliary(bnText, 0));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load the 124 additional Amrit Banis (Beant Bani, Bhagat Bani, Baee Vara,
  // Beant Dasam Bani, Panj Granthi, Das Granthi, Astotar, Kavach, Ardas,
  // Gurbani Pothi) from `banis_manifest.json`. The manifest carries the
  // precomputed row segments for the existing sggs.tsv / dasam.tsv so we
  // don't need to fetch separate bani TSVs on the web.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/banis_manifest.json");
        if (!res.ok) return;
        const data: {
          categories: Array<{
            id: number;
            name: string;
            nameGurmukhi: string;
            banis: Array<{
              sectionId: number;
              name: string;
              nameGurmukhi: string;
              segments: BaniSegment[];
            }>;
          }>;
        } = await res.json();
        if (cancelled) return;
        const cats: ExtraBaniCategory[] = data.categories.map((c) => ({
          id: c.id,
          name: c.name,
          nameGurmukhi: c.nameGurmukhi,
          banis: c.banis.map((b) => ({
            id: `mfst_${c.id}_${b.sectionId}`,
            name: b.name,
            subtitle: c.name,
            segments: b.segments,
          })),
        }));
        setExtraBaniCategories(cats);
      } catch {
        // Silently degrade: built-in banis still work.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);


  const corpus =
    granth === "sggs" ? sggs :
    granth === "dasam" ? dasam :
    granth === "bhaiGurdas" ? bhaiGurdas :
    bhaiNandlal;
  const maxAng = useMemo(() => {
    if (!corpus) return 1;
    let m = 1;
    for (const line of corpus) if (line.ang > m) m = line.ang;
    return m;
  }, [corpus]);

  const ang =
    granth === "sggs" ? angSggs :
    granth === "dasam" ? angDasam :
    granth === "bhaiGurdas" ? angBhaiGurdas :
    angBhaiNandlal;
  const setAng = (n: number) => {
    const clamped = Math.max(1, Math.min(maxAng, n));
    const setters: Record<Granth, (n: number) => void> = {
      sggs: setAngSggs,
      dasam: setAngDasam,
      bhaiGurdas: setAngBhaiGurdas,
      bhaiNandlal: setAngBhaiNandlal,
    };
    setters[granth](clamped);
    try {
      localStorage.setItem(GRANTH_META[granth].angKey, String(clamped));
    } catch {}
    // Drop the highlight from a previous /search jump so we don't re-scroll
    // to that line on the new Ang.
    setHighlightLine(null);
    // Take the reader back to the top of the new Ang.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setAngInput(String(clamped));
  };

  useEffect(() => {
    setAngInput(String(ang));
  }, [ang, granth]);

  useEffect(() => {
    try {
      localStorage.setItem("granth_active", granth);
    } catch {}
  }, [granth]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("granth_font_scale_idx");
      if (saved !== null) {
        const n = parseInt(saved, 10);
        if (!Number.isNaN(n) && n >= 0 && n <= 4) setFontScaleIdx(n);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("granth_font_scale_idx", String(fontScaleIdx));
    } catch {}
  }, [fontScaleIdx]);

  // Flat lookup that includes both the hand-curated Nitnem / Sundar Gutka
  // banis and every bani loaded from `banis_manifest.json` so the reader can
  // resolve any selected bani id regardless of where it came from.
  const allBaniLookup = useMemo(() => {
    const map = new Map<string, BaniDef>();
    for (const b of BANI_LIST) map.set(b.id, b);
    for (const cat of extraBaniCategories) for (const b of cat.banis) map.set(b.id, b);
    return map;
  }, [extraBaniCategories]);

  const selectedBani = useMemo(
    () => (selectedBaniId ? allBaniLookup.get(selectedBaniId) ?? null : null),
    [selectedBaniId, allBaniLookup]
  );

  const baniLines = useMemo<Line[]>(() => {
    if (!selectedBani || !sggsRows || !dasamRows) return [];
    return buildBaniLines(selectedBani, sggsRows, dasamRows);
  }, [selectedBani, sggsRows, dasamRows]);

  const lines = useMemo(() => {
    if (selectedBani) return baniLines;
    if (!corpus) return [];
    return corpus.filter((l) => l.ang === ang);
  }, [selectedBani, baniLines, corpus, ang]);

  // Per-field availability of the currently-rendered lines. The toggle row
  // only surfaces a chip if at least one rendered line actually carries data
  // for that field — so users never click a switch that does nothing.
  const linesHave = useMemo(() => ({
    arth: lines.some((l) => (l.arth || "").length > 0),
    ucharan: lines.some((l) => (l.ucharanTip || "").length > 0),
    extendedUcharan: lines.some((l) => (l.extendedUcharanTip || "").length > 0),
    steek1: lines.some((l) => (l.steek1 || "").length > 0),
    steek2: lines.some((l) => (l.steek2 || "").length > 0),
    romanized: lines.some((l) => (l.romanized || "").length > 0),
  }), [lines]);

  const loading = sggs === null || dasam === null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Gurbani Tutor
          </Link>
          <div className="text-sm font-semibold text-amber-700">Read Gurbani</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-32 pt-10 sm:pb-28">
        <div className="lg:grid lg:grid-cols-[1fr_18rem] lg:gap-8">
          <div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Sri Guru Granth Sahib Ji & Sri Dasam Guru Granth Sahib Ji
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Read Gurbani, Ang by Ang.
          </h1>
          <p className="mt-2 max-w-3xl text-slate-700">
            Choose a Granth and an Ang, or jump straight into a Nitnem bani from the right.
            Full Gurmukhi text appears below, with optional ਅਰਥ, English steeks, and ucharan
            tips.
          </p>
        </div>

        {/* Mobile-only Nitnem picker (the desktop one lives in the right rail) */}
        <details className="mt-6 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-amber-700">
                Nitnem Banis
              </span>
              <span className="block text-xs text-slate-600">
                {selectedBani ? `Reading: ${selectedBani.name}` : "Jump to a complete bani."}
              </span>
            </span>
            <span aria-hidden className="text-slate-400">
              ▾
            </span>
          </summary>
          <ul className="mt-3 divide-y divide-slate-200">
            {BANI_LIST.map((bani) => {
              const isActive = selectedBani?.id === bani.id;
              return (
                <li key={`m-${bani.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBaniId(bani.id);
                      setHighlightLine(null);
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={loading}
                    className={`flex min-h-[44px] w-full items-center justify-between gap-2 py-2 text-left transition ${
                      isActive ? "text-amber-900" : "text-slate-800"
                    } disabled:opacity-50`}
                  >
                    <span className="block text-sm font-semibold">{bani.name}</span>
                    <span aria-hidden className={isActive ? "text-amber-700" : "text-slate-400"}>
                      {isActive ? "●" : "→"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {selectedBani && (
            <button
              type="button"
              onClick={() => {
                setSelectedBaniId(null);
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="mt-3 w-full rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-400"
            >
              ← Back to Ang reading
            </button>
          )}
        </details>

        {selectedBani && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Reading
              </p>
              <p className="text-base font-semibold text-slate-900">{selectedBani.name}</p>
              <p className="text-xs text-slate-600">{selectedBani.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedBaniId(null);
                setHighlightLine(null);
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="min-h-[40px] rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-400"
            >
              Back to Ang reading
            </button>
          </div>
        )}

        {/* Granth picker */}
        {!selectedBani && (
        <>
        <div className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(GRANTH_META) as Granth[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGranth(g)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                granth === g
                  ? "border-amber-600 bg-amber-100 text-amber-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
              }`}
            >
              {GRANTH_META[g].title}
            </button>
          ))}
        </div>

        {/* Ang controls — shown for both SGGS and Dasam at the top.
            (SGGS additionally has the fixed Sehaj Paath audio bar at the
            bottom of the page, which also exposes Ang navigation.) */}
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <button
            type="button"
            onClick={() => setAng(ang - 1)}
            disabled={loading || ang <= 1}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
          >
            ← Prev {GRANTH_META[granth].unit}
          </button>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {GRANTH_META[granth].unit}
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const n = parseInt(angInput, 10);
                if (!Number.isNaN(n)) setAng(n);
              }}
              className="mt-1 flex items-center gap-2"
            >
              <input
                value={angInput}
                onChange={(e) => setAngInput(e.target.value)}
                onBlur={() => {
                  const n = parseInt(angInput, 10);
                  if (!Number.isNaN(n)) setAng(n);
                  else setAngInput(String(ang));
                }}
                inputMode="numeric"
                disabled={loading}
                className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-base shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
              <span className="text-sm text-slate-500">of {loading ? "…" : maxAng}</span>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-40"
              >
                Go
              </button>
            </form>
          </div>
          <button
            type="button"
            onClick={() => setAng(ang + 1)}
            disabled={loading || ang >= maxAng}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
          >
            Next {GRANTH_META[granth].unit} →
          </button>
        </div>
        </>
        )}

        {/* Show toggles */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Show
          </span>
          {linesHave.arth && (
            <ToggleChip label="ਅਰਥ" on={showArth} onToggle={() => setShowArth((v) => !v)} />
          )}
          {linesHave.ucharan && (
            <ToggleChip
              label="Ucharan"
              on={showUcharan}
              onToggle={() => setShowUcharan((v) => !v)}
            />
          )}
          {linesHave.extendedUcharan && (
            <ToggleChip
              label="Extended Ucharan"
              on={showExtendedUcharan}
              onToggle={() => setShowExtendedUcharan((v) => !v)}
            />
          )}
          {linesHave.steek1 && (
            <ToggleChip
              label="English Steek 1"
              on={showSteek1}
              onToggle={() => setShowSteek1((v) => !v)}
            />
          )}
          {linesHave.steek2 && (
            <ToggleChip
              label="English Steek 2"
              on={showSteek2}
              onToggle={() => setShowSteek2((v) => !v)}
            />
          )}
          {linesHave.romanized && (
            <ToggleChip
              label="Romanized"
              on={showRomanized}
              onToggle={() => setShowRomanized((v) => !v)}
            />
          )}
          <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Size
          </span>
          <button
            type="button"
            onClick={() => setFontScaleIdx((i) => Math.max(0, i - 1))}
            disabled={fontScaleIdx === 0}
            aria-label="Decrease text size"
            className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-amber-300 disabled:opacity-40"
          >
            A−
          </button>
          <button
            type="button"
            onClick={() => setFontScaleIdx((i) => Math.min(4, i + 1))}
            disabled={fontScaleIdx === 4}
            aria-label="Increase text size"
            className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 disabled:opacity-40"
          >
            A+
          </button>
          <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />
          <GurmukhiFontToggle />
        </div>

        {/* Lines */}
        {error && (
          <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </p>
        )}
        {loading && !error && (
          <p className="mt-8 text-center text-slate-600">Loading Granth Sahib...</p>
        )}
        {!loading && !error && (
          <>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lines.length} line{lines.length === 1 ? "" : "s"} on Ang {ang}
            </p>
            <ol className="mt-3 space-y-3">
              {lines.map((l, i) => {
                const isMatch =
                  highlightLine !== null &&
                  l.gurmukhi.startsWith(highlightLine.slice(0, 30));
                return (
                <li
                  key={`${l.ang}-${i}`}
                  ref={(el) => {
                    if (isMatch && el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                  className={`rounded-2xl border p-4 shadow-sm transition ${
                    isMatch
                      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {showUcharan && l.ucharanTip && (
                    <p
                      className="mb-2 text-amber-800"
                      style={{ fontSize: `${14 * fontScale}px`, lineHeight: 1.7 }}
                    >
                      {l.ucharanTip}
                    </p>
                  )}
                  <p
                    className="text-slate-900"
                    style={{ fontSize: `${18 * fontScale}px`, lineHeight: 1.8 }}
                  >
                    {l.gurmukhi}
                  </p>
                  {showExtendedUcharan && l.extendedUcharanTip && (
                    <p
                      className="mt-2 text-amber-800"
                      style={{ fontSize: `${14 * fontScale}px`, lineHeight: 1.7 }}
                    >
                      {l.extendedUcharanTip}
                    </p>
                  )}
                  {showArth && l.arth && (
                    <p
                      className="mt-2 text-slate-800"
                      style={{ fontSize: `${14 * fontScale}px`, lineHeight: 1.7 }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        ਅਰਥ
                      </span>{" "}
                      {l.arth}
                    </p>
                  )}
                  {showSteek1 && l.steek1 && (
                    <p
                      className="mt-1 text-slate-700"
                      style={{ fontSize: `${14 * fontScale}px`, lineHeight: 1.7 }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        English Steek 1
                      </span>{" "}
                      {l.steek1}
                    </p>
                  )}
                  {showSteek2 && l.steek2 && (
                    <p
                      className="mt-1 text-slate-700"
                      style={{ fontSize: `${14 * fontScale}px`, lineHeight: 1.7 }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        English Steek 2
                      </span>{" "}
                      {l.steek2}
                    </p>
                  )}
                  {showRomanized && l.romanized && (
                    <p
                      className="mt-1 italic text-slate-600"
                      style={{ fontSize: `${13 * fontScale}px`, lineHeight: 1.7 }}
                    >
                      <span className="text-xs not-italic font-semibold uppercase tracking-wider text-amber-700">
                        Romanized
                      </span>{" "}
                      {l.romanized}
                    </p>
                  )}
                </li>
                );
              })}
            </ol>
            {lines.length === 0 && (
              <p className="mt-8 text-center text-slate-500">
                No lines found on this Ang. Try a different Ang number.
              </p>
            )}

            {/* Bottom Prev/Next shortcut. Shown for both SGGS and Dasam
                so Sangat have an Ang mover at the foot of the page in
                addition to the controls at the top. */}
            {!selectedBani && (
            <div className="mt-10 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setAng(ang - 1)}
                disabled={ang <= 1}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-400 disabled:opacity-40"
              >
                ← Prev {GRANTH_META[granth].unit}
              </button>
              <button
                type="button"
                onClick={() => setAng(ang + 1)}
                disabled={ang >= maxAng}
                className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-40"
              >
                Next {GRANTH_META[granth].unit} →
              </button>
            </div>
            )}
          </>
        )}
          </div>

          {/* Right rail: Nitnem bani picker */}
          <aside className="mt-10 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-amber-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Banis
              </p>
              <ul className="mt-3 divide-y divide-slate-200">
                {BANI_LIST.map((bani) => {
                  const isActive = selectedBani?.id === bani.id;
                  return (
                    <li key={bani.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBaniId(bani.id);
                          setHighlightLine(null);
                          if (typeof window !== "undefined") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        disabled={loading}
                        className={`flex w-full items-center justify-between gap-2 py-2 text-left transition ${
                          isActive
                            ? "text-amber-900"
                            : "text-slate-800 hover:text-amber-700"
                        } disabled:opacity-50`}
                      >
                        <span className="block text-sm font-semibold">{bani.name}</span>
                        <span
                          aria-hidden
                          className={isActive ? "text-amber-700" : "text-slate-400"}
                        >
                          {isActive ? "●" : "→"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {extraBaniCategories.length > 0 && (
                <div className="mt-4 border-t border-amber-200 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    More Amrit Banis
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Beant Bani, Bhagat Bani, Baee Vara, and more.
                  </p>
                  {extraBaniCategories.map((cat) => (
                    <details key={cat.id} className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                      <summary className="cursor-pointer list-none text-xs font-semibold text-slate-800 marker:hidden">
                        <span className="inline-flex items-center justify-between gap-2 w-full">
                          <span>{cat.name}</span>
                          <span className="text-[10px] font-medium text-slate-500">
                            {cat.banis.length} banis
                          </span>
                        </span>
                      </summary>
                      <ul className="mt-2 divide-y divide-slate-200">
                        {cat.banis.map((bani) => {
                          const isActive = selectedBani?.id === bani.id;
                          return (
                            <li key={bani.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBaniId(bani.id);
                                  setHighlightLine(null);
                                  if (typeof window !== "undefined") {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }
                                }}
                                disabled={loading}
                                className={`flex w-full items-center justify-between gap-2 py-1.5 text-left transition ${
                                  isActive
                                    ? "text-amber-900"
                                    : "text-slate-700 hover:text-amber-700"
                                } disabled:opacity-50`}
                              >
                                <span className="block text-xs font-medium">{bani.name}</span>
                                <span
                                  aria-hidden
                                  className={isActive ? "text-amber-700" : "text-slate-400"}
                                >
                                  {isActive ? "●" : "→"}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  ))}
                </div>
              )}
              {selectedBani && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBaniId(null);
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="mt-3 w-full min-h-[40px] rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-400"
                >
                  ← Back to Ang reading
                </button>
              )}
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-slate-500">
          <p>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ॥</p>
          <p className="mt-2">
            <Link href="/" className="font-medium text-amber-700 hover:underline">
              Back to home
            </Link>
            {" · "}
            <Link href="/search" className="font-medium text-amber-700 hover:underline">
              Gurbani Search
            </Link>
            {" · "}
            <Link href="/mukhvak" className="font-medium text-amber-700 hover:underline">
              Sri Mukhvak
            </Link>
          </p>
          <SocialLinks />
        </div>
      </footer>

      {/* Sehaj Paath audio bar — appears only when viewing SGGS, never in
          bani-reading mode. Persistent at the bottom while reading. */}
      <SehajPaathPlayer
        ang={ang}
        maxAng={maxAng}
        onChangeAng={setAng}
        enabled={granth === "sggs" && !selectedBani}
      />
    </div>
  );
}

function ToggleChip({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`inline-flex min-h-[36px] items-center rounded-full border px-3 py-2 text-xs font-semibold transition ${
        on
          ? "border-amber-600 bg-amber-100 text-amber-900"
          : "border-slate-200 bg-white text-slate-600 hover:border-amber-300"
      }`}
    >
      {label}
    </button>
  );
}
