---
name: Silicone Roof Pros
description: The roof-survey deliverable itself, measured live on a graphite survey sheet.
colors:
  survey-graphite: "#1b1d21"
  survey-graphite-raised: "#26292e"
  survey-line: "#3b3f46"
  survey-glass: "#121417"
  viewport-ground: "#2a2d31"
  report-sheet: "#eef0f1"
  paper: "#ffffff"
  ink: "#15171a"
  rule: "#c9cdd1"
  body-text: "#33373c"
  secondary-text: "#4d5258"
  muted-text: "#5f656c"
  label-on-graphite: "#9aa0a6"
  text-on-graphite: "#c9cdd1"
  wet-hatch: "#d4232a"
  wet-ink: "#b51d23"
  wet-on-graphite: "#ff8a8f"
  dry-survey-blue: "#0a5f96"
  dry-tint: "#e7eef3"
  dry-key-grey: "#8d9298"
  amber-action: "#f4a21c"
  amber-action-hover: "#ffb43d"
  amber-ink: "#8a4f00"
  heat-0: "#160b33"
  heat-1: "#4c1182"
  heat-2: "#a3207c"
  heat-3: "#e14b2b"
  heat-4: "#f59a1b"
  heat-5: "#fde9a3"
typography:
  display:
    fontFamily: "Archivo, 'Archivo Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.1rem, 1.1rem + 2.2vw, 3.05rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 87.5"
  headline:
    fontFamily: "Archivo, 'Archivo Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2.2vw, 2.75rem)"
    fontWeight: 750
    lineHeight: 1.05
    letterSpacing: "-0.018em"
    fontVariation: "'wdth' 87.5"
  title:
    fontFamily: "Archivo, 'Archivo Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.018em"
    fontVariation: "'wdth' 87.5"
  body:
    fontFamily: "Archivo, 'Archivo Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  readout:
    fontFamily: "Archivo, 'Archivo Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.35rem, 1rem + 1vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontFeature: "'tnum' 1, 'lnum' 1"
    fontVariation: "'wdth' 75"
  label:
    fontFamily: "Archivo, 'Archivo Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  none: "0px"
  control: "2px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  4xl: "6rem"
  thermal-strip: "4px"
  touch-target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.amber-action}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.amber-action-hover}"
    textColor: "{colors.ink}"
  button-primary-large:
    backgroundColor: "{colors.amber-action}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "1rem 2rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-outline-on-graphite:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
  button-outline-on-graphite-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  survey-search-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "56px"
  survey-frame:
    backgroundColor: "{colors.survey-glass}"
    rounded: "{rounded.none}"
  survey-viewport:
    backgroundColor: "{colors.viewport-ground}"
    rounded: "{rounded.none}"
    height: "clamp(320px, 36vw, 470px)"
  survey-hud:
    backgroundColor: "{colors.survey-glass}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.45rem 0.8rem"
  readout-cell:
    backgroundColor: "{colors.survey-graphite}"
    textColor: "{colors.paper}"
    typography: "{typography.readout}"
    padding: "0.7rem 0.9rem 0.8rem"
  scan-legend-key:
    rounded: "{rounded.none}"
    size: "22px"
  spec-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "1rem 0"
  procedure-step:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "1.25rem 1.25rem 1rem"
  warranty-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(1.5rem, 4vw, 2.75rem)"
    width: "860px"
  ledger-header-cell:
    backgroundColor: "{colors.survey-graphite}"
    textColor: "{colors.paper}"
    padding: "0.9rem 1rem"
    width: "9rem"
  thermal-strip:
    height: "4px"
  wordmark:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
---

# Design System: Silicone Roof Pros

## Overview

**Creative North Star: "The Moisture-Survey Sheet"**

The site is the roof-survey deliverable, not a contractor brochure. Every page is built from the materials of an infrared moisture survey: a graphite orthophoto ground, cool white report sheets, hairline survey rules, red diagonal hatching where the roof is wet or failing, a grey key where it is dry, and an iron-palette thermal strip as the signature rule. The visitor's own roof, outlined on the satellite viewport, is the hero, and the figures it produces are read like instruments.

