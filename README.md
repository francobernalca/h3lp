# h3lp

**A free, friendly hub that connects everyone in Ontario to real, verified help.**
Someone to talk to, a meal today, a safe place, community, free youth sports, newcomer and
legal support, and money basics. No sign-up. No tracking. Made by a civilian, for all
civilians.

Live site: `https://YOURNAME.github.io/h3lp/`

## What it is
h3lp is one calm page. You tell it your city and tap what you need, and it shows you trusted
Ontario and Canada-wide services you can reach right away. h3lp does not run any of these
services. It is a signpost that points you to the real ones, with every phone number and link
checked by hand.

It is built to feel safe and welcoming for anyone, whatever their age, background, or
situation, with lines for youth, Indigenous, Black, 2SLGBTQ+, Muslim, Latino/Hispanic
(Spanish-speaking), student, senior, and farming communities sitting right next to the
universal ones.

## Publish it (GitHub Pages, free)
1. Create a public repository (for example, `h3lp`) and upload every file in this folder to
   the repository root.
2. Go to **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main`
   and `/ (root)`, and save.
3. Your site goes live at `https://YOURNAME.github.io/h3lp/` within a minute or two.

`.nojekyll` is included so Pages serves the files exactly as they are.

## Files in this repository
```
index.html      The page
site.css         All styles (and the @font-face rules for the bundled font)
site.js          The content (every helpline and link) and the interactions
assets/
  h3lp-logo-transparent.png   Logo
  h3lp-intro.mp4              Intro video
  fonts/                      Fraunces (self-hosted .woff2 files)
README.md
LICENSE          The Unlicense (public domain)
.nojekyll
```

## Is it safe to publish?
Yes. This is a static website with nothing hidden in it.

- **No accounts, no databases, no backend.** Nothing is sent anywhere and nothing is stored
  about a visitor. The site sets no cookies and uses no local storage.
- **No analytics or trackers.** There is no third-party tracking code of any kind.
- **No secrets.** There are no API keys, passwords, tokens, or private emails in the code.
  The only phone numbers are public helplines.
- **No third-party JavaScript.** The only script is your own `site.js`.
- **Zero outside requests.** The Fraunces heading font is self-hosted in `assets/fonts`, so
  the page loads nothing from any other server. It works fully offline, and no third party
  ever sees your visitors.
- Every outbound link opens with `rel="noopener noreferrer"`, the standard safe setting.

## Keeping it honest
Phone numbers and links were verified when this page was built (June 2026). Click through
them now and then and fix anything that has changed. To edit a resource, open `site.js`, find
the entry in the `R` list (each is one card with a `title`, `body`, and `actions`), and change
the text, phone (`tel:`), or link (`https:`). Confirm any local detail by calling **211**
before you rely on it.

## Crisis numbers (always live in the page)
- **988** Suicide Crisis Helpline, call or text, 24/7
- **911** if someone is in immediate danger
- **211** to be connected to local help for almost anything, 24/7, 150+ languages

## License
Public domain (The Unlicense). See `LICENSE`. Made to be given away.

> "Reason remains bulletproof, even when written in code."
> © 2026 Franco Bernal. Proudly built in Ontario, Canada.
