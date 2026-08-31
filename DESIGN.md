# AU ELD Watchline — design direction

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
