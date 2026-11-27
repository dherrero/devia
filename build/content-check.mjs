// Content checks for build/i18n/*.json: key parity with es.json and the
// Hallmark limits for the home page. Run: npm run check:content
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERO_TITLE_MAX_WORDS = 7;
const HERO_TITLE_MAX_CHARS = 50;
const HERO_LEAD_MAX_WORDS = 12;
const HOME_MAX_WORDS = 450;

const stripTags = (s) => s.replace(/<[^>]*>/g, ' ');
const CJK = /[぀-ヿ㐀-鿿]/g;

/** Words in a string: html removed; CJK text counts one word per two characters. */
export function countWords(text) {
  const plain = stripTags(String(text));
  const cjk = (plain.match(CJK) || []).length;
  const rest = plain.replace(CJK, ' ').split(/\s+/).filter(Boolean).length;
  return rest + Math.ceil(cjk / 2);
}

/** Flat map of `a.b.0.c` -> string for every leaf. */
function flatten(value, path = '', out = {}) {
  if (typeof value === 'string') out[path] = value;
  else if (Array.isArray(value)) value.forEach((v, i) => flatten(v, path ? `${path}.${i}` : `${i}`, out));
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) flatten(v, path ? `${path}.${k}` : k, out);
  return out;
}

/** Missing and extra keys of `lang` against the reference `ref` (es.json). */
export function schemaErrors(lang, ref) {
  const errors = [];
  const a = flatten(lang);
  const r = flatten(ref);
  for (const key of Object.keys(r)) if (!(key in a)) errors.push(`missing key ${key}`);
  for (const key of Object.keys(a)) if (!(key in r)) errors.push(`extra key ${key}`);
  return errors;
}

/** Returns the list of problems of `lang` against the reference `ref` (es.json). */
export function checkContent(lang, ref) {
  const errors = schemaErrors(lang, ref);
  const a = flatten(lang);

  const title = a['home.hero.title'];
  if (title !== undefined) {
    if (countWords(title) > HERO_TITLE_MAX_WORDS) errors.push(`home.hero.title has more than ${HERO_TITLE_MAX_WORDS} words`);
    if (stripTags(title).trim().length > HERO_TITLE_MAX_CHARS) errors.push(`home.hero.title has more than ${HERO_TITLE_MAX_CHARS} characters`);
  }
  const lead = a['home.hero.lead'];
  if (lead !== undefined && countWords(lead) > HERO_LEAD_MAX_WORDS)
    errors.push(`home.hero.lead has more than ${HERO_LEAD_MAX_WORDS} words`);

  const visible = Object.entries(a).filter(([k]) => k.startsWith('home.') && !k.startsWith('home.meta.'));
  const total = visible.reduce((n, [, v]) => n + countWords(v), 0);
  if (total > HOME_MAX_WORDS) errors.push(`home has ${total} visible words, the limit is ${HOME_MAX_WORDS}`);

  for (const [k, v] of visible) {
    if (/\p{Extended_Pictographic}/u.test(v)) errors.push(`emoji in ${k}`);
    if (v.includes('·')) errors.push(`middle dot in ${k}`);
    if (/->|[→↗]/.test(v)) errors.push(`arrow in ${k}`);
  }

  for (const [k, v] of Object.entries(a))
    if (/Material 3|8 paletas|eight accent/i.test(v)) errors.push(`Material 3 palette claim in ${k}`);

  return errors;
}

// CLI: node build/content-check.mjs [lang ...]
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), 'i18n');
  const ref = JSON.parse(readFileSync(join(dir, 'es.json'), 'utf8'));
  const wanted = process.argv.slice(2);
  const files = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  let failed = false;
  for (const code of files.filter((c) => wanted.length === 0 || wanted.includes(c))) {
    const errors = checkContent(JSON.parse(readFileSync(join(dir, `${code}.json`), 'utf8')), ref);
    if (errors.length) {
      failed = true;
      console.error(`${code}.json: ${errors.length} problem(s)`);
      for (const e of errors) console.error(`  - ${e}`);
    }
  }
  if (failed) process.exit(1);
  console.log('content ok');
}
