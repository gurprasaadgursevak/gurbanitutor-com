// Mirrors the iOS app's `BaniAudio` lookup so the website and the app surface
// the same Bhagat Jaswant Singh Ji recordings for Nitnem banis. Slugs come
// from gursevakdb's `bani_sections.audio_endpoint`. Each entry is verified to
// return a real MP3 on the gursevak.com CDN.

const BASE_URL =
  "https://media.gursevak.com/media/Sundar_Gutka/32kbps_Audio_Quality";

const SLUG_BY_BANI: Record<string, string> = {
  japji: "01_Japuji_Sahib",
  jaap: "02_Jaap_Sahib",
  tvaPrasaad: "03_Tua_Prasad_Svaiye",
  chaupai: "04_Chaupai_Sahib",
  anand: "05_Anand_Sahib",
  rehras: "06_Rehras_Sahib",
  kirtanSohila: "08_Kirtan_Sohila",
  sukhmani: "15_Sukhmni_Sahib",
};

export function baniAudioURL(baniId: string): string | null {
  const slug = SLUG_BY_BANI[baniId];
  if (!slug) return null;
  return `${BASE_URL}/${encodeURIComponent(slug)}.mp3`;
}

export function baniHasAudio(baniId: string): boolean {
  return baniId in SLUG_BY_BANI;
}
