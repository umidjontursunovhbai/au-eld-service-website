# AU ELD Service · Open Road

A custom, one-page AU ELD marketing site built from scratch with semantic HTML,
CSS and a small JavaScript motion layer. It does not use Scrollcraft or another
UI framework.

## Direction

Open Road pairs cool porcelain, AU cobalt blue, geometric typography and a
cinematic transport photograph. The new plan and image provenance are in
`OPEN-ROAD-DESIGN.md`; `DESIGN.md` records the preceding design, not this version.

## Content

- Driver reviews 3–4 times per shift
- 24/7 driver support and real-time fleet monitoring
- Audit, compliance, profile and BOL support
- AU ELD device and integration coverage
- One-week free trial and $120 per-truck monthly price
- Copy-only phone number, direct Telegram and Email actions (no auto-call)

## Local preview

From this directory:

```bash
python3 -m http.server 4190 --bind 127.0.0.1
```

Open `http://127.0.0.1:4190/`.

## Quality floor

- Responsive from 320px through wide desktop
- No horizontal page scrolling
- Semantic contact links and keyboard focus states
- Grouped reveals, scroll-colored headings, drawn icons and tactile hover feedback
- No scroll trapping, horizontal carousels or scroll-driven photo zoom
- Reduced-motion support