Density is a console's, not a brochure's. Readouts, legends and specifications sit packed in ruled strips and tables. Panels share hairlines instead of floating apart on gaps, and headings sit left-set on a top rule like report headings. The world refuses the category default: a stock-photo hero with a blue gradient, a check-mark benefit list and rows of tinted icon cards.

One colour acts. Amber is the action, the measured outline and the focus ring, and nothing else competes with it. Red means wet. Blue means dry or sound. The thermal ramp means heat, and only appears as a rule or as the scale on real infrared imagery.

**Key Characteristics:**
- Graphite survey grounds alternating with white paper and cool report sheets.
- Square corners everywhere; controls take a barely-there 2px.
- Hairline rules (1px) carry structure; shadows are almost absent.
- Archivo, semi-condensed for display, condensed for tabular readouts.
- Amber is the single action colour; red hatch marks wet, blue marks dry.
- A 4px iron-palette thermal strip opens or closes each dark run.
- One authored motion: the hero scan-line pass.

## Colors

A cool graphite-and-paper survey palette with three semantic marks (wet red, dry blue, measured amber) and one six-stop thermal ramp.

### Primary
- **Survey Amber** (amber-action): the one action colour. Primary buttons, the nav call-to-action, the drawn roof polygon, the HUD once a roof is measured, active nav underline, link underlines on graphite, text selection and the focus ring. It always carries ink text, never white.
- **Amber Lift** (amber-action-hover): primary button hover only.
- **Amber Ink** (amber-ink): amber's text form on light grounds (coating page emphasis), because raw amber on paper is only 2.09:1.

### Secondary
- **Dry Survey Blue** (dry-survey-blue): sound, dry, the good column. The logo's own hue, used for in-copy emphasis (solution highlight, tax highlight), text links on paper, line-icon strokes and the good ledger border. 6.8:1 on paper.
- **Dry Tint** (dry-tint): pale blue wash for dry or confirmed states on paper.
- **Dry Key Grey** (dry-key-grey): the dry swatch in the scan legend, matching how the infrared survey renders sound roof.

### Tertiary
- **Hatch Red** (wet-hatch): wet insulation and failing roof. Applied as 135-degree hatching, 2px stroke in an 8px repeat, on the scan legend key, the pain columns' top band, the tear-off readout and the "new roof" ledger row (at 10-32% alpha on those fills). Also the solid "before" label.
- **Wet Ink** (wet-ink): red as text on light grounds (6.64:1 on paper).
- **Wet on Graphite** (wet-on-graphite): red as text on graphite (7.46:1).
- **Thermal Ramp** (heat-0 to heat-5): violet-black, violet, magenta, vermilion, orange, pale amber. Stops sit at 0, 20, 42, 62, 82, 100% horizontally for strips and 0, 22, 44, 64, 82, 100% bottom-to-top for the vertical scale bar.

### Neutral
- **Survey Graphite** (survey-graphite): the orthophoto ground. Hero, interior page heroes, the problem section, warranty band, CTA bands, top bar, footer, table header cells.
- **Graphite Raised** (survey-graphite-raised): panels and fields set on graphite (pain columns, footer inputs).
- **Survey Line** (survey-line): hairlines on graphite: readout grid, HUD dividers, frame edges, footer rule.
- **Survey Glass** (survey-glass): the instrument chrome: survey frame body, HUD and map overlay cards (at 90-92% opacity over the map).
- **Viewport Ground** (viewport-ground): the empty map well, with the placeholder blended in luminosity mode.
- **Report Sheet** (report-sheet): cool alternate light ground for solution, process, tax and partner sections; dropdown hover.
- **Paper** (paper): default page ground, panels, the warranty sheet, inputs.
- **Ink** (ink): headings, borders on controls and section tops, button text on amber.
- **Rule** (rule): hairlines on light grounds between rows, panels and cells.
- **Body Text** (body-text), **Secondary Text** (secondary-text), **Muted Text** (muted-text): running copy, supporting notes, and counters/placeholders respectively.
- **Label on Graphite** (label-on-graphite) and **Text on Graphite** (text-on-graphite): readout labels and units, and running copy on dark grounds.

