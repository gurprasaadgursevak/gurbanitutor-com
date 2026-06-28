"use client";

import { useEffect, useRef, useState } from "react";
import { muharniRows, muharniAudioURL, type MuharniRow } from "./gurmukhiData";
import {
  muharniLetters,
  muharniLags,
  isValidCombo,
  clipUrlFor,
  type MuharniLag,
  type MuharniLagId,
  type MuharniLetter,
} from "./muharniLetters";
import MuharniPrimerSheet from "./MuharniPrimerSheet";
import MuharniLagFamilyPrimerSheet from "./MuharniLagFamilyPrimerSheet";

/// Tap-to-play Muharni board. Mirrors the iOS MuharniSoundBoardView,
/// including the By Letter / By Lag toggle, the Play All loop with
/// pause/resume bookmarking, and the restart-from-top quick button.
///
/// - **By Letter** (default): 33 consonant tiles. Tapping the tile opens the
///   letter's 3×4 primer with all 12 lag forms.
/// - **By Lag**: 12 lag tiles. Tapping a lag opens a primer listing every
///   letter that has a valid form in that lag (e.g. sihari → 33 consonants
///   plus ਇ).
///
/// Play All walks the playlist in the order that matches the current
/// orientation. Tapping a tile inside a primer pauses autoplay and bookmarks
/// that tile as the next resume point.

type GroupingMode = "byLetter" | "byLag";
const GROUPING_STORAGE_KEY = "muharniGroupingMode";

interface PlayAllPair {
  letter: MuharniLetter;
  lag: MuharniLagId;
}

