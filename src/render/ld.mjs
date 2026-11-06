// ld.mjs: schema.org JSON-LD for the head, the MusicEvent on an event page and
// the Organization on both front pages (plans/plan-eccm-migration.md, Search basics).
// The JSON sits inside a script element, so a "<" is written \u003c, which
// keeps "</script>" and "<!--" out of it, and U+2028 and U+2029 are escaped
// for the parsers that still read them as line ends.
import { raw } from './html.mjs';

export const jsonLd = (obj) => raw(`<script type="application/ld+json">${JSON.stringify(obj)
  .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')}</script>`);

const ORG_NAME = { et: 'Eesti Nüüdismuusika Keskus', en: 'Estonian Centre of Contemporary Music' };
const ADDRESS = { '@type': 'PostalAddress', streetAddress: 'Pühavaimu 9', addressLocality: 'Tallinn', addressCountry: 'EE' };

// the organiser named on every event, always under its Estonian name
export const organizer = (origin) => ({ '@type': 'Organization', name: ORG_NAME.et, url: `${origin}/` });

export const organization = (origin, lang) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORG_NAME[lang],
  alternateName: 'ECCM',
  legalName: 'MTÜ Eesti Nüüdismuusika Keskus',
  identifier: '80603988',
  url: `${origin}/`,
  logo: `${origin}/icons/icon-512.png`,
  address: ADDRESS,
  sameAs: ['https://www.instagram.com/eccm.ee/', 'https://www.facebook.com/eestinyydismuusikakeskus', 'https://fienta.com/et/o/16904'],
});
