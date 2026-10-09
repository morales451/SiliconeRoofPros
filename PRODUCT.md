# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Commercial building owners, property managers and facility directors responsible for flat or low-slope roofs on warehouses, retail and strip centers, offices, auto dealerships and similar commercial property (confirmed). They usually arrive with a leaking roof, a roof that keeps getting patched, or a full tear-off quote in hand, and they need to decide whether restoring is a credible, cheaper alternative before committing money. Homeowners and other roofing contractors are not target audiences.

Service regions: Texas (Houston metro as the home market, plus Dallas-Fort Worth, Austin and San Antonio) and southeastern Pennsylvania (Philadelphia, the Main Line, Delaware/Chester/Montgomery/Bucks counties and the Lehigh Valley).

## Product Purpose

The site is the lead engine for Silicone Roof Pros, a commercial roof restoration contractor. It has to convince a building owner that their roof can be restored rather than replaced, and then get them to make contact. Success is a contact, and the two routes are equally valuable (confirmed):

- a satellite quote request (enter an address, outline the roof on the map, submit), or
- a phone call: Texas (832) 303-3183, Pennsylvania partner Jimmy (484) 401-8586.

## Positioning

Restore, don't replace. A seamless fluid-applied coating (silicone mainly, plus acrylic and aluminum) is sprayed over the existing roof instead of tearing it off:

- no tear-off, no relocated tenants, typically 3-7 days on site;
- roughly half the cost of replacement ($3.50-$5.00 per sq ft installed for silicone against $8-$15 for tear-off and replacement);
- 10, 15 or 20-year warranties set by coating thickness, covering materials and labor, manufacturer-backed and transferable;
- restoration is generally deductible in the year it is done rather than depreciated over 39 years (always with a "confirm with your CPA" caveat);
- a satellite quote in about 60 minutes with no site visit.

The honesty claim is part of the position, not decoration: the company says when a roof should *not* be coated (an infrared scan shows saturated insulation or a bad deck) and recommends the cheaper acrylic system when it fits.

## Operating Context

- The visitor's first job on the site is usually the satellite quote widget on the homepage hero and on `quote.html`. They type an address (Google Places autocomplete), the satellite map zooms to the roof, they outline it, and they get an instant price range from the measured square footage at $3.50-$5.00 per sq ft.
- Leads arrive through Netlify Forms (`satellite-quote`, `roof-quote`, `contact`, `quick-contact`, `newsletter`) into one shared inbox. Pennsylvania form leads are not yet routed to Jimmy automatically.
- Behind the quote is a real process: aerial scan, then an on-site inspection with an infrared moisture scan, an itemised quote, cleaning and prep, coating measured with wet mil gauges, and a final walkthrough with warranty paperwork.
- In Pennsylvania, coating is applied from spring through fall (dry roof, above freezing), while inspections and quotes run all year.

## Capabilities and Constraints

- Static HTML/CSS/vanilla JS with no framework or build tooling, deployed on Netlify (`publish = "."`). `build.sh` injects `GOOGLE_MAPS_API_KEY` at deploy time and strips `.claude/` from the deploy.
- Pages: home, about, coatings comparison, process, FAQ, contact, quote, a blog index with five posts, and location pages for Houston, Dallas, Austin, San Antonio and Pennsylvania.
- Google Maps JS API with the `places` and `geometry` libraries. Google removed `DrawingManager` in v3.65, so roof outlining runs on the in-house `js/polygon-drawer.js`. `google.maps.places.Autocomplete` is closed to new Google customers but still works for this project; replacing it with `PlaceAutocompleteElement` is a known future risk.
- Map widgets show a placeholder illustration until the live map loads, then a live satellite view (it defaults to Houston), and an honest "Map Unavailable" fallback with phone numbers if Maps fails.
- CSS/JS references carry a `?v=` cache-busting query; bump it whenever those files change.
- SEO is a stated priority: keyword-led titles and H1s, JSON-LD on every page, `sitemap.xml`, `robots.txt`. Canonicals use `.html` URLs while Netlify `pretty_urls` is on and the live site serves `www.` (an open, undecided mismatch).
- The business street address is deliberately not published anywhere on the site or in structured data.
- Undecided: whether Pennsylvania pricing matches Texas pricing; whether to route Pennsylvania leads to Jimmy; the www/non-www and `.html` canonical choice.

## Brand Commitments

- Name: Silicone Roof Pros (also written SiliconeRoofPros). Contact email: siliconeroofpros@gmail.com. Logo files live in `assets/icons/` (`50-50-logoicon.png`, `small-logo.png`, `logo.png`).
- Tagline in use: "Restore, Don't Replace - Half the Cost, Warrantied Up to 20 Years."
- Voice (chosen by the owner, drawing on *How to Write Clearly*, *Made to Stick* and *Workshop Survival Guide*): plain and concrete; specific numbers over adjectives; lead with the surprising point; name the trade-offs honestly; tell the reader what they will know or be able to do; short active sentences. SEO takes priority when copy and search pull in different directions.
- Pennsylvania partner: Jimmy, introduced by first name only, with no invented biography or quotes.

## Evidence on Hand

- **Unverified proof (owner: "semi real, but nothing I can verify with someone").** This covers the customer testimonials (Marcus Rodriguez/Gulf Coast Logistics, Sandra Jenkins/Westheimer Plaza, David Thompson/Thompson Auto Group, Karen Lewis/Arboretum Business Park and the other city-page quotes), the job-count stats such as "500+ Houston Roofs Restored," the manufacturer certification badges (Gaco, GAF, Henry, TRP, Tremco, Mule-Hide) and the big-brand logo strip (FedEx, Walgreens, Walmart, Target, Home Depot, Prologis, NASA). Do not add new testimonials, counts, certifications, client logos, ratings or review schema, and do not give the existing ones more prominence, until the owner can verify them. Replacing them with verifiable proof is an open task.
- Pennsylvania has no testimonials, job counts or local photos. Do not fabricate them.
- Real material: product and process facts, pricing bands, warranty terms, five blog articles, and photos in `assets/icons/` (city skylines, a before/after roof, application and inspection shots, the infrared scan in `aerial-scan.jpg`). There is no Philadelphia photo yet.

## Product Principles

1. **Earn trust with specifics, never inflated claims.** Real numbers, real process steps and honest trade-offs persuade this audience. Unverifiable proof is a liability.
2. **Two equal doors to contact.** Every page should make both the satellite quote and a phone call easy, with the right regional number.
3. **Truthful about fit.** Saying when a roof needs replacing, or when acrylic is the better buy, is part of the product, not a disclaimer.
4. **Search visibility comes first.** Design and copy changes must not weaken titles, headings, structured data, internal links or crawlable text.
5. **Local, not generic.** Each region's page reflects its own climate and conditions and names the right contact.
