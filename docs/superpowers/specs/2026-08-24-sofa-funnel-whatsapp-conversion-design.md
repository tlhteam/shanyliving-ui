# Sofa Funnel: No-Price / WhatsApp-Quote Conversion Swap

## Context

Shany Living's leadership has directed a new customer journey, documented in
`Shany Living – Mobile Customer Journey.md` and visualized in
`Shany Living Customer Journey.jpeg` (both supplied by the user, not in this
repo). The core rule: **never display a final sofa price publicly**, and
route every high-intent customer to a WhatsApp conversation with a sales
advisor, who provides the personal quote and, later, a secure payment link.
The site's job is discovery + configuration + a clean handoff — not
transacting.

A codebase audit (see prior conversation) found the app is a hybrid: the
4-step sofa customizer wizard, a phase/UTM-tracking model (`src/lib/journey.ts`),
and an admin leads page already exist in the shape the doc describes, but
every conversion surface still shows real prices and ends in "Add to Cart" —
a traditional self-serve commerce flow the doc explicitly rules out.

This is sub-project 1 of 5 identified during that audit (order agreed with
the user):

1. **This spec** — core conversion swap (no price, WhatsApp CTA, retire self-serve cart from the sofa funnel)
2. AI Room Visualization consolidation (real ShiputzAI embed vs. the fake local `setTimeout` one)
3. Admin lead pipeline — wire `admin/leads` to real submissions
4. Customer account rescoping (what self-service survives)
5. Homepage copy pass

Only #1 is in scope here.

## Goal

Across the sofa-buying path — collection grid → product page → customizer —
remove all price display and "Add to Cart" actions, and replace the primary
conversion action with a link that opens WhatsApp with a prefilled message
containing the customer's full configuration.

## Decisions (confirmed with user)

- **Rule scope:** sofa category only. Dining/bedroom/living-room/gift-cards
  keep their current Add-to-Cart behavior untouched in this pass.
- **Cart/checkout code:** left in place (`/cart`, `/checkout`, `CartDrawer`,
  `customer-commerce-store` cart logic) but unreachable from the sofa funnel —
  not deleted.
- **WhatsApp message language:** always Hebrew, regardless of the site's
  current locale — advisors work in Hebrew regardless of which of the 4
  storefront locales (he/en/fr/it) the customer was browsing in.
- **"Save Configuration":** stays a stub (existing fake-toast behavior in
  `saveDesign()`). Real persistence needs backend work and is out of scope.
- **Scope boundary on the doc's 14 steps:** this spec covers Steps 1–10
  (through the WhatsApp handoff). Steps 11–14 (consultation → quote →
  payment → confirmation) remain manual/advisor-side; no payment-link system
  is built here.

## Architecture

### New utility: `src/lib/whatsapp.ts`

Two pure functions, no backend call:

- `buildSofaQuoteMessage({ product, size, configuration, fabric, color, configId }): string` —
  returns Hebrew message text mirroring the doc's example format:

  ```
  היי שני ליווינג, התאמתי ספה באתר ואשמח לקבל מחיר ופרטים נוספים.

  דגם: {product.name}
  מידה: {size}
  קונפיגורציה: {configuration}
  בד: {fabric}
  צבע: {color}
  מזהה הגדרה: {configId}

  אשמח שתשלחו לי מחיר ופרטים.
  ```

- `buildWhatsAppUrl(number: string, message: string): string` — returns
  `https://wa.me/<digits-only number>?text=<encodeURIComponent(message)>`.

Both are pure/synchronous — easy to reuse from the collection card (product
name only), the PDP (product name only), and the customizer (full config).

**Config ID:** generated client-side once per customizer session (e.g.
`SL-` + a short random/timestamp suffix), created via `useMemo`/`useState`
on mount so it stays stable across re-renders and repeated WhatsApp clicks
within the same visit. Not persisted anywhere yet — sub-project 3 (admin
leads) is where this ID gets a real backend counterpart.

**Why not create a backend lead record at click-time:** would need a new
endpoint on the separate Laravel API (outside this repo). Better done
deliberately in sub-project 3 alongside the rest of the lead-capture wiring
than bolted on here.

### New env var

`NEXT_PUBLIC_PHONE_NUMBER` — add to `.env.example`, mirroring the existing
`NEXT_PUBLIC_WHATSAPP_NUMBER` pattern (`src/components/layout/AppHeader.tsx:46-47`).
Nothing in the repo currently has a phone number to power the doc's
"Call for Price & Details" `tel:` links.

### Fallback behavior

Follow the existing pattern in `AppHeader.tsx`/`HomeExperience.tsx`: if
`NEXT_PUBLIC_WHATSAPP_NUMBER` or `NEXT_PUBLIC_PHONE_NUMBER` is unset (e.g.
local dev without `.env.local`), CTAs fall back to linking to `/contact`
instead of `wa.me`/`tel:`, rather than rendering a dead or disabled button.

## Component changes

### 1. Collection grid — `ProductCard.tsx`, `ProductBuyActions.tsx`

For `product.category === "sofas"`:
- `ProductCard.tsx:40` — price line (`formatMoney`/`priceOnRequest`) becomes
  a static "Custom Made" label.
