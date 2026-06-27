/// Data module mirroring iOS `MuharniLag.swift` + `MuharniLetter`.
/// Drives the Muharni Primer Sheet UI on the web.

export type MuharniLagId =
  | "mukta" | "kanna" | "sihari" | "bihari" | "aunkar" | "dulainkar"
  | "lavan" | "dulavan" | "hora" | "kanaura" | "tippi" | "bindi";

export interface MuharniLag {
  id: MuharniLagId;
  englishName: string;
  punjabiName: string;
  /// Combining diacritic appended after a consonant base. Empty for mukta.
  matra: string;
}

export const muharniLags: MuharniLag[] = [
  { id: "mukta",     englishName: "Mukta",     punjabiName: "ਮੁਕਤਾ",   matra: "" },
  { id: "kanna",     englishName: "Kanna",     punjabiName: "ਕੰਨਾ",     matra: "ਾ" },
  { id: "sihari",    englishName: "Sihari",    punjabiName: "ਸਿਹਾਰੀ",  matra: "ਿ" },
  { id: "bihari",    englishName: "Bihari",    punjabiName: "ਬਿਹਾਰੀ",  matra: "ੀ" },
  { id: "aunkar",    englishName: "Aunkar",    punjabiName: "ਔਂਕੜ",    matra: "ੁ" },
  { id: "dulainkar", englishName: "Dulainkar", punjabiName: "ਦੁਲੈਂਕੜ", matra: "ੂ" },
  { id: "lavan",     englishName: "Lavan",     punjabiName: "ਲਾਂ",      matra: "ੇ" },
  { id: "dulavan",   englishName: "Dulavan",   punjabiName: "ਦੁਲਾਵਾਂ",  matra: "ੈ" },
  { id: "hora",      englishName: "Hora",      punjabiName: "ਹੋੜਾ",     matra: "ੋ" },
  { id: "kanaura",   englishName: "Kanaura",   punjabiName: "ਕਨੌੜਾ",   matra: "ੌ" },
  { id: "tippi",     englishName: "Tippi",     punjabiName: "ਟਿੱਪੀ",    matra: "ੰ" },
  // 12th muharni form (kanna + bindi, e.g. ਸਾਂ)
  { id: "bindi",     englishName: "Bindi",     punjabiName: "ਬਿੰਦੀ",    matra: "ਾਂ" },
];

export interface MuharniLetter {
  id: string;
  baseGlyph: string;
  punjabiName: string;
  transliteration: string;
}

