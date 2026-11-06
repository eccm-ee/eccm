// login.mjs: /login, the one field an editor types their key into
// (src/auth.mjs). In Estonian, and in English with ?lang=en, the language
// switch in the header carrying next across; the newsletter page's shape.
import { html } from './html.mjs';
import { page, OTHER } from './chrome.mjs';
import { field, input } from './editor.mjs';

export const T = {
  et: { title: 'Logi sisse', key: 'Võti', hint: 'Võti, mille said ECCM-ilt, kujul xxxx-xxxx-xxxx.', go: 'Logi sisse', bad: 'See võti ei kehti.', many: 'Liiga palju valesid võtmeid. Proovi tunni aja pärast uuesti.', off: 'Sisselogimine ei ole veel seadistatud.' },
  en: { title: 'Log in', key: 'Key', hint: 'The key ECCM gave you, like xxxx-xxxx-xxxx.', go: 'Log in', bad: 'That key does not work.', many: 'Too many wrong keys. Try again in an hour.', off: 'Logging in is not set up yet.' },
};

const href = (lang, next) => `/login?${new URLSearchParams({ ...(lang === 'en' ? { lang } : {}), ...(next ? { next } : {}) })}`.replace(/\?$/, '');

export const renderLogin = ({ lang, next, err }) => {
  const t = T[lang];
  const body = html`  <article class="page-text news-page">
    <h1>${t.title}</h1>
    <form class="form" method="post" action="${href(lang, next)}">
      ${field({ id: 'l-key', label: t.key, err: err && t[err], hint: t.hint, control: input('l-key', 'key', '', ' autocomplete="current-password" autocapitalize="off" spellcheck="false" required autofocus') })}
      <div class="actions"><button class="btn btn-pri" type="submit">${t.go}</button></div>
    </form>
  </article>`;
  return page({ lang, title: `${t.title}.`, alternate: { lang: OTHER[lang], href: href(OTHER[lang], next) }, body });
};
