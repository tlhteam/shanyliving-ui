# Backend Requirements Log — Sofa Customization & Lead Handoff

Compiled from a frontend audit of the sofa customization journey against the business requirement: **Shany Living sells custom-made sofas with no public pricing; every sale is closed personally by a sales advisor via WhatsApp/phone.**

**Scope boundary:** this website's journey is AD → WEBSITE → SOFA → CUSTOMIZE → VISUALIZE → WHATSAPP. Everything from WhatsApp onward — Consultation → Personal Quote → Secure Payment → Order → Production → Delivery — happens outside this website, in the advisor's own tools (WhatsApp, an external CRM, a payment processor, etc.). This log only covers what the **website itself** needs on the backend, up through the moment a customer clicks through to WhatsApp — not the sales/production process that follows.

---

## 1. Lead Capture (website-side handoff record)

**Current state:** `admin/leads` in the Next.js app reads from `src/lib/admin-data.ts`, which is 3 hardcoded mock rows (`reference`, `name`, `product`, `source`, `status`, `value`). No real submission ever reaches it. When a customer clicks a WhatsApp CTA, the only record of their configuration is the WhatsApp message text itself — nothing is persisted anywhere.

**Needed:** An endpoint the frontend can call, at the moment a customer clicks through to WhatsApp, to record that a qualified lead was handed off — for the business's own marketing/analytics visibility, not to run the sales process itself (that's the external CRM's job). Field checklist:

| Field | Status |
|---|---|
| Sofa model | ✅ available client-side (`product.slug`/`name`), never persisted |
| Size | ✅ available (`sizeSummary`), never persisted |
| Custom dimensions | ✅ available (`customSizeDetail`), never persisted |
| Configuration | ✅ available, never persisted |
| Fabric | ✅ available, never persisted |
| Color | ✅ available, never persisted |
| Uploaded room image | ⚠️ only an in-memory base64 string (`roomPhoto`) — lost on refresh; needs a real file-upload endpoint, not just a DB column |
| AI-generated room visualization | ❌ doesn't exist — blocked on item 3 |
| Configuration ID | ✅ generated client-side (`SL-XXXXX`), never persisted |
| Lead source | ⚠️ collapsed to a true/false flag today, not the actual value — see item 4 below |
| Campaign source | ❌ not captured at all — `utm_campaign` isn't read anywhere in the codebase |
| Customer contact details | ✅ captured when logged in (name/email); anonymous visitors have no contact field on-site (relies entirely on WhatsApp revealing their phone number to the advisor) |
| Date/time | ✅ available, never persisted |
| WhatsApp request status | ❌ not tracked as an event — clicking the CTA just calls `window.open()`, nothing is logged |

The admin `/admin/leads` table should read real data shaped like this instead of the mock array, as a simple **"who configured what and clicked through"** log. What happens to that lead afterward — advisor assignment, quote status, price, payment, order/production/delivery status — is tracked in the external system this website doesn't own, and intentionally isn't part of this log.

---

## 2. Saved Configuration Persistence

**Current state:** "Save Configuration" in the customizer (`SofaStepConfigurator.tsx`) just shows a success toast. Nothing is written anywhere. The customer account's "Saved Designs" page is a stub UI with no real data behind it.

**Needed:** An endpoint to persist a customer's configuration against their account, keyed by the same `configId` used in the WhatsApp message, so:
- A customer can return later and find their saved sofa design.
- An advisor can look up a `configId` in an admin dashboard and see the exact configuration, without depending only on the original WhatsApp thread.

---

## 3. Real AI Room Visualization

**Current state:** "See It In My Room – AI" in the customizer is a fake `window.setTimeout(1600ms)` — it does not composite the sofa into the uploaded photo at all; it just overlays a caption on the unmodified upload. The app already has a ShiputzAI embed wired to the Product Detail Page (`data-shiputzai-product` / `data-shiputzai-button-slot` attributes in `layout.tsx` / `ProductDetailHero.tsx`), but that integration is **not** connected to the customizer's room-upload flow.

**Needed:** Either wire the customizer to the existing ShiputzAI integration, or decide on a different image-generation vendor/API, so the uploaded room photo is actually processed and returns a real composite reflecting the selected model/fabric/color.

---

## 4. Source / Campaign Tracking (frontend-only, listed for completeness)

**Current state:** `isSocialArrival()` (`src/lib/journey.ts`) checks `utm_source`/`from`/`source` query params against a fixed list (`instagram`, `ig`, `facebook`, `fb`, `meta`) purely to decide whether to show an "Arriving from Instagram" homepage banner — it returns a boolean, not the actual source value. `utm_campaign` isn't read anywhere in the codebase. None of this is persisted or carried through to the customizer or the WhatsApp message.

**Needed:** No backend work required — just frontend plumbing:
- Capture the *actual* `utm_source`/`utm_campaign`/`utm_medium` values (not just a yes/no social flag) on landing.
- Persist them (cookie/localStorage) so they survive navigation from homepage → PDP → customizer.
- Include them in the lead payload from item 1, and ideally in the WhatsApp message itself.
- Also log a **WhatsApp-click event** (which CTA, on which page/step, with which `configId`) at the moment `openWhatsAppQuote()`/similar fires — today it's a bare `window.open()` with no record, so there's no way to know a customer attempted contact if they don't follow through in WhatsApp itself. This can piggyback on the same lead-creation call from item 1.

Flagged here only because it's part of the same "what context does the advisor have at handoff" story as the rest of this log.

---

## Priority / dependency notes

- **Item 1 (lead capture) is the foundation.** Item 2 also wants to attach data to a record keyed by `configId` — worth designing both against the same schema rather than two separate ones.
- **Item 3 (AI visualization)** is independent of the others and can be tackled in parallel once a vendor is confirmed.
- **Item 4's UTM capture/persistence is frontend-only** and can be done today. Its WhatsApp-click event logging piece depends on item 1's endpoint existing (it's meant to piggyback on the lead-creation call).

*Compiled from the Shany Living UI codebase audit — see `docs/superpowers/specs/` for the earlier frontend implementation specs this builds on.*
