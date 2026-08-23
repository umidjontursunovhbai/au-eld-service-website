# AU ELD Service · Night Operations build plan

## Chosen grammar

**Live surface.** The page is an operable night-operations console whose state changes under scroll. The product demonstration is the argument.

Grammar constraints held:

- No marketing header, wordmark-and-CTA bar, full-bleed photography, scrims, scrub video, kinetic headline stacks, spotlight effect, or oversized marketing claims.
- App chrome is the navigation.
- The first screen is already running.
- The last screen contains an actual contact input.
- All operational values are computed from clearly labelled local sample data.
- Ground movement stays inside one continuous graphite world with at most two tonal stops.

## Belief and action

- Belief: AU ELD Service turns a confusing ELD issue into one clear next action.
- Single action label: **Contact dispatch**.

## Signature move

**Record Reconcile.** During the peak, the incident’s individual record sheets detach from their source panels, travel at different depths, pause around a single scan pulse, and snap into one verified docket. In the closing stage that docket folds down into the prefilled contact composer.

Tell-someone sentence: “It’s the site where the records break apart, snap into one clean docket, then become the message field.”

## Fingerprint gate

The current registry is empty, so this is the first registered build. It is also checked against the discarded local attempt so the redesign does not repeat it:

| Dimension | Discarded attempt | This plan | Different |
|---|---|---|---|
| Grammar | Filmic one-shot | Live surface | Yes |
| Nav treatment | Fixed wordmark, CTA, route ledger | Operable app rail with incident-stage navigation | Yes |
| Hero device | Night-cab video scrub with kinetic promise | Live route console already processing a sample request | Yes |
| Act-sequence shape | `scrub → pan → pin → flow/reveal → pin → pin`, 6 acts, about 14vh | `pin/live → reveal → pan → parallax/pointer → bespoke reconcile → flow/input`, 6 beats, 10.40vh | Yes |
| Close pattern | Pinned contact console and CTA | Verified docket folds into a real composer and direct channels | Yes |
| Signature move | Route ledger becomes contact route | Fragmented records reconcile and become the composer | Yes |

Gate result: 6 of 6 dimensions differ.

## Journey and score

The feeling curve in `BRIEF.md` was written before this device score.

| Beat | Feeling | Device family | Span | Why this one |
|---|---|---|---:|---|
| Recognition | Alert | `pin` plus custom `--sc-p` state | 1.30vh | The surface holds like an active tool while the incoming request registers. |
| Tension | Concern | `reveal` | 1.55vh | Device, driver, and log layers open from different edges and expose the mismatch. |
| Turn | Focus | `pan` | 1.55vh | The service action shelf moves laterally, reading as a set of practical choices. |
| Substance | Control | `parallax` plus pointer interaction | 1.30vh | The visitor can inspect and choose a help path while route layers converge and settle. |
| Peak | Relief | bespoke Record Reconcile | 3.10vh | Three source records separate, align by timestamp, then snap into one verified docket. This is visibly the largest span and visual change. |
| Commitment | Readiness | `flow` plus `in` and actual input | 1.60vh | The resolved incident token enters a usable contact composer while the verified record remains visible. |

Total timeline: **10.40 viewport-heights**.

Device checks:

- Six device families across six beats.
- No family repeats consecutively.
- No scrub acts.
- The 3.10vh peak is clearly longer than every other beat.
- The last third of Control and the peak’s opening interval form authored silence, with a changing scan pulse reported through `data-sc-verify-state`.

## Surface composition

- Desktop: 88px app rail, full operations map, contextual incident docket, bottom action shelf.
- Mobile: compact top app rail, map in the upper field, contextual docket in a bottom sheet, service actions horizontally reachable.
- Background: a code-native canvas draws district fields, lane ribbons, vehicle nodes, route particles, and incident distortion. It is the working map, not decoration and not “just a line.”
- Depth: three levels only, built from overlap, edge light, offset shadows, mild blur, and grain.
- Corners: one rounded family, with tighter radii for controls and broader radii for the main docket.

## Visual system

- Canvas: blue-black graphite.
- Surface: cold steel-black.
- Ink: soft ivory.
- Soft ink: blue-tinted silver.
- Accent: brand cobalt only.
- Accent ink: ivory or near-black according to contrast.
- Type: Sora for operational display labels and IBM Plex Sans for prose and controls; two families maximum.

## Motion language

- Continuous scroll work uses transform, opacity, and clip-path only.
- Every text element participates through one of four restrained patterns: boot settle, masked reveal, status roll, or docket fold.
- Pointer motion applies only to real inspectable controls and the map focus target.
- UI hover and press transitions remain under 180ms and include focus-visible states.
- Reduced motion removes position travel, turns the timeline into a static stacked operational overview, and keeps every state plus the contact composer reachable.

## Data and contact honesty

- `SAMPLE_INCIDENT` drives the live surface and is visibly labelled **Sample night shift**.
- `CONTACT` centralizes phone, email, and Telegram values.
- Initial contact placeholders: `+1 (555) 014-7824`, `support@aueldservice.com`, `@AUELDService`.
- The final report must flag these as sample values requiring client confirmation.

## Verification plan

- Run the Scrollcraft desktop, mobile, and reduced-motion capture passes.
- Read each generated contact sheet, not only the text report.
- Confirm the served page title before every pass.
- Inspect custom `data-sc-verify-state` changes across each marker and declare a hold only at the resolved final end.
- Test rail overflow, contact form behavior, direct links, keyboard order, focus visibility, no horizontal document overflow, and no console or failed-request errors.
- Keep the remote repository untouched until the client explicitly asks for a push.
