# h3lp

**A free, friendly hub that connects everyone in Ontario to real, verified help.**
Someone to talk to, a meal today, a safe place, community, free youth sports, newcomer and
legal support, and money basics. English and French. No sign-up. No tracking. Made by a
civilian, for all civilians.

Live site: https://h3lp.francobernal.ca

## What it is
h3lp is one calm page. The emergency lines (988, 911) and a Quick exit stay on screen at all
times. You can say what is going on in your own words, tap a situation, or browse by need, and
h3lp shows trusted Ontario and Canada-wide services you can reach right away. h3lp does not run
any of these services. It is a signpost that points you to the real ones, with every phone
number and link checked by hand.

- **Search that stays on your device.** `intent.js` reads what you type (English or French,
  typos and slang included) and maps it to services. Words that signal danger always put 988
  or 911 first. Nothing you type is sent or saved.
- **Quick exit.** The button, or Shift pressed three times, swaps the page for the weather
  and leaves no h3lp entry to go Back to. It does not clear history; the page says so.
- **Tools.** Breathe with me (one minute, 4 in and 6 out, or 5-4-3-2-1 grounding), My safety
  plan (print by default; saved in this browser only if you choose), Save key numbers (a
  contacts file made on the device) and a printable wallet card.
- **The sky line.** The thin line at the top follows the real sky over Toronto, computed
  from the sun's position (`sky.js`).
- **Weather safety.** If you pick a city, h3lp asks Open-Meteo for that city's forecast and
  shows one calm card when it will feel like -15 or colder tonight, or 32 or hotter today.
- **Works offline** after the first visit (service worker, network first for the data).

## Keeping it honest
Phone numbers and links were verified when the page was built (June 2026, re-verified and
audited July 2026, including the French edition). Click through them now and then and fix
anything that has changed. Every service lives in `data.js`, in the `R` list: each entry is
one card with a `title`, `body` and `actions` (`tel:`, `sms:` or `https:`), plus a `fr`
block. Confirm any local detail by calling **211** before you rely on it.

## Working on it
- `node --test tests/intent.test.js` runs the 241-phrase test of the search engine.
- `node tools/copy-doc.js` rebuilds `docs/COPY.md` (every string, EN and FR) from `data.js`.
- `node tools/inline-sprite.js` copies `icons/sprite.svg` into `index.html`.
- `bash scripts/build-public.sh` builds the allowlisted site into `_site/` (what Cloudflare
  Pages publishes). Only files named in `.publicfiles` ship.

## Crisis numbers (always live in the page)
- **988** Suicide Crisis Helpline, call or text, 24/7
- **911** if someone is in immediate danger
- **211** to be connected to local help for almost anything, 24/7, 150+ languages

## License
The source is published so you can read it, learn from it, and verify every number and link
yourself. It is **not open source**: the work, including the design, code, copywriting, and
the h3lp name and logo, belongs to Franco Bernal, all rights reserved. Helpline names and
marks belong to their own organizations. The Fraunces and Atkinson Hyperlegible Next fonts
ship under the SIL Open Font License (see `docs/licenses`). See the `LICENSE` file for the
full terms.

> "Reason remains bulletproof, even when written in code."
> © 2026 Franco Bernal. Proudly built in Ontario, Canada.