### Named Rules
**The One Action Rule.** Amber marks what the visitor can do or has just measured. It is never decoration, never a section fill, never a second accent beside another.

**The Three Marks Rule.** Red hatch means wet or failing, grey or blue means dry or sound, amber outline means measured. A mark appears only where it carries that meaning; the legend keys live in the scan legend and nowhere else.

**The Heat Is Data Rule.** The thermal ramp is either a 4px rule or the scale bar on genuinely thermal imagery ("Warmer · wet" / "Cooler · dry" on the infrared survey). It never sits on the satellite map, which is not thermal, and never fills a surface.

## Typography

**Display Font:** Archivo variable, self-hosted (width 75-100%, weight 400-800), with a metric-matched Arial fallback ("Archivo Fallback") so the swap does not reflow headings.
**Body Font:** Archivo at normal width.
**Label/Mono Font:** none distinct; readouts are Archivo condensed with tabular lining figures.

**Character:** One grotesque family worked across its width axis: semi-condensed and heavy for report headings, fully condensed for figures, normal width for reading. It reads like a survey plate's title block.

### Hierarchy
- **Display** (800, clamp 2.1-3.05rem in the hero, line-height 0.98, -0.03em, 87.5% width): the hero H1 only; interior page H1s use clamp(2.1rem, 1.3rem + 2.6vw, 3.4rem) at 1.02, max 20ch, and the final CTA uses clamp(2rem, 1.3rem + 2.6vw, 3.25rem).
- **Headline** (750, clamp 1.75-2.75rem, line-height 1.05, -0.018em, 87.5% width): section H2s, set left on a 1px ink top rule.
- **Title** (750, 1.0625-1.25rem, 87.5% width): H3s in spec rows and procedure steps, the frame header, the wordmark.
- **Body** (400, 1rem, line-height 1.6): running copy in body text; supporting paragraphs held to 48-60ch with pretty wrapping.
- **Readout** (700, clamp 1.35-1.75rem in the hero strip, 1.375-1.5rem in tables and spec values, 1.125rem in the HUD, 75% width, tabular lining numerals): every measured figure (area, $/sq ft, days, years, percentages). Units follow in a smaller 0.75-0.875rem label at normal weight.
- **Label** (400, 0.75-0.8125rem): readout and HUD labels, call regions, thermal ticks (0.6875rem). Sentence case, no tracking.

### Named Rules
**The Instrument Value Rule.** A figure is a readout: tabular, condensed, unit-labelled, sitting in a ruled strip or cell. Never a giant "big stat" with a caption.

**The Width-Axis Rule.** Hierarchy comes from width and weight in one family (87.5% headings, 75% figures, 100% copy), not from a second typeface.

## Layout

A 1200px container with 1.5rem side padding. Sections alternate paper, report sheet and graphite, each run vertically padded clamp(3.5rem, 7vw, 6rem) for content sheets. The spacing scale is 0.25 / 0.5 / 1 / 1.5 / 2 / 3 / 4 / 6rem.

Section headings are a two-column report heading (7fr title, 5fr dek, bottom-aligned) on a 1px ink rule, collapsing to one column at 860px. The hero is 5/12 text against a 7/12 survey frame above 1024px; below it, the order becomes headline, subhead, survey frame, readout strip, phone lines so the working action is in the first screen. The scan sheet is 7fr figure to 5fr text, stacking at 900px.

Panels share hairlines: grids collapse their gap to zero and draw a 1px rule grid, so a set of items reads as one table. Strips run three across (procedure) or two across (spec legend, readout strip) and drop to one column at 860px; legend and spec rows drop their term column at 480px.

## Elevation & Depth

Flat. Depth comes from ground changes (graphite to paper), hairlines and the thermal strip, not from shadow. Hovered panels change border to ink instead of lifting.

### Shadow Vocabulary
- **Sheet Lift** (`box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.7)`): the single shadow in the world. A white report sheet lifted off graphite, used on the warranty schedule sheet.

### Named Rules
**The One Lift Rule.** Only a paper sheet resting on graphite casts a shadow, and only the sheet lift above. Cards, buttons and panels on paper never do.

