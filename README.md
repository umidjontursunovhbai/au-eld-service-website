# AU ELD Service · Watchline

A custom, one-page AU ELD marketing site built from scratch with semantic HTML,
CSS and a small JavaScript motion layer. It does not use Scrollcraft or another
UI framework.

## Direction

Watchline is based on the visual language of an after-hours fleet support desk:
route traces, operational labels, condensed dispatch typography and a human
attention state. The design plan and critique are documented in `DESIGN.md`.

## Content

- Driver reviews 3–4 times per shift
- 24/7 driver support and real-time fleet monitoring
- Audit, compliance, profile and BOL support
- AU ELD device and integration coverage
- One-week free trial and $120 per-truck monthly price
- Direct Phone, Telegram and Email actions

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
- Grouped text reveal, scroll-driven background movement and hover feedback
- Reduced-motion support
