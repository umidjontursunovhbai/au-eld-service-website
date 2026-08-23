# AU ELD Service · Night Mile

A premium, responsive one-page scroll experience built as one continuous
night-highway world. Scrolling scrubs the truck footage, reveals the AU ELD
benefits, 24/7 support workflow and free-week offer, grows the AU Lane, and ends
at direct Phone, Email and Telegram routes.

## Included

- Four-part scroll-scrubbed night-highway footage with seamless crossfades
- Signature AU Lane road draw, route runner, rain field and contact branches
- Three compact benefit scenes, alert-assisted support story and animated offer
- Responsive desktop and mobile layouts
- Reduced-motion poster fallback with all content reachable and no video fetch
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

The phone number, email address and Telegram username are managed in the
`CONTACT` object at the top of `script.js`. Every contact action reads from that
single object.

## Scrollcraft source and QA

The authored brief, build plan, source build, and screenshot-based QA artifacts
live under `scrollcraft/builds/au-eld-night-mile/`.