**The Thermal Edge Rule.** A 4px thermal strip marks the seam where a dark run begins or ends (under the top bar, above CTA bands and the footer, under interior heroes, atop the survey frame, map frame and warranty sheet). One strip per dark run: the footer drops its own when a CTA band precedes it.

## Shapes

Square. Panels, sheets, frames, badges, avatars, tags, modals and dropdowns are 0px. Buttons and text inputs take 2px, just enough to read as a pressable control. Borders are 1px hairlines (rule on paper, survey-line on graphite, ink on controls and section tops); 2px is reserved for registration marks and the measured key; 3px for the focus ring; 4px for the thermal strip. Dashed 1px rule separates a procedure step from its output. No pills, no circles, no tinted icon discs.

## Components

### Buttons
Blunt, labelled, pressable.
- **Shape:** near-square (2px), 1px ink border.
- **Primary:** amber with ink text, 700 weight at 93% width, 0.75rem 1.5rem padding (1rem 2rem large). Used for the nav CTA and every quote action.
- **Hover / Focus:** hover lightens to amber lift with no lift or shadow; active nudges down 1px; focus shows the 3px amber ring at 2px offset with a 5px ink halo. Colour transitions run 160ms.
- **Outline:** transparent with ink text and ink border, filling ink on hover. On graphite it inverts: white text, 60-70% white border, filling white on hover.
- **Text link:** blue, 700 weight, 2px amber underline, 12px vertical padding to reach a 44px target.
- **Disabled:** grey 200 fill, grey 500 text.

### Inputs / Fields
- **Style:** paper ground, 1px grey 400 border, 2px corners; on graphite, raised graphite with a survey-line border.
- **Focus:** border goes ink with a 3px amber halo at 45%; in the survey search bar, an inset 2px amber ring.

### Navigation
Paper navbar under a graphite top bar, closed with a 1px ink rule. Links are ink, 600 weight at 93% width; hover and active draw a 2px amber underline that scales in from the left (220ms, cubic-bezier(0.16, 1, 0.3, 1)). Dropdowns are square with a 1px ink border; items hover to report sheet.

### Wordmark
The logo mark followed by "Silicone Roof Pros" in Archivo 750 at 87.5% width, 1.1875rem, -0.015em, ink, never wrapping (1rem between 1025 and 1180px).

### Survey Frame and Viewport (signature)
The hero instrument. A survey-glass frame with a survey-line edge, topped by a 4px thermal strip. A small grey header, then the address search running edge to edge across the viewport's top (56px paper input, square, flush against a square amber button). The viewport is the viewport-ground well holding the live map: four white 22px corner registration marks (2px strokes, 12px inset), a centred 28px hairline crosshair that appears once the map is live, and the HUD top-left: a survey-glass strip of two cells (Roof area / sq ft, Silicone est.) that read an em dash until the roof is outlined, then fill and turn amber. The drawn polygon is amber at 28% fill with a 3px amber stroke. Controls and the measurement result sit below; the result is boxed in a 1px amber border.

### Readout Strip
A 2x2 ruled grid on graphite (survey-line hairlines), each cell a label over a condensed readout and unit. The cell that describes the failing alternative carries the red hatch at 32% with pink label and figure.

### Scan Legend
A definition list under a 1px ink top rule, each row an 8.5rem term (22px square key plus bold label) and its description, divided by rule hairlines. Keys: wet is red hatch with a red border, dry is the grey key, measured is a 2px amber outline over 25% amber. The infrared figure beside it sits in a graphite mat (10px) with the vertical thermal scale bar (12px wide, ticks "Warmer · wet" above and "Cooler · dry" below).

### Spec Legend and Spec Table
Specification rows replace icon-card grids. The spec legend is two columns of term (9rem, bold, 87.5% width) and value-plus-note, under an ink top rule with rule dividers. The spec table is three columns per row (heading, readout value with small unit, note). Values are condensed readouts in ink; notes are secondary text at 0.9375rem.

### Procedure Strip
Three steps in one ink-bordered paper strip, divided by rule hairlines. Each step: counted title ("1. ", counter in muted grey), a short paragraph, and its output pinned to the foot below a dashed rule as a readout with unit. Where the items are assurances rather than a sequence, the numbering is dropped.

