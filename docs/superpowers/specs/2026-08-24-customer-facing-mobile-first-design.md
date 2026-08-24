# Customer-Facing Mobile-First Pass

## Context

Follow-on to sub-project 1 (sofa-funnel no-price/WhatsApp swap, spec:
`2026-08-24-sofa-funnel-whatsapp-conversion-design.md`, implemented but not
yet committed at the time of this spec). The user asked to make the app
"mobile first." Scoped via brainstorming to: **customer-facing site only**
(storefront, sofa customizer, cart/checkout, auth, customer account) — admin
is explicitly out of scope. Depth: **audit + fix real gaps**, not a rebuild.

A read-only audit (fork, see prior conversation) checked 11 areas against
the boss's doc's §21 "Mobile UX Requirements" (one decision per screen,
large tap targets, primary CTA visible near the bottom, a sticky
"WHATSAPP | CALL" bar once a customer reaches a high-intent stage) plus
general mobile hygiene. Result: **most of the app is already mobile-first**
(grid layouts, header nav, customer-account drawer nav, the customizer's
step wizard all checked out clean). Two concrete gaps survived:

1. **No sticky contact bar anywhere.** A single-button WhatsApp FAB exists
   on the homepage only (`HomeExperience.tsx:313`, `fixed bottom-20 end-4`).
   The PDP and the customizer's review/AI-result screens have no persistent
   CTA — everything is inline in scrolling content, so the doc's "primary
   CTA should remain visible near the bottom of the screen" isn't met.
2. **Checkout inputs lack mobile keyboard hints.** `checkout/page.tsx`'s
   email/phone fields have no `type="email"`/`type="tel"`/`inputMode`.

Everything else audited (nav, category grids, customizer flow, customer
account nav) had no notable gaps and is untouched by this spec.

## Goal

Add a real sticky "WhatsApp | Call" bottom bar on mobile at the surfaces
the doc calls high-intent (PDP, customizer), and fix the checkout keyboard
hints. Nothing else changes.

## Architecture

### New component: `src/components/storefront/StickyContactBar.tsx`

```tsx
type StickyContactBarProps = { whatsappHref: string; phoneHref: string };
```

A fixed-bottom, mobile-only (`lg:hidden`) bar: two-up grid, WhatsApp button
(`WhatsappIcon` + `t("whatsappForDetails")`) and Call button (`SiteIcon
name="phone"` + `t("callForDetails")`) — reusing the exact translation keys
added in sub-project 1. Styled as `fixed inset-x-0 bottom-0 z-40 border-t
border-neutral-200 bg-white/95 backdrop-blur dark:border-white/10
dark:bg-neutral-950/95`, with bottom padding as
`pb-[calc(0.75rem+env(safe-area-inset-bottom))]` so it clears the iOS home
indicator, and `pt-3 px-4`.

No new data logic — both `whatsappHref`/`phoneHref` are already computed in
the consuming pages via sub-project 1's `buildWhatsAppUrl`/`buildPhoneUrl`
(`src/lib/whatsapp.ts`). The component is a pure presentational wrapper,
passed fully-formed hrefs.

### Where it renders

- **`ProductDetailHero.tsx`** — always (mobile only, via the component's
  own `lg:hidden`).
- **`SofaStepConfigurator.tsx`** — on every step (1–4) and in room mode,
  inside the existing `lg:hidden` mobile container.

### Removing the now-redundant inline mobile CTAs

To avoid showing WhatsApp/Call twice on the same mobile screen:

- **`ProductDetailHero.tsx`** — the WhatsApp/Call two-up row added in
  sub-project 1 becomes desktop-only: change its wrapper from `grid gap-3
  sm:grid-cols-2` to `hidden gap-3 lg:grid lg:grid-cols-2`. The sticky bar
  covers mobile.
- **`SofaStepConfigurator.tsx`**, step-4 mobile section — remove the two
  inline WhatsApp/Call buttons added in sub-project 1 (they're already
  inside the `lg:hidden` block, so this is a straight deletion, not a
  responsive-visibility change). Desktop's aside keeps its own inline
  WhatsApp/Call buttons, untouched.
- **Accepted tradeoff:** `roomActions` (the AI-room-result actions) is a
  single JSX value shared between the mobile and desktop room-mode layouts
  and includes its own WhatsApp button. Splitting it just to deduplicate
  one screen's WhatsApp CTA isn't worth the complexity — on mobile,
  room-result will show both the sticky bar and the inline "Get My Quote on
  WhatsApp" button. Documented here as a deliberate, minor redundancy, not
  an oversight.

### Layout adjustment

Add bottom padding to the mobile containers so the fixed bar doesn't
overlap the last piece of content: the PDP's root container and the
customizer's `mx-auto min-h-screen max-w-md px-4 py-8 lg:hidden` wrapper
(used for both the step wizard and room mode) each get extra
`pb-24`-equivalent spacing on top of their existing padding.

### Checkout keyboard fix

`checkout/page.tsx` — add `type="email"` + `inputMode="email"` to the email
field, `type="tel"` + `inputMode="tel"` to the phone field. No other checkout
changes (out of scope — cart/checkout for non-sofa categories is otherwise
fine per the audit).

## Data flow

No new data flow — `StickyContactBar` is fed hrefs already computed by its
parent page, which already exist from sub-project 1. Nothing new touches
`src/lib/whatsapp.ts`.

## Error handling / edge cases

- Same fallback as sub-project 1: if `NEXT_PUBLIC_WHATSAPP_NUMBER`/
  `NEXT_PUBLIC_PHONE_NUMBER` are unset, the hrefs already fall back to
  `/contact` — the sticky bar just renders with those fallback links, no
  special-casing needed in the new component.
- `env(safe-area-inset-bottom)` degrades gracefully to `0` on browsers that
  don't support it (older Android), so no fallback logic needed.

## Testing / verification

No test framework configured (unchanged from sub-project 1). Manual via
`pnpm dev` at a mobile viewport width:

1. PDP and each customizer step show the sticky bar; it stays pinned while
   scrolling; last content (Save/Share/Room buttons) isn't hidden behind it.
2. Desktop (`lg:` and up) shows no sticky bar; existing inline WhatsApp/Call
   buttons on PDP and the customizer's desktop aside still work.
3. WhatsApp/Call buttons in the sticky bar open the correct links (same
   content as sub-project 1's inline versions).
4. Checkout email/phone fields bring up the correct mobile keyboard
   (visually confirm `type`/`inputMode` are set — can't test actual OS
   keyboard behavior outside a real device/emulator).
5. Non-sofa checkout flow otherwise unaffected.

## Out of scope

- Admin/CRM (explicitly excluded per user).
- Any area the audit found "no notable gaps" (header/nav, footer, category
  grids, customizer step flow, customer-account nav, auth pages).
- Splitting `roomActions` to remove the one accepted CTA redundancy noted
  above.
