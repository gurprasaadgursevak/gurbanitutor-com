// Stable identifier for a shabad regardless of which TSV variant it came from
// (cleaned vs full). We normalize the Gurmukhi to letters/matras only
// (stripping punctuation, whitespace, leading "(੧੨੩੪)" and "ਵਾਹਿਗੁਰੂ॥" tails)
// and run a 32-bit FNV-1a hash, then base36-encode the result. Same shabad in
// either TSV will produce the same id.
export function shabadHash(gurmukhi: string): string {
  let stripped = gurmukhi
    .normalize("NFC")
    .replace(/[^਀-੿ੴ]/g, "");
  // Strip any combination of leading Gurmukhi-digit Ang refs (੧੪੨੦) and a
  // leading "ਵਾਹਿਗੁਰੂ" salutation, repeatedly. The cleaned TSV strips these
  // already; the full TSV keeps them. Stripping both here makes the hash
  // identical between the two variants.
  let prev = "";
  while (stripped !== prev) {
    prev = stripped;
    stripped = stripped.replace(/^[੦-੯]+/, "");
    stripped = stripped.replace(/^ਵਾਹਿਗੁਰੂ/, "");
  }
  let h = 2166136261;
  for (let i = 0; i < stripped.length; i++) {
    h ^= stripped.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
