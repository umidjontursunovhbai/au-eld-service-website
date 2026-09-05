# AU ELD — Open Road

An entirely new homepage for fleet owners needing ELD support and an easy way
to talk to the team. The user rejected the preceding design; rebuild the
composition, not just the colors.

Palette: porcelain #F5F7FA, paper #FFFFFF, transport blue #0046FF, ink #101D33,
slate #657080, silver #DDE3EB. Bricolage Grotesque for mixed-case display;
DM Sans for body and utility. No condensed dispatch typography.

Layout: compact navigation → offset headline / portrait-cropped truck photograph
→ human support and three signals → editorial service rows and integrations →
cobalt trial offer with $120 price → direct phone, Telegram, email.

Signature: one cinematic transport photograph beside the headline. Broad
spacing and rounded tactile controls. Quick complete-group entrance animations,
an ink-stroke title accent, and quiet hover responses. No illustrated highway,
radar, fake live data, horizontal scrolling, scroll trapping, or photo zoom.

Pre-build critique: cream and serif would introduce another default aesthetic.
Cool porcelain, geometric type, and cobalt come from the AU logo instead.
Spend visual expression in the photo and avoid decorative interface widgets.

Preserve every supplied service fact, trial, price, guarantee, and contact.
Keep local until publication is requested. Previous uncommitted changes are
recoverable at /private/tmp/au-eld-watchline-before-new-design.patch.

## Image provenance

Mode: built-in imagegen, new generation. Output integrated as
`assets/open-road-hero.jpg`, converted from the generated PNG with sips at JPEG
quality 86. The photo is decorative, not a representation of the client's fleet.

Prompt:

> Use case: photorealistic-natural. Create a premium editorial transport photograph for AU ELD Service homepage. Wide landscape 1536x1024 composition, a beautiful deep cobalt blue modern American long-haul semi truck with a plain silver dry van trailer driving on an open western US highway through soft low hills. Front three-quarter view, truck positioned in the right-center, entire truck cab and most trailer visible with generous margin; highway sweeps from lower left. Shot from a low tracking vehicle, polished natural commercial photography, crisp cab details, realistic tires and mirror geometry, subtle motion blur ONLY road surface, calm pale blue sky with thin clouds, soft morning daylight, muted sage hills, clean silver guardrail. Refined cool color grading, light airy atmosphere, no sunset orange, no night, no neon, no CGI illustration look. The hero will crop to a wide 2.7:1 band so keep truck and road within central 55 percent of image height. No text, no logos, no watermark, no UI. This is a decorative trucking image, not a claim to depict the client's actual fleet.

## Implementation critique

The photograph is the main visual anchor; no animated background decoration
competes with it. Editorial service rows replace the initial three-card grid.
All three support signals enter together. Contact uses one clear phone action
and two quieter direct channels; the mobile contact dock disappears near them.
Phone buttons copy +1 (440) 808-6300 and never open a dialer. They show success
feedback, with a manual-copy message if clipboard access fails.
Body content stays visible without JavaScript. Motion respects the user's
reduced-motion setting, including changes made while the page is open.

The second pass removes generic slogans and centers the actual service promise:
every driver reviewed 3–4 times each shift. Display typography, asymmetrical
image framing and service rows make the layout less like a default card grid.
Motion includes scroll-colored headings, drawn support icons, foreground-caption
movement, a settling price ticket, pointer-responsive row lighting and button
sheen. The image never zooms and whole content groups enter together.

Verified locally: desktop 1280px, tablet 805px, mobile 390px and 320px have no
horizontal page overflow. Desktop and mobile phone controls copy the exact number
to the browser clipboard, with zero tel: links. Reduced-motion emulation cancels
animations and keeps content visible. JavaScript syntax and diff checks pass.

## Kinetic text pass

Preserve the Open Road palette, Bricolage display and DM Sans body. The signature
motion is a short word-level perspective lift, with a maximum 152ms internal
stagger. Supporting copy rises together, statistics settle without changing their
values, service dividers draw across, and CTA surfaces catch a single light pass.
Text can replay after fully leaving and re-entering the viewport. No pinning,
letter scrambling, masked text, endless attention-grabbing loops or photo zoom.
This adds motion at the user's request without making support rows wait for each
other. Text remains real, selectable DOM content and readable without JavaScript.

### Slower, continuous text timing

The user found the first text motion too quick and glitch-like. Headings now
take 1120ms with a 65ms word offset capped at 195ms; body text takes 950ms.
Use a gentler cubic-bezier(.22,.65,.25,1), a restrained 14-degree tilt and no
overshoot. Backwards fill holds delayed words in their starting state instead
of flashing visible before the animation begins. Remove parent animations around
animated text and guard against overlapping/repeated plays within 1600ms.
