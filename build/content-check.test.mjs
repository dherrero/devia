import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkContent, countWords } from './content-check.mjs';

const ref = {
  common: { brand: 'Devia' },
  home: {
    meta: { title: 'Devia', description: 'Desc' },
    hero: { title: 'Dirige agentes de IA desde una ventana', lead: 'Una sola app para tus agentes de código.', cta: 'Descargar' },
    sections: [{ id: 'a', title: 'Agentes', body: 'Trece CLIs en una ventana.' }],
  },
  docs: { faq: { items: [{ q: 'Pregunta', a: 'Respuesta' }] } },
};
const clone = (o) => JSON.parse(JSON.stringify(o));

test('a valid language file passes', () => {
  assert.deepEqual(checkContent(clone(ref), ref), []);
});

test('a hero title of nine words fails', () => {
  const l = clone(ref);
  l.home.hero.title = 'uno dos tres cuatro cinco seis siete ocho nueve';
  assert.ok(checkContent(l, ref).some((e) => e.includes('home.hero.title')));
});

test('a hero lead of thirteen words fails', () => {
  const l = clone(ref);
  l.home.hero.lead = 'uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece';
  assert.ok(checkContent(l, ref).some((e) => e.includes('home.hero.lead')));
});

test('an extra key fails', () => {
  const l = clone(ref);
  l.home.hero.extra = 'x';
  assert.ok(checkContent(l, ref).some((e) => e.includes('home.hero.extra')));
});

test('a missing key fails', () => {
  const l = clone(ref);
  delete l.home.hero.cta;
  assert.ok(checkContent(l, ref).some((e) => e.includes('home.hero.cta')));
});

test('an emoji in home fails', () => {
  const l = clone(ref);
  l.home.sections[0].title = '🤖 Agentes';
  assert.ok(checkContent(l, ref).some((e) => e.includes('emoji')));
});

test('a middle dot in home fails', () => {
  const l = clone(ref);
  l.home.sections[0].body = 'Windows · macOS · Linux';
  assert.ok(checkContent(l, ref).some((e) => e.includes('middle dot')));
});

test('more than 450 visible words in home fails', () => {
  const l = clone(ref);
  l.home.sections[0].body = Array(451).fill('palabra').join(' ');
  assert.ok(checkContent(l, ref).some((e) => e.includes('450')));
});

test('"Material 3" anywhere fails', () => {
  const l = clone(ref);
  l.docs.faq.items[0].a = '8 paletas de acento Material 3';
  assert.ok(checkContent(l, ref).some((e) => e.includes('Material 3')));
});

test('countWords ignores html tags and counts CJK by pairs of characters', () => {
  assert.equal(countWords('uno <strong>dos</strong> tres'), 3);
  assert.equal(countWords('一二三四'), 2);
});