export default function MuharniSoundBoard() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<number | null>(null);
  const [primerLetter, setPrimerLetter] = useState<MuharniLetter | null>(null);
  const [primerVowels, setPrimerVowels] = useState(false);
  const [primerLag, setPrimerLag] = useState<MuharniLag | null>(null);

  const [groupingMode, setGroupingMode] = useState<GroupingMode>("byLetter");
  /// Read the persisted grouping mode after mount so the SSR markup matches
  /// the client (we render byLetter for the first paint).
  useEffect(() => {
    const stored = window.localStorage.getItem(GROUPING_STORAGE_KEY);
    if (stored === "byLag" || stored === "byLetter") setGroupingMode(stored);
  }, []);
  useEffect(() => {
    window.localStorage.setItem(GROUPING_STORAGE_KEY, groupingMode);
  }, [groupingMode]);

  const [playAllIndex, setPlayAllIndex] = useState<number | null>(null);
  const [playAllResumeIndex, setPlayAllResumeIndex] = useState<number | null>(null);
  /// Cached playlist; rebuilt on grouping toggle so resume bookmarks always
  /// match the visible order.
  const [playAllPairs, setPlayAllPairs] = useState<PlayAllPair[]>([]);

  /// Refs so `onEnded` and other callbacks see the latest playlist + index
  /// without re-binding the audio element each render.
  const playAllIndexRef = useRef<number | null>(null);
  const playAllPairsRef = useRef<PlayAllPair[]>([]);
  useEffect(() => {
    playAllIndexRef.current = playAllIndex;
  }, [playAllIndex]);
  useEffect(() => {
    playAllPairsRef.current = playAllPairs;
  }, [playAllPairs]);

  function stopAudio() {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setNowPlayingId(null);
  }

  function playFullChant(row: MuharniRow) {
    // Long-press path on iOS; on the web a regular tap opens the primer, so
    // this is only reached from the explicit "Play full chant" affordance
    // (long-press isn't a thing on touch screens). Keeping the helper around
    // so we can wire a future control to it cleanly.
    const el = audioRef.current;
    if (!el) return;
    el.src = muharniAudioURL(row);
    el.currentTime = 0;
    void el.play();
    setNowPlayingId(row.id);
  }

  function openPrimerForRow(row: MuharniRow) {
    if (row.transliteration.toLowerCase() === "vowels") {
      setPrimerVowels(true);
      return;
    }
    const letter = muharniLetters.find((l) => l.baseGlyph === row.consonant);
    if (letter) setPrimerLetter(letter);
  }

  function openLagPrimer(lag: MuharniLag) {
    setPrimerLag(lag);
  }

  function closeAllSheets() {
    setPrimerLetter(null);
    setPrimerVowels(false);
    setPrimerLag(null);
  }

  // ─── Play All ────────────────────────────────────────────────────────────

  function buildByLetterPlaylist(): PlayAllPair[] {
    const pairs: PlayAllPair[] = [];
    // Standalone vowel forms first.
    const vowelOrder: { carrierId: string; lag: MuharniLagId }[] = [
      { carrierId: "oora", lag: "aunkar" },
      { carrierId: "oora", lag: "dulainkar" },
      { carrierId: "oora", lag: "hora" },
      { carrierId: "aira", lag: "mukta" },
      { carrierId: "aira", lag: "kanna" },
      { carrierId: "aira", lag: "dulavan" },
      { carrierId: "aira", lag: "kanaura" },
      { carrierId: "eeri", lag: "sihari" },
      { carrierId: "eeri", lag: "bihari" },
      { carrierId: "eeri", lag: "lavan" },
    ];
    for (const v of vowelOrder) {
      const carrier = muharniLetters.find((l) => l.id === v.carrierId);
      if (carrier) pairs.push({ letter: carrier, lag: v.lag });
    }
    // Then each consonant tile in board order with all 12 valid lag forms.
    for (const row of muharniRows) {
      if (row.transliteration.toLowerCase() === "vowels") continue;
      const letter = muharniLetters.find((l) => l.baseGlyph === row.consonant);
      if (!letter) continue;
      for (const lag of muharniLags) {
        if (isValidCombo(lag.id, letter.id)) pairs.push({ letter, lag: lag.id });
      }
    }
    return pairs;
  }

  function buildByLagPlaylist(): PlayAllPair[] {
    const pairs: PlayAllPair[] = [];
    for (const lag of muharniLags) {
      for (const letter of muharniLetters) {
        if (isValidCombo(lag.id, letter.id)) pairs.push({ letter, lag: lag.id });
      }
    }
    return pairs;
  }

  function buildPlaylist(): PlayAllPair[] {
    return groupingMode === "byLetter"
      ? buildByLetterPlaylist()
      : buildByLagPlaylist();
  }

  function playPair(pair: PlayAllPair) {
    const el = audioRef.current;
    if (!el) {
      advancePlayAll();
      return;
    }
    el.src = clipUrlFor(pair.letter.id, pair.lag);
    el.currentTime = 0;
    void el.play();

    const isVowelCarrier = ["oora", "aira", "eeri"].includes(pair.letter.id);
    if (groupingMode === "byLetter") {
      if (isVowelCarrier) {
        setPrimerLetter(null);
        setPrimerLag(null);
        setPrimerVowels(true);
      } else {
        setPrimerVowels(false);
        setPrimerLag(null);
        if (primerLetter?.id !== pair.letter.id) setPrimerLetter(pair.letter);
      }
    } else {
      setPrimerLetter(null);
      setPrimerVowels(false);
      const lagObj = muharniLags.find((l) => l.id === pair.lag) ?? null;
      if (primerLag?.id !== lagObj?.id) setPrimerLag(lagObj);
    }
    // Highlight the main-board consonant tile too so the user can follow
    // along briefly between sheet transitions.
    const row = muharniRows.find((r) => r.consonant === pair.letter.baseGlyph);
    if (row) setNowPlayingId(row.id);
  }

  function advancePlayAll() {
    const idx = playAllIndexRef.current;
    const pairs = playAllPairsRef.current;
    if (idx === null) return;
    const next = idx + 1;
    if (next < pairs.length) {
      setPlayAllIndex(next);
      playPair(pairs[next]);
    } else {
      setPlayAllIndex(null);
      closeAllSheets();
    }
  }

  function togglePlayAll() {
    if (playAllIndex !== null) {
      // Pause — keep the current position as the resume point.
      setPlayAllResumeIndex(playAllIndex);
      setPlayAllIndex(null);
      stopAudio();
    } else {
      let pairs = playAllPairs;
      if (pairs.length === 0) {
        pairs = buildPlaylist();
        setPlayAllPairs(pairs);
        playAllPairsRef.current = pairs;
      }
      if (pairs.length === 0) return;
      const startIdx = playAllResumeIndex ?? 0;
      setPlayAllResumeIndex(null);
      setPlayAllIndex(startIdx);
      playPair(pairs[startIdx]);
    }
  }

  function restartPlayAll() {
    let pairs = playAllPairs;
    if (pairs.length === 0) {
      pairs = buildPlaylist();
      setPlayAllPairs(pairs);
      playAllPairsRef.current = pairs;
    }
    if (pairs.length === 0) return;
    setPlayAllResumeIndex(null);
    setPlayAllIndex(0);
    playPair(pairs[0]);
  }

  function stopPlayAll() {
    if (playAllIndex === null) return;
    setPlayAllIndex(null);
    setPlayAllResumeIndex(null);
    setNowPlayingId(null);
    stopAudio();
  }

  /// Mode toggle resets autoplay so the bookmark/playlist match the
  /// orientation the user is now looking at.
  function handleModeChange(next: GroupingMode) {
    stopPlayAll();
    setPlayAllPairs([]);
    playAllPairsRef.current = [];
    setGroupingMode(next);
  }

  /// Manual tap from inside a primer sheet — pause autoplay and bookmark.
  function handleManualTap(letter: MuharniLetter, lag: MuharniLagId) {
    stopAudio();
    setPlayAllIndex(null);
    setNowPlayingId(null);
    let pairs = playAllPairs;
    if (pairs.length === 0) {
      pairs = buildPlaylist();
      setPlayAllPairs(pairs);
      playAllPairsRef.current = pairs;
    }
    const idx = pairs.findIndex(
      (p) => p.letter.id === letter.id && p.lag === lag,
    );
    if (idx >= 0) setPlayAllResumeIndex(idx);
  }

  useEffect(() => {
    return () => {
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = playAllIndex !== null;
  const playAllState = {
    isActive: active,
    label: active ? "Pause" : "Play",
  };
  const currentPair =
    playAllIndex !== null && playAllIndex < playAllPairs.length
      ? playAllPairs[playAllIndex]
      : null;

  // Highlight keys for sheets while Play All is active.
  const externalHighlightKey =
    currentPair && primerLetter && currentPair.letter.id === primerLetter.id
      ? `${currentPair.lag}_${currentPair.letter.id}`
      : null;
  const externalVowelHighlightKey =
    currentPair && primerVowels && ["oora", "aira", "eeri"].includes(currentPair.letter.id)
      ? `${currentPair.lag}_${currentPair.letter.id}`
      : null;
  const externalLagLetterId =
    currentPair && primerLag && currentPair.lag === primerLag.id
      ? currentPair.letter.id
      : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-amber-800">Muharni</h1>
      <p className="mt-2 text-center text-sm text-amber-900/80">
        Tap any tile to open its primer card and play each lag form individually.
        Use the Play / Pause control to walk through every form automatically.
        Repeat each letter 25 times before your first class.
      </p>

      {/* Grouping toggle */}
      <div className="mt-4 flex justify-center">
        <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 p-1 text-sm font-semibold">
          {(["byLetter", "byLag"] as const).map((mode) => {
            const selected = groupingMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => handleModeChange(mode)}
                className={[
                  "rounded-full px-4 py-1.5 transition",
                  selected
                    ? "bg-amber-600 text-white shadow"
                    : "text-amber-800 hover:bg-amber-100",
                ].join(" ")}
              >
                {mode === "byLetter" ? "By Letter" : "By Lag"}
              </button>
            );
          })}
        </div>
      </div>

      {groupingMode === "byLetter" ? (
        <LetterGrid
          nowPlayingId={nowPlayingId}
          onTapTile={(row) => openPrimerForRow(row)}
          onLongPress={(row) => playFullChant(row)}
        />
      ) : (
        <LagGrid
          highlightedLagId={currentPair?.lag ?? null}
          onTapTile={(lag) => openLagPrimer(lag)}
        />
      )}

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={togglePlayAll}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
        >
          <span aria-hidden>{active ? "❚❚" : "▶"}</span>
          {active ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={restartPlayAll}
          aria-label="Restart from the beginning"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
        >
          <span aria-hidden>⏮</span>
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-amber-900/60">
        Per-form primer audio cut from a Muharni DVD. Full-chant audio courtesy
        of Learn Shudh Gurbani by gursevak.com.
      </p>

      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => {
          setNowPlayingId(null);
          advancePlayAll();
        }}
      />

      <MuharniPrimerSheet
        letter={primerLetter}
        vowels={primerVowels}
        externalHighlightKey={primerVowels ? externalVowelHighlightKey : externalHighlightKey}
        onTapTile={(letterId, lagId) => {
          const letter = muharniLetters.find((l) => l.id === letterId);
          if (letter) handleManualTap(letter, lagId);
        }}
        playAllState={playAllState}
        onTogglePlayAll={togglePlayAll}
        onRestartPlayAll={restartPlayAll}
        onDone={() => stopPlayAll()}
        onClose={() => {
          setPrimerLetter(null);
          setPrimerVowels(false);
        }}
      />

      <MuharniLagFamilyPrimerSheet
        lag={primerLag}
        externalHighlightLetterId={externalLagLetterId}
        onTapTile={(letter) => {
          if (primerLag) handleManualTap(letter, primerLag.id);
        }}
        playAllState={playAllState}
        onTogglePlayAll={togglePlayAll}
        onRestartPlayAll={restartPlayAll}
        onDone={() => stopPlayAll()}
        onClose={() => setPrimerLag(null)}
      />
    </div>
  );
}