- `ProductBuyActions.tsx` (compact mode, lines 39-51) — the cart-adding
  button becomes a plain "View & Customize" `Link` to `/sofas/{slug}`
  (already the card's own link target). No cart interaction, no
  `useCustomerCommerceStore` call, no admin-role guard needed (navigation
  isn't a transaction).
- Non-sofa categories: `ProductCard`/`ProductBuyActions` unchanged.

### 2. Product detail page — `ProductDetailHero.tsx`

For sofa products (this page is closer to the doc than the audit implied —
`Customize` and `See It In My Room` links already exist at lines 526-543):

- Price block (lines 406-425, the `"From ₪X"` / `priceOnRequest` branch) →
  static copy: *"Custom pricing based on your selected size and
  configuration."*
- `ProductBuyActions` (line 521, Add to Cart) — removed for sofas.
- `Customize` link (line 527-534) — promoted to the primary solid button in
  that slot.
- `See It In My Room` link (line 535-542) — stays as secondary, unchanged.
- Tertiary row (replacing the `hasPrice ? ctaNote : askShowroom` block at
  lines 545-555): `WhatsApp for Details` (prefilled with just the product
  name via `buildSofaQuoteMessage` called with only `product` — a lighter
  "I'm interested in X" message, not the full config since customization
  hasn't happened yet) and `Call for Price & Details` (`tel:` link using
  `NEXT_PUBLIC_PHONE_NUMBER`).
- The `data-shiputzai-product`/`data-shiputzai-button-slot` hooks (lines
  368-371, 524) are left untouched — that's the ShiputzAI embed's
  integration surface, owned by sub-project 2.
- Non-sofa categories: unchanged.

### 3. Customizer — `SofaStepConfigurator.tsx`

- Remove `finalPrice` (line 93) and `formatPrice` (line 57) and their
  rendering — the "Total Price" panel appears in the mobile step-4 view
  (lines 413-417) **and** persistently across all 4 steps in the desktop
  aside (lines 506-513). Both replaced with the doc's static reassurance
  copy: *"Every sofa is made specifically for you — get your exact price
  from a Shany Living advisor."*
- Remove `addDesignToCart` (lines 95-109) and its three call sites (mobile
  review line 418, desktop review line 519, AI-room-result screen line 316)
  — replaced by one new `openWhatsAppQuote()` handler that builds the
  message from the existing `summaryRows` array (lines 164-169, already
  exactly Model/Size/Configuration/Fabric/Color — no reshaping needed) plus
  the session's `configId`, via `buildSofaQuoteMessage` +
  `buildWhatsAppUrl`, and opens it in a new tab.
- `Save Design` / `Share Design` buttons: unchanged (stub, per decision above).
- Add a `Call for Price & Details` link next to them on the review step
  (doc §20 — visible on the configuration review page).
- `See It In My Room (AI)` entry point (`setRoomMode(true)`): unchanged —
  owned by sub-project 2. Only its terminal CTA (line 316, "Add to Cart")
  changes to the same `openWhatsAppQuote()` handler.
- `size`/`configuration`/`fabric`/`color` state and the model/size/fabric
  pickers: unchanged — still needed to build the message.

## Data flow

```
customer configures sofa (client state: product, size, configuration, fabric, color)
        │
        ▼
review step renders summaryRows (existing) + static "ask an advisor" copy (new)
        │
        ▼ (click "Get My Quote on WhatsApp")
buildSofaQuoteMessage(config + configId) → Hebrew text
        │
        ▼
buildWhatsAppUrl(NEXT_PUBLIC_WHATSAPP_NUMBER, text) → wa.me link
        │
        ▼
window.open(url, "_blank")  (or /contact fallback if number unset)
```

No new network calls, no new backend dependency. `configId` lives only in
client memory for this pass.

## Error handling / edge cases

- Missing `NEXT_PUBLIC_WHATSAPP_NUMBER`/`NEXT_PUBLIC_PHONE_NUMBER` → fall
  back to `/contact`, matching existing header/homepage behavior.
- `product.price` remains in the data model untouched (admin, non-sofa
  categories, and the retired-but-present cart/checkout code still use it) —
  this pass only stops *rendering* it on the three sofa-funnel surfaces.
- RTL: all layout changes use existing logical Tailwind patterns
  (`grid grid-cols-2`, `gap-3`, `justify-between`) already used elsewhere in
  these files — no new physical-direction classes introduced.

## Testing / verification

No test framework is configured in this repo (confirmed during the earlier
audit). Verification is manual via `pnpm dev`:

1. Walk collection → PDP → customizer → review for a sofa product; confirm
   no price renders anywhere in that path.
2. Confirm "View & Customize" (collection), "Customize This Sofa" (PDP), and
   "Get My Quote on WhatsApp" (review) all route/link correctly.
3. Click through to WhatsApp and confirm the prefilled message is in
   Hebrew, includes the correct model/size/configuration/fabric/color, and
   includes a `configId`.
4. Confirm a non-sofa product (e.g. a dining item) still shows its price and
   Add to Cart, unchanged.
5. Spot-check RTL (default `he` locale) on all touched components.
6. Confirm behavior with `NEXT_PUBLIC_WHATSAPP_NUMBER`/`NEXT_PUBLIC_PHONE_NUMBER`
   unset (current local `.env` state) falls back to `/contact` rather than
   breaking.

## Out of scope (future sub-projects)

- AI Room Visualization consolidation (real ShiputzAI vs. fake local preview).
- Wiring `admin/leads` to real submissions / `configId` lookups.
- Customer account rescoping (`orders`, `payments` self-service pages).
- Homepage copy alignment with the doc's suggested headline/CTA wording.
- Deleting (vs. leaving dormant) the cart/checkout code, once confirmed unused.
