# AU ELD Service · Night Mile report

## Outcome

A compact one-page scroll experience built as one unbroken night-highway world. The visitor sees three short benefit groups, a human-led 24/7 support scene, the free-week offer and three direct contact exits. There are no conventional stacked sections, forms, counters, or filler copy.

## Grammar decision

Chosen grammar: **Continuous world** using Scrollcraft worldflight.

This grammar keeps the truck, road and atmosphere fixed while scroll becomes the timeline. Filmic one-shot, editorial chapters, live surface, gallery, split stage and rhythmic cutlist lost because they either repeated the previous build, introduced visible section seams, or added more interface and text than the brief allows.

## Signature move

**AU Lane.** The cobalt slash implied by the AU mark grows into a wide wet-asphalt road. A route runner follows it, the road fills the foreground beneath the offer, then settles below a single Dispatch Channel Console. Phone is the primary bay; Email and Telegram occupy the two compact secondary bays. Wide screens finish with three thin route-map traces; smaller screens keep the close deliberately clean.

The move belongs to this brand rather than to a generic logistics template: removing the AU mark and blue slash removes the site’s visual logic.

## Journey

1. **Recognition · Confidence** — full AU mark, truck and “Logs clear. Drivers moving.”
2. **Included · Clarity** — driver desk, compliance and connected-fleet benefits arrive as three compact scenes while the route grows.
3. **Shift watch · Reassurance** — the human team stays primary while alert-assisted log, disconnect and inspection-readiness checks arrive in sequence.
4. **Offer · Momentum** — one week free, $120 per truck/month and the service promise form the visual peak.
5. **Contact exits · Readiness** — “Start your free week,” the mark and three usable contact links settle above the quieted route.

## Feeling curve review

| Stage | Intended | Observed in QA |
|---|---|---|
| Recognition | Immediate confidence | The mark and truck establish the business before motion begins. |
| Clarity | Benefits without a wall of copy | Nine requested benefits are split into three short scenes instead of a generic grid. |
| Reassurance | Visible operational support | The 3–4 checks per shift and three smart-alert cases remain readable without turning the page into a dashboard. |
| Momentum | One memorable visual peak | The broad road carries the free-week offer and real monthly price rather than another slogan. |
| Readiness | Quiet, useful close | Updated contact choices settle into a simple destination with no form or sales clutter. |

## Fingerprint gate

Compared with the prior Night Operations build, Night Mile differs in all six registered dimensions: grammar, navigation, hero device, act shape, close pattern and signature move. Gate result: **6/6 different**.

## Assets and provenance

- Client-supplied AU ELD logo.
- Existing Night Dispatch truck photograph from the previous approved direction.
- Four desktop and four mobile scrub clips encoded locally from that photograph.
- SVG road, route runner, rain field, copy choreography and interface authored in code.
- No generated image or third-party stock asset was added.

## Verification

- Scrollcraft worldflight assertion: **24 passed, 0 failed**.
- Desktop screenshot QA: 26 positions at 1440 × 900, no dead scroll, all four legs reach full opacity and paint real frames.
- Mobile screenshot QA: 26 positions at 390 × 844, no dead scroll, all four legs paint real frames and the contact layout remains usable.
- Reduced-motion QA: no video fetched, every poster and copy state remains reachable, no copy or poster transform.
- Responsive crop audit: the six main content states and redesigned contact console pass at 1440 × 900, 768 × 1024, 390 × 844, 320 × 568 and 844 × 390 with no visible text outside the viewport and no horizontal overflow.
- Contrast QA: every sampled cue clears 4.5:1 at its worst desktop and mobile frame; dynamic localized scrims protect the copy without flattening the full photographic world.
- Keyboard state: hidden contact links use `tabindex=-1`; all three return to the tab order when the contact destination is active.
- Direct contact links are populated from one `CONTACT` object and verified as `tel:+14408086300`, `mailto:aueldservice@gmail.com` and `https://t.me/AUELD_manager`.
- Motion refinement: one time-based smoothing curve keeps custom motion consistent at 60 Hz and 120 Hz; its catch-up constant was tightened from 95ms to 60ms, and the background still moves from 1.015× to 1.12× across the journey.
- Pace refinement: four equal worldflight legs were reduced from 1.8vh to 1.4vh and linger from 0.12 to 0.08, cutting wheel travel by about 22% without changing the normalized copy choreography.
- Crop audit: text clip masks and off-screen horizontal contact entrances were removed; mobile road artwork now uses an unclamped 16:9 SVG stage inside the viewport-safe lower band.
- Route refinement: the oversized 62/44px three-way road fork was removed. Tablet and mobile use one low road; desktop uses three 4px traces that draw sequentially after the peak.

The QA tool reports long held first/last frames for mounted worldflight legs. This is expected for inactive crossfade layers; the dedicated worldflight test separately confirmed monotone playhead movement, convergence, real-frame painting and seam behaviour.

## Launch note

The supplied business phone, email and Telegram username are now wired into the live contact actions. This redesign remains uncommitted and unpushed until the client explicitly asks to publish it to GitHub.
