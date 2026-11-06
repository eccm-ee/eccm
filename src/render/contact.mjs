// contact.mjs: the contact page (src/contact.mjs), the newsletter sign-up's
// form idiom (src/render/newsletter.mjs) with three fields, the honeypot and,
// when the Worker has the keys, the Turnstile widget. Beside the form the
// address and the phone the footer prints; on a phone they follow it.
import { html, raw } from './html.mjs';
import { page, OTHER, DESCRIPTION } from './chrome.mjs';
import { field, input } from './editor.mjs';

export const CONTACT = { et: '/et/kontakt', en: '/en/contact' };
export const PRIVACY = { et: '/et/andmekaitse', en: '/en/privacy' };
export const PRIVACY_LINE = { et: 'Kuidas me andmeid kasutame', en: 'How we use your data' };
const T = {
  et: { title: 'Kontakt', lead: 'Kirjuta meile siin, e-postiga või helista.', name: 'Nimi', email: 'E-post', message: 'Sõnum', send: 'Saada',
        phone: 'Telefon',
        done: (n) => `Aitäh, ${n}! Sõnum jõudis kohale ja vastame e-postiga.`, noscript: 'Saatmiseks lülita JavaScript sisse või kirjuta aadressile info@eccm.ee.',
        err: { name: 'Kirjuta oma nimi.', email: 'See ei ole e-posti aadress.', message: 'Kirjuta sõnum.', long: 'Sõnum on liiga pikk, kuni 5000 tähemärki.',
               robot: 'Kontroll ei õnnestunud. Proovi uuesti või kirjuta aadressile info@eccm.ee.', many: 'Tunni jooksul on siit saadetud liiga palju sõnumeid. Proovi hiljem või kirjuta aadressile info@eccm.ee.' } },
  en: { title: 'Contact', lead: 'Write to us here, by email or call.', name: 'Name', email: 'Email', message: 'Message', send: 'Send',
        phone: 'Phone',
        done: (n) => `Thank you, ${n}! Your message has arrived and we will answer by email.`, noscript: 'To send, turn on JavaScript or write to info@eccm.ee.',
        err: { name: 'Write your name.', email: 'That is not an email address.', message: 'Write a message.', long: 'The message is too long, 5000 characters at most.',
               robot: 'The check did not pass. Try again or write to info@eccm.ee.', many: 'Too many messages were sent from here in the last hour. Try later or write to info@eccm.ee.' } },
};

// done: { name } after a post; form and errors when one did not go; sitekey when Turnstile is on
export const renderContact = ({ lang, sitekey, form = {}, errors = {}, done }) => {
  const t = T[lang];
  const e = (k) => (errors[k] ? t.err[errors[k]] : undefined);
  const body = html`  <article class="page-text news-page">
    <h1>${t.title}</h1>
    <p class="note">${t.lead}</p>
    <div class="contact-wrap"><div class="contact-grid">
      ${done ? html`<p class="news-say" role="status">${t.done(done.name)}</p>` : html`<form class="form" method="post" action="${CONTACT[lang]}">
        ${errors.form ? html`<div class="errors" role="alert"><p>${t.err[errors.form]}</p></div>` : ''}
        ${field({ id: 'c-name', label: t.name, err: e('name'), control: input('c-name', 'name', form.name, ' autocomplete="name" maxlength="200" required') })}
        ${field({ id: 'c-email', label: t.email, err: e('email'), control: input('c-email', 'email', form.email, ' type="email" autocomplete="email" maxlength="200" required') })}
        ${field({ id: 'c-message', label: t.message, err: e('message'), control: html`<textarea id="c-message" name="message" rows="8" maxlength="5000" required>${form.message || ''}</textarea>` })}
        <div class="hp" aria-hidden="true"><label for="c-site">Website</label><input id="c-site" name="website" tabindex="-1" autocomplete="off"></div>
        ${sitekey ? html`<div class="cf-turnstile" data-sitekey="${sitekey}" data-language="${lang}"></div><noscript><p class="hint">${t.noscript}</p></noscript>` : ''}
        <div class="actions"><button class="btn btn-pri" type="submit">${t.send}</button></div>
        <p class="hint"><a href="${PRIVACY[lang]}">${PRIVACY_LINE[lang]}</a></p>
      </form>`}
      <div class="contact-ways">
        <p><span class="hint">${t.email}</span><br><a href="mailto:info@eccm.ee">info@eccm.ee</a></p>
        <p><span class="hint">${t.phone}</span><br><a href="tel:+3725162103">+372 516 2103</a></p>
      </div>
    </div></div>
  </article>`;
  const head = sitekey && !done ? raw('<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>') : '';
  return page({ lang, title: `${t.title}.`, alternate: { lang: OTHER[lang], href: CONTACT[OTHER[lang]] }, body, head, description: DESCRIPTION.contact[lang] });
};
