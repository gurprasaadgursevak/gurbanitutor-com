// Shared data for the Painti Akhari and Muharni sound boards plus the
// Letter Quiz game. Mirrors the iOS app's GurmukhiSoundBoard.swift and
// MuharniSoundBoard.swift.

export type PentiAkharCell = {
  id: number;
  letter: string;
  name: string;
  transliteration: string;
  audioSlug: string;
  /** Optional cap (in seconds) for "tap once" play; mirrors the iOS overrides. */
  playbackSeconds?: number;
};

export type MuharniRow = {
  id: number;
  consonant: string;
  name: string;
  transliteration: string;
  audioSlug: string;
};

const CDN_BASE =
  "https://media.gursevak.com/media/Muharni and importance/Varanmala";

export function letterAudioURL(cell: PentiAkharCell): string {
  return `${CDN_BASE}/${encodeURIComponent(`v-${cell.audioSlug}`)}.mp3`;
}

export function muharniAudioURL(row: MuharniRow): string {
  return `${CDN_BASE}/${encodeURIComponent(`m-${row.audioSlug}`)}.mp3`;
}

/** Default cap for "tap once" letter playback. The source file is a long
 *  teacher lesson; this caps each tap at one utterance. */
export const DEFAULT_LETTER_CAP_SECONDS = 1.5;

export const pentiAkhar: PentiAkharCell[] = [
  { id: 1,  letter: "ੳ",  name: "ਊੜਾ",   transliteration: "Oora",     audioSlug: "ੳ", playbackSeconds: 1.9 },
  { id: 2,  letter: "ਅ",  name: "ਐੜਾ",   transliteration: "Aira",     audioSlug: "ਅ" },
  { id: 3,  letter: "ੲ",  name: "ਈੜੀ",   transliteration: "Eeri",     audioSlug: "ੲ" },
  { id: 4,  letter: "ਸ",  name: "ਸੱਸਾ",  transliteration: "Sassa",    audioSlug: "ਸ" },
  { id: 5,  letter: "ਹ",  name: "ਹਾਹਾ",  transliteration: "Haha",     audioSlug: "ਹ" },
  { id: 6,  letter: "ਕ",  name: "ਕੱਕਾ",  transliteration: "Kakka",    audioSlug: "ਕ" },
  { id: 7,  letter: "ਖ",  name: "ਖੱਖਾ",  transliteration: "Khakkha",  audioSlug: "ਖ" },
  { id: 8,  letter: "ਗ",  name: "ਗੱਗਾ",  transliteration: "Gagga",    audioSlug: "ਗ" },
  { id: 9,  letter: "ਘ",  name: "ਘੱਘਾ",  transliteration: "Ghagga",   audioSlug: "ਘ" },
  { id: 10, letter: "ਙ",  name: "ਙੰਙਾ",  transliteration: "Nganga",   audioSlug: "ਙ" },
  { id: 11, letter: "ਚ",  name: "ਚੱਚਾ",  transliteration: "Chachcha", audioSlug: "ਚ" },
  { id: 12, letter: "ਛ",  name: "ਛੱਛਾ",  transliteration: "Chhachha", audioSlug: "ਛ" },
  { id: 13, letter: "ਜ",  name: "ਜੱਜਾ",  transliteration: "Jajja",    audioSlug: "ਜ" },
  { id: 14, letter: "ਝ",  name: "ਝੱਜਾ",  transliteration: "Jhajja",   audioSlug: "ਝ" },
  { id: 15, letter: "ਞ",  name: "ਞੰਞਾ",  transliteration: "Nyanya",   audioSlug: "ਞ" },
  { id: 16, letter: "ਟ",  name: "ਟੈਂਕਾ",  transliteration: "Tainka",   audioSlug: "ਟ" },
  { id: 17, letter: "ਠ",  name: "ਠੱਠਾ",  transliteration: "Thaththa", audioSlug: "ਠ" },
  { id: 18, letter: "ਡ",  name: "ਡੱਡਾ",  transliteration: "Dadda",    audioSlug: "ਡ" },
  { id: 19, letter: "ਢ",  name: "ਢੱਡਾ",  transliteration: "Dhadda",   audioSlug: "ਢ" },
  { id: 20, letter: "ਣ",  name: "ਣਾਣਾ",  transliteration: "Nanna",    audioSlug: "ਣ" },
  { id: 21, letter: "ਤ",  name: "ਤੱਤਾ",  transliteration: "Tatta",    audioSlug: "ਤ" },
  { id: 22, letter: "ਥ",  name: "ਥੱਥਾ",  transliteration: "Thatha",   audioSlug: "ਥ" },
  { id: 23, letter: "ਦ",  name: "ਦੱਦਾ",  transliteration: "Dada",     audioSlug: "ਦ" },
  { id: 24, letter: "ਧ",  name: "ਧੱਦਾ",  transliteration: "Dhada",    audioSlug: "ਧ" },
  { id: 25, letter: "ਨ",  name: "ਨੱਨਾ",  transliteration: "Nana",     audioSlug: "ਨ" },
  { id: 26, letter: "ਪ",  name: "ਪੱਪਾ",  transliteration: "Pappa",    audioSlug: "ਪ" },
  { id: 27, letter: "ਫ",  name: "ਫੱਫਾ",  transliteration: "Phappha",  audioSlug: "ਫ" },
  { id: 28, letter: "ਬ",  name: "ਬੱਬਾ",  transliteration: "Babba",    audioSlug: "ਬ" },
  { id: 29, letter: "ਭ",  name: "ਭੱਬਾ",  transliteration: "Bhabba",   audioSlug: "ਭ" },
  { id: 30, letter: "ਮ",  name: "ਮੰਮਾ",  transliteration: "Mamma",    audioSlug: "ਮ", playbackSeconds: 1.2 },
  { id: 31, letter: "ਯ",  name: "ਯਯਾ",  transliteration: "Yaya",     audioSlug: "ਯ" },
  { id: 32, letter: "ਰ",  name: "ਰਾਰਾ",  transliteration: "Rara",     audioSlug: "ਰ" },
  { id: 33, letter: "ਲ",  name: "ਲੱਲਾ",  transliteration: "Lalla",    audioSlug: "ਲ" },
  { id: 34, letter: "ਵ",  name: "ਵਾਵਾ",  transliteration: "Vava",     audioSlug: "ਵ" },
  { id: 35, letter: "ੜ",  name: "ੜਾੜਾ",  transliteration: "Rarra",    audioSlug: "ੜ" }
];