function LetterGrid({
  nowPlayingId,
  onTapTile,
  onLongPress,
}: {
  nowPlayingId: number | null;
  onTapTile: (row: MuharniRow) => void;
  onLongPress: (row: MuharniRow) => void;
}) {
  return (
    <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
      {muharniRows.map((row) => {
        const playing = nowPlayingId === row.id;
        return (
          <button
            key={row.id}
            type="button"
            onClick={() => onTapTile(row)}
            onContextMenu={(e) => {
              e.preventDefault();
              onLongPress(row);
            }}
            className={[
              "flex aspect-square w-full flex-col items-center justify-center rounded-xl border transition",
              playing
                ? "border-amber-400 bg-amber-500 text-white shadow"
                : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
            ].join(" ")}
          >
            <span className="text-xl font-bold leading-none sm:text-2xl">
              {row.consonant}
            </span>
            <span className="mt-1 text-[10px] leading-tight opacity-80 sm:text-xs">
              {row.name}
            </span>
            <span className="text-[10px] font-medium opacity-70 sm:text-xs">
              {row.transliteration}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function LagGrid({
  highlightedLagId,
  onTapTile,
}: {
  highlightedLagId: MuharniLagId | null;
  onTapTile: (lag: MuharniLag) => void;
}) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
      {muharniLags.map((lag) => {
        const playing = highlightedLagId === lag.id;
        return (
          <button
            key={lag.id}
            type="button"
            onClick={() => onTapTile(lag)}
            className={[
              "flex aspect-square w-full flex-col items-center justify-center rounded-2xl border p-2 transition",
              playing
                ? "border-amber-400 bg-amber-500 text-white shadow"
                : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
            ].join(" ")}
          >
            <span className="text-lg font-bold leading-tight sm:text-xl">
              {lag.punjabiName}
            </span>
            <span className="mt-1 text-[11px] font-medium opacity-80 sm:text-xs">
              {lag.englishName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
