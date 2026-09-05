# AU ELD Watchline — design direction

## September refinement: the night route

Keep the established six-color palette and Barlow Condensed / Manrope / IBM Plex
Mono roles. Increase utility text to 10–12px and display line-height to .98.
The audience is fleet owners; the page's job is to explain support and start a
conversation. Replace the abstract logo radar with a bespoke top-down truck on
an illuminated route. This illustration is the single visual signature; its
route pulses gently, while the content enters in quick, complete groups.

Layout: [clear service promise | night-route illustration] → compact facts →
human support / three signals → three service columns → trial / monthly price →
phone-first contact. Use rounded 20–28px surfaces and quiet dividers. Remove
diagonal corner styling, giant gaps, outline headings, and simulated live states.
Keep all original business facts and direct contact destinations.

Pre-build critique: a dashboard of decorative status badges would repeat the old
generic direction. The truck illustration grounds the hero in transportation;
the support panel explains capabilities, not fabricated live monitoring data.

Implemented motion: native Web Animations headline lift/rotation, a short soft
settle on rows, scale entry on the illustration and price, and simultaneous
support reveal. Hero-only text delay is capped at 110ms. The truck advances with
scroll; route pulses stop when the scene leaves the viewport. Contact arrow and
button hover motion remains small. Reduced-motion changes cancel active reveals.

QA: reviewed desktop, 805px tablet, 390px mobile and 320×568 contact layouts.
Document width matches client width at checked sizes. All three support signals
reveal together. Contact destinations preserved; browser warning/error log empty.
Reduced motion leaves no hidden reveal content; disabling JavaScript leaves
content visible. The mobile contact bar hides when the contact section is visible.
Removed contact overflow clipping so entry motion is not cut at the border.
The refinement is local and has not been published to GitHub Pages.

## Subject

AU ELD is a human-led ELD compliance and driver-support service for US trucking
fleets. The audience is fleet owners and operations managers who need confidence
that drivers are watched throughout every shift. The homepage has one job: make
that coverage tangible, then give the visitor a direct route to start the free
week.

## Token system

- **Blacktop** `#071018` — page ground
- **Cab glass** `#0D1C28` — elevated surfaces
- **Route blue** `#1677D2` — brand action
- **Signal ice** `#70C8FF` — live states and focus
- **Ledger white** `#F1F4F6` — primary type
- **Dispatch amber** `#E4AE55` — human attention, used sparingly

Type roles:

- **Barlow Condensed** — large dispatch-language headlines
- **Manrope** — calm, readable body copy and actions
- **IBM Plex Mono** — timestamps, channel labels and operational states

## Layout explorations

Option A — generic dashboard (rejected)

```text
[ headline ] [ metric cards ]
[ card ][ card ][ card ]
[ feature grid ]
```

It could belong to any SaaS company and repeats the card language the client
already rejected.

Option B — night watchline (selected)

```text
[ logo / compact nav / call ]
[ giant dispatch thesis       ][ live human watch dial ]
[ one factual coverage rail                              ]
[ support copy ][ one vertical signal tape with 3 events ]
[ service manifest: disciplined rows, not cards          ]
[ free-week commitment ][ direct phone / TG / email      ]
```

## Signature

The **Watchline** is one continuous route drawn through the page background. It
moves gently with scroll, lights the support signals together and splits into
the three contact channels at the close. It represents the actual promise: a
signal never disappears into software; it reaches a support specialist.

## Self-critique before build

The first version of the direction leaned toward a neon control-room dashboard.
That is another AI-design default. The revision removes decorative charts,
glass-card grids, fake metrics and excessive glow. Blue belongs only to routes
and actions; amber marks human attention. The boldness is spent on the moving
Watchline and condensed dispatch typography. Everything else stays quiet.

## Post-build critique

The first reveal pass clipped large headings until the observer considered them
invisible. The final motion uses a short blur-and-rise instead, which keeps the
dispatch typography intact and avoids cropped animation frames. At 320px the
phone and email routes were tightened so both remain readable without horizontal
scroll. The final page keeps one expressive object (the Watchline dial) and uses
flat manifest rows everywhere else.
