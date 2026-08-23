# AU ELD Service · Night Operations

A premium, responsive one-page website built as a live night-operations surface.
Scrolling advances a clearly labelled sample driver incident from incoming
request to record reconciliation and a usable contact composer.

## Included

- Scroll-driven map, record scan, horizontal service rail, and signature record reconcile animation
- Responsive desktop and mobile layouts
- Reduced-motion fallback with all content reachable
- Direct phone, email, and Telegram links
- Contact composer that opens the visitor's email application with a prefilled message

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

## Before launch

Replace the sample phone number, email address, and Telegram account in the
`CONTACT` object at the top of `script.js`. Every contact link on the page reads
from that single object.

The contact form intentionally opens the visitor's email application. Connect
it to a real form endpoint later if submissions should happen without leaving
the page.

## Scrollcraft source and QA

The authored brief, build plan, source build, and screenshot-based QA artifacts
live under `scrollcraft/builds/au-eld-night-operations/`.
