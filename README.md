# eccm

The site for eccm.ee, the Estonian Centre of Contemporary Music, while it is
being built. Live at https://eccm.positron.studio/ on a staging hostname; the
production name is `eccm.ee`, on ECCM's own Cloudflare account, at cutover.

Today it is six static pages under `public/`, a stylesheet, self-hosted fonts
and the pictures eccm.ee serves. The CMS the plans describe comes next.

```sh
npm install
npx wrangler dev --env staging                                   # http://127.0.0.1:8787/
env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler deploy --env staging
```

`CLAUDE.md` has the rest: what each directory holds, how to check a page, and
the handover checklist is section 8 of `plans/plan-eccm-setup.md`.
