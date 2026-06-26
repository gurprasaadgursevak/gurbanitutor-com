// Shared catalogue of Nitnem + Sundar Gutka banis used as drill-down filters
// in Punctuation Master and Sentence Unscramble. Mirrors
// `BaniFilterCatalogue.swift` on iOS.

import type { Source } from "./gamesData";

export type BaniCategory = "Nitnem" | "Sundar Gutka";

export type BaniFilter = {
  id: string;
  label: string;
  category: BaniCategory;
  granth: Source;
  /** SGGS ang range (inclusive). Only meaningful when granth === SGGS Ji. */
  angRange: [number, number] | null;
  /** Matches a `bani` value in `baniBank`, when one exists. */
  curatedBaniName: string | null;
};

export const BANI_FILTERS: BaniFilter[] = [
  // ── Nitnem ──────────────────────────────────────────────────────────────
  { id: "japji",         label: "Sri Japji Sahib",         category: "Nitnem",      granth: "Sri Guru Granth Sahib Ji", angRange: [1, 8],         curatedBaniName: "Japji Sahib" },
  { id: "jaap",          label: "Sri Jaap Sahib",          category: "Nitnem",      granth: "Dasam Granth Sahib Ji",    angRange: null,           curatedBaniName: "Jaap Sahib" },
  { id: "tva-prasaad",   label: "Sri Tva Prasaad Swaiye",  category: "Nitnem",      granth: "Dasam Granth Sahib Ji",    angRange: null,           curatedBaniName: "Tva Prasad Svaiye" },
  { id: "chaupai",       label: "Sri Chaupai Sahib",       category: "Nitnem",      granth: "Dasam Granth Sahib Ji",    angRange: null,           curatedBaniName: "Chaupai Sahib" },
  { id: "anand",         label: "Sri Anand Sahib",         category: "Nitnem",      granth: "Sri Guru Granth Sahib Ji", angRange: [917, 922],     curatedBaniName: "Anand Sahib" },
  { id: "rehrass",       label: "Sri Rehrass Sahib",       category: "Nitnem",      granth: "Sri Guru Granth Sahib Ji", angRange: [8, 12],        curatedBaniName: "Rehras Sahib" },
  { id: "kirtan-sohila", label: "Sri Kirtan Sohila Sahib", category: "Nitnem",      granth: "Sri Guru Granth Sahib Ji", angRange: [12, 13],       curatedBaniName: "Kirtan Sohila" },

  // ── Sundar Gutka ────────────────────────────────────────────────────────
  { id: "bara-maha-manjh",   label: "Sri Bara Maha Manjh",   category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [133, 136],   curatedBaniName: null },
  { id: "bawan-akhri",       label: "Sri Bawan Akhri",       category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [250, 262],   curatedBaniName: "Bavan Akhri" },
  { id: "sukhmani",          label: "Sri Sukhmani Sahib",    category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [262, 296],   curatedBaniName: "Sukhmani Sahib" },
  { id: "aasa-ki-vaar",      label: "Aasa Ki Vaar",          category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [462, 475],   curatedBaniName: "Asa Di Vaar" },
  { id: "aarti",             label: "Aarti",                 category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [663, 663],   curatedBaniName: "Aarti" },
  { id: "lavaan",            label: "Lavaan (Anand Karaj)",  category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [773, 774],   curatedBaniName: null },
  { id: "ramkali-sadu",      label: "Ramkali Sadu",          category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [923, 924],   curatedBaniName: null },
  { id: "dakhni-onkar",      label: "Dakhni Onkar",          category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [929, 938],   curatedBaniName: null },
  { id: "sidh-gosht",        label: "Sidh Gosht",            category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [938, 946],   curatedBaniName: null },
  { id: "bara-maha-tukhari", label: "Sri Bara Maha Tukhari", category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1107, 1110], curatedBaniName: null },
  { id: "basant-ki-vaar",    label: "Basant Ki Vaar",        category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1193, 1193], curatedBaniName: null },
  { id: "gatha-m5",          label: "Gatha Mahalla 5",       category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1360, 1361], curatedBaniName: null },
  { id: "phunhe-m5",         label: "Phunhe Mahalla 5",      category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1361, 1363], curatedBaniName: null },
  { id: "chaubole-m5",       label: "Chaubole Mahalla 5",    category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1363, 1364], curatedBaniName: null },
  { id: "salok-kabir",       label: "Salok Bhagat Kabir Ji", category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1364, 1377], curatedBaniName: "Salok Bhagat Kabir" },
  { id: "salok-farid",       label: "Salok Bhagat Farid Ji", category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1377, 1384], curatedBaniName: "Salok Bhagat Farid" },
  { id: "salok-m9",          label: "Salok Mahalla 9",       category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1426, 1429], curatedBaniName: null },
  { id: "ragmala",           label: "Ragmala",               category: "Sundar Gutka", granth: "Sri Guru Granth Sahib Ji", angRange: [1429, 1430], curatedBaniName: null },
];

export const BANI_CATEGORIES: BaniCategory[] = ["Nitnem", "Sundar Gutka"];

export function findBani(id: string | null): BaniFilter | null {
  if (!id) return null;
  return BANI_FILTERS.find((b) => b.id === id) ?? null;
}

export function inAngRange(ang: number, range: [number, number] | null): boolean {
  if (!range) return false;
  return ang >= range[0] && ang <= range[1];
}