### Warranty Schedule
A white sheet (max 860px) lifted off the graphite band with the sheet lift and a 4px thermal top edge. Inside: title, subtitle, a ruled table of term (condensed readout years), coating applied and coverage under graphite header cells, then terms as a row of short ink dashes, then fine print.

### Tax Ledger
A two-row ledger table: graphite row-header cells (9rem) against paper cells holding condensed readouts. The new-roof row carries the red hatch at 10%. Both tables collapse to stacked grids at 480px.

### Estimate Sheet (modal)
The homepage price pop-up is a white report sheet with the thermal top rule. It opens on the measured area and the price range in a two-cell readout (the range cell tinted amber at 14%), then offers one form: "Send my itemised quote". The range is never hidden behind the form. After submit it confirms and shows both regional call lines.

### Pain Ledger
On graphite, the patch-vs-replace comparison is a ruled table: hatched column heads (wet notation, because both options leave the roof failing), white row labels, wet-on-graphite (#ff8a8f, CSS `--wet-on-dark`) sub-labels. Below 640px it stacks into labelled blocks.

### Regional Call Lines and Mobile Call Bar
Every phone route shows both regions: Texas (832) 303-3183 and Pennsylvania (484) 401-8586, Pennsylvania first on the Pennsylvania page. Below 768px a fixed graphite call bar (thermal top rule) carries Call TX, Call PA and an amber Quote cell; the body reserves 60px for it.

### Thermal Strip Rule
The 4px horizontal thermal gradient (see The Thermal Edge Rule). It is the world's signature and is never thicker, never vertical except as the scale bar on infrared imagery, and never used as a fill.

### Motion
One authored motion: on load, a single amber scan-line band (38% of the viewport tall, fading to a 55% amber leading edge) passes once down the survey viewport over 1.8s with cubic-bezier(0.45, 0, 0.2, 1) after 0.35s, then fades. Under reduced motion it is removed. Everything else is state feedback: 160ms colour changes on buttons, the 220ms nav underline, a 300ms HUD colour change. No scroll reveals, no hover lifts.

### Accessibility
- Rendered text meets WCAG AA: ink on amber is 8.58:1, blue on paper 6.8:1, label grey on graphite 6.39:1, secondary text on paper 7.88:1.
- Tap targets are at least 44px (call lines, text links, area and city tags, modal skip links).
- Focus is a visible 3px amber outline at 2px offset plus a 5px ink box-shadow halo on every focusable element, so the ring clears 3:1 on white sheets (ink) and on graphite (amber).
- Motion respects prefers-reduced-motion: the scan pass is removed and the nav underline stops animating.

## Do's and Don'ts

### Do:
- **Do** set every figure as a condensed tabular readout with its unit (75% width, 700, tnum).
- **Do** use amber only for the action, the measured outline, the measured HUD state and focus; put ink text on it. Never use it as a headline highlight.
- **Do** mark wet or failing with the 135-degree red hatch (2px in 8px), and dry with grey or blue.
- **Do** open or close each dark run with one 4px thermal strip.
- **Do** join panels with shared 1px hairlines and zero gap; hover by darkening the border to ink.
- **Do** set section headings left on a 1px ink top rule, title and dek side by side.
- **Do** keep corners square (0px) and controls at 2px.
- **Do** keep graphite grounds solid.
- **Do** remove the scan pass under prefers-reduced-motion and keep targets at 44px.

### Don't:
- **Don't** add icon-card grids or tinted icon discs; use spec rows, procedure strips, schedules and ledgers.
- **Don't** put the thermal scale bar or legend keys on the satellite map; it is not thermal imagery.
- **Don't** add a decorative grid or pattern to graphite grounds.
- **Don't** add scroll-reveal or entrance animation; the scan pass is the only authored motion.
- **Don't** cast shadows from cards, buttons or panels; only the white sheet on graphite lifts.
- **Don't** set figures as oversized hero stats with captions.
- **Don't** use amber as text on paper (2.09:1); use amber ink instead.
- **Don't** return to the category default of a stock-photo hero, blue gradient and check-mark benefit list.