/// All 35 Painti Akhari letters in traditional teaching order.
export const muharniLetters: MuharniLetter[] = [
  { id: "oora",     baseGlyph: "ੳ", punjabiName: "ਊੜਾ",   transliteration: "Oora" },
  { id: "aira",     baseGlyph: "ਅ", punjabiName: "ਐੜਾ",   transliteration: "Aira" },
  { id: "eeri",     baseGlyph: "ੲ", punjabiName: "ਈੜੀ",  transliteration: "Eeri" },
  { id: "sassa",    baseGlyph: "ਸ", punjabiName: "ਸੱਸਾ",  transliteration: "Sassa" },
  { id: "haha",     baseGlyph: "ਹ", punjabiName: "ਹਾਹਾ",  transliteration: "Haha" },
  { id: "kakka",    baseGlyph: "ਕ", punjabiName: "ਕੱਕਾ",  transliteration: "Kakka" },
  { id: "khakkha",  baseGlyph: "ਖ", punjabiName: "ਖੱਖਾ",  transliteration: "Khakkha" },
  { id: "gagga",    baseGlyph: "ਗ", punjabiName: "ਗੱਗਾ",  transliteration: "Gagga" },
  { id: "ghagga",   baseGlyph: "ਘ", punjabiName: "ਘੱਘਾ",  transliteration: "Ghagga" },
  { id: "nganga",   baseGlyph: "ਙ", punjabiName: "ਙੰਙਾ",  transliteration: "Nganga" },
  { id: "chachcha", baseGlyph: "ਚ", punjabiName: "ਚੱਚਾ",  transliteration: "Chachcha" },
  { id: "chhachha", baseGlyph: "ਛ", punjabiName: "ਛੱਛਾ",  transliteration: "Chhachha" },
  { id: "jajja",    baseGlyph: "ਜ", punjabiName: "ਜੱਜਾ",  transliteration: "Jajja" },
  { id: "jhajja",   baseGlyph: "ਝ", punjabiName: "ਝੱਜਾ",  transliteration: "Jhajja" },
  { id: "nyanya",   baseGlyph: "ਞ", punjabiName: "ਞੰਞਾ",  transliteration: "Nyanya" },
  { id: "tainka",   baseGlyph: "ਟ", punjabiName: "ਟੈਂਕਾ",  transliteration: "Tainka" },
  { id: "thatha",   baseGlyph: "ਠ", punjabiName: "ਠੱਠਾ",  transliteration: "Thaththa" },
  { id: "dada",     baseGlyph: "ਡ", punjabiName: "ਡੱਡਾ",  transliteration: "Dadda" },
  { id: "dhada",    baseGlyph: "ਢ", punjabiName: "ਢੱਡਾ",  transliteration: "Dhadda" },
  { id: "nanna",    baseGlyph: "ਣ", punjabiName: "ਣਾਣਾ",  transliteration: "Nanna" },
  { id: "tatta",    baseGlyph: "ਤ", punjabiName: "ਤੱਤਾ",  transliteration: "Tatta" },
  { id: "thaththa", baseGlyph: "ਥ", punjabiName: "ਥੱਥਾ",  transliteration: "Thatha" },
  { id: "dadda",    baseGlyph: "ਦ", punjabiName: "ਦੱਦਾ",  transliteration: "Dada" },
  { id: "dhadda",   baseGlyph: "ਧ", punjabiName: "ਧੱਦਾ",  transliteration: "Dhada" },
  { id: "nana",     baseGlyph: "ਨ", punjabiName: "ਨੱਨਾ",  transliteration: "Nana" },
  { id: "pappa",    baseGlyph: "ਪ", punjabiName: "ਪੱਪਾ",  transliteration: "Pappa" },
  { id: "phappha",  baseGlyph: "ਫ", punjabiName: "ਫੱਫਾ",  transliteration: "Phappha" },
  { id: "babba",    baseGlyph: "ਬ", punjabiName: "ਬੱਬਾ",  transliteration: "Babba" },
  { id: "bhabba",   baseGlyph: "ਭ", punjabiName: "ਭੱਬਾ",  transliteration: "Bhabba" },
  { id: "mamma",    baseGlyph: "ਮ", punjabiName: "ਮੰਮਾ",  transliteration: "Mamma" },
  { id: "yaya",     baseGlyph: "ਯ", punjabiName: "ਯਯਾ",   transliteration: "Yaya" },
  { id: "rara",     baseGlyph: "ਰ", punjabiName: "ਰਾਰਾ",  transliteration: "Rara" },
  { id: "lalla",    baseGlyph: "ਲ", punjabiName: "ਲੱਲਾ",  transliteration: "Lalla" },
  { id: "vava",     baseGlyph: "ਵ", punjabiName: "ਵਾਵਾ",  transliteration: "Vava" },
  { id: "rarra",    baseGlyph: "ੜ", punjabiName: "ੜਾੜਾ",  transliteration: "Rarra" },
];

const VOWEL_CARRIER_IDS = new Set(["oora", "aira", "eeri"]);

/// Vowel carriers (ੳ ਅ ੲ) only accept the lag that maps to a real Gurmukhi
/// form. Mirrors iOS `MuharniLag.isValid(forLetter:)`.
export function isValidCombo(lag: MuharniLagId, letterId: string): boolean {
  if (!VOWEL_CARRIER_IDS.has(letterId)) return true;
  const valid: Record<string, MuharniLagId[]> = {
    oora: ["aunkar", "dulainkar", "hora"],
    aira: ["mukta", "kanna", "dulavan", "kanaura", "tippi", "bindi"],
    eeri: ["sihari", "bihari", "lavan"],
  };
  return valid[letterId]?.includes(lag) ?? false;
}

/// Renders the Gurmukhi glyph for a letter+lag combination. Uses precomposed
/// forms for vowel carriers (e.g. ੳ + aunkar → ਉ as a single code point).
export function glyphFor(letterId: string, lag: MuharniLagId): string {
  const precomposed: Record<string, string> = {
    "oora|aunkar": "ਉ", "oora|dulainkar": "ਊ", "oora|hora": "ਓ",
    "aira|mukta": "ਅ", "aira|kanna": "ਆ", "aira|dulavan": "ਐ",
    "aira|kanaura": "ਔ", "aira|tippi": "ਅੰ", "aira|bindi": "ਆਂ",
    "eeri|sihari": "ਇ", "eeri|bihari": "ਈ", "eeri|lavan": "ਏ",
    "oora|bindi": "ਊਂ", "eeri|bindi": "ਈਂ",
  };
  const key = `${letterId}|${lag}`;
  if (key in precomposed) return precomposed[key];
  const letter = muharniLetters.find((l) => l.id === letterId);
  const lagObj = muharniLags.find((g) => g.id === lag);
  return (letter?.baseGlyph ?? "") + (lagObj?.matra ?? "");
}

/// Public URL for the per-form audio clip cut from the Muharni DVD.
export function clipUrlFor(letterId: string, lag: MuharniLagId): string {
  return `/audio/muharni/${lag}_${letterId}.mp3`;
}

/// All 10 standalone vowel forms across the three carriers (ੳ ਅ ੲ).
/// Used by the vowels primer card.
export const vowelForms: { carrierId: string; lag: MuharniLagId }[] = [
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
