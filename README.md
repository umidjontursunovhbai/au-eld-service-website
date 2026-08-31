# AU ELD Service · Signal Shift

A premium, responsive one-page homepage built as an operational signal ledger.
Scrolling advances the AU ELD support checks, pans through the included service
manifest, lands the free-week offer and finishes at direct Phone, Telegram and
Email routes.

## Included

- Signature Shift Trace, live canvas support field and route checkpoints
- Scroll-pinned support sequence with human support kept primary
- Horizontal service manifest with all requested AU ELD benefits
- One-week-free offer, $120 monthly price and service promise
- Responsive desktop and mobile layouts
- Reduced-motion fallback with all content reachable
- Direct phone, email, and Telegram links

## Preview

Run a local server from this folder:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

### HTTPS preview

Run the dependency-free local HTTPS server:

```bash
node serve-https.mjs
```

Then visit `https://localhost:4174`. The first run creates a development-only
certificate inside the git-ignored `.certs/` directory. Because it is locally
self-signed, browsers show a certificate warning until that certificate is
explicitly trusted on the machine. Production hosting should use a certificate
from its hosting provider or another trusted certificate authority.

## Contacts

Phone, Telegram and Email are direct semantic links in `index.html` and are
verified during QA.

## Scrollcraft source and QA

The authored brief, build plan, source build, report and screenshot-based QA
artifacts live under `scrollcraft/builds/au-eld-signal-shift/`.