export const muharniRows: MuharniRow[] = [
  { id: 1,  consonant: "ੳ ਅ ੲ", name: "ਸਵਰ ਅੱਖਰ", transliteration: "Vowels", audioSlug: "ਅ" },
  { id: 2,  consonant: "ਸ",  name: "ਸੱਸਾ",  transliteration: "Sassa",    audioSlug: "ਸ" },
  { id: 3,  consonant: "ਹ",  name: "ਹਾਹਾ",  transliteration: "Haha",     audioSlug: "ਹ" },
  { id: 4,  consonant: "ਕ",  name: "ਕੱਕਾ",  transliteration: "Kakka",    audioSlug: "ਕ" },
  { id: 5,  consonant: "ਖ",  name: "ਖੱਖਾ",  transliteration: "Khakkha",  audioSlug: "ਖ" },
  { id: 6,  consonant: "ਗ",  name: "ਗੱਗਾ",  transliteration: "Gagga",    audioSlug: "ਗ" },
  { id: 7,  consonant: "ਘ",  name: "ਘੱਘਾ",  transliteration: "Ghagga",   audioSlug: "ਘ" },
  { id: 8,  consonant: "ਙ",  name: "ਙੰਙਾ",  transliteration: "Nganga",   audioSlug: "ਙ" },
  { id: 9,  consonant: "ਚ",  name: "ਚੱਚਾ",  transliteration: "Chachcha", audioSlug: "ਚ" },
  { id: 10, consonant: "ਛ",  name: "ਛੱਛਾ",  transliteration: "Chhachha", audioSlug: "ਛ" },
  { id: 11, consonant: "ਜ",  name: "ਜੱਜਾ",  transliteration: "Jajja",    audioSlug: "ਜ" },
  { id: 12, consonant: "ਝ",  name: "ਝੱਜਾ",  transliteration: "Jhajja",   audioSlug: "ਝ" },
  { id: 13, consonant: "ਞ",  name: "ਞੰਞਾ",  transliteration: "Nyanya",   audioSlug: "ਞ" },
  { id: 14, consonant: "ਟ",  name: "ਟੈਂਕਾ",  transliteration: "Tainka",   audioSlug: "ਟ" },
  { id: 15, consonant: "ਠ",  name: "ਠੱਠਾ",  transliteration: "Thaththa", audioSlug: "ਠ" },
  { id: 16, consonant: "ਡ",  name: "ਡੱਡਾ",  transliteration: "Dadda",    audioSlug: "ਡ" },
  { id: 17, consonant: "ਢ",  name: "ਢੱਡਾ",  transliteration: "Dhadda",   audioSlug: "ਢ" },
  { id: 18, consonant: "ਣ",  name: "ਣਾਣਾ",  transliteration: "Nanna",    audioSlug: "ਣ" },
  { id: 19, consonant: "ਤ",  name: "ਤੱਤਾ",  transliteration: "Tatta",    audioSlug: "ਤ" },
  { id: 20, consonant: "ਥ",  name: "ਥੱਥਾ",  transliteration: "Thatha",   audioSlug: "ਥ" },
  { id: 21, consonant: "ਦ",  name: "ਦੱਦਾ",  transliteration: "Dada",     audioSlug: "ਦ" },
  { id: 22, consonant: "ਧ",  name: "ਧੱਦਾ",  transliteration: "Dhada",    audioSlug: "ਧ" },
  { id: 23, consonant: "ਨ",  name: "ਨੱਨਾ",  transliteration: "Nana",     audioSlug: "ਨ" },
  { id: 24, consonant: "ਪ",  name: "ਪੱਪਾ",  transliteration: "Pappa",    audioSlug: "ਪ" },
  { id: 25, consonant: "ਫ",  name: "ਫੱਫਾ",  transliteration: "Phappha",  audioSlug: "ਫ" },
  { id: 26, consonant: "ਬ",  name: "ਬੱਬਾ",  transliteration: "Babba",    audioSlug: "ਬ" },
  { id: 27, consonant: "ਭ",  name: "ਭੱਬਾ",  transliteration: "Bhabba",   audioSlug: "ਭ" },
  { id: 28, consonant: "ਮ",  name: "ਮੰਮਾ",  transliteration: "Mamma",    audioSlug: "ਮ" },
  { id: 29, consonant: "ਯ",  name: "ਯਯਾ",  transliteration: "Yaya",     audioSlug: "ਯ" },
  { id: 30, consonant: "ਰ",  name: "ਰਾਰਾ",  transliteration: "Rara",     audioSlug: "ਰ" },
  { id: 31, consonant: "ਲ",  name: "ਲੱਲਾ",  transliteration: "Lalla",    audioSlug: "ਲ" },
  { id: 32, consonant: "ਵ",  name: "ਵਾਵਾ",  transliteration: "Vava",     audioSlug: "ਵ" },
  { id: 33, consonant: "ੜ",  name: "ੜਾੜਾ",  transliteration: "Rarra",    audioSlug: "ੜ" }
];
