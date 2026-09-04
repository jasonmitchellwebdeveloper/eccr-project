# East Coast Car Rentals

A small Next.js app for searching vehicle availability and making a booking, built against a mocked API contract (search, book, cancel - including a conflict response if a vehicle is taken between search and booking).

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables or external services are required - everything runs against an in-memory mock data layer (see below).

## How it works

1. **Search** - pick a date range, optionally a car type and/or location, and hit Search. This pushes the criteria onto the URL as query params (`/?start_date=...&end_date=...&type=...&location=...`), so a search is shareable/bookmarkable and survives a refresh.
2. **Results** - the page reads those params and fetches `GET /api/vehicles/availability`, showing each matching vehicle with its availability for those exact dates.
3. **Book** - clicking "Book" on an available vehicle goes to `/book/[vehicleId]`, carrying the dates over. Filling in a name and submitting posts to `POST /api/bookings`.
4. **Conflict handling** - if the vehicle was booked by someone else between when you searched and when you submit, the API returns a `409` with `{ error: "vehicle_unavailable", message: "This vehicle was booked by another customer" }`, which is shown inline on the form rather than redirecting anywhere.
5. **Confirmation & cancel** - a successful booking redirects to `/bookings/[id]`, which shows the booking details and a "Cancel booking" button. Cancelling calls `DELETE /api/bookings/[id]`, flips the status, and frees the vehicle back up for those dates.

## Approach and key decisions

- **URL as the source of truth for search.** Search criteria live in the URL rather than only in component state, so results are shareable, survive a refresh, and back/forward navigation behaves the way users expect from a search page.
- **Results are fetched from the client, against a real API route.** It felt more honest to the brief's "API you don't control" framing to actually make the HTTP call rather than fake it, even though it means handling loading state myself.
- **Availability is re-checked at booking time, not trusted from the search.** `POST /api/bookings` runs the same availability check again before creating a booking, rather than trusting whatever the client last saw. That's what makes the conflict scenario real rather than simulated for show - book the same vehicle for overlapping dates twice and the second one genuinely fails.
- **In-memory mock data layer** (`src/lib/store.ts`) - a fixed fleet of vehicles plus a bookings list, standing in for a database. Bookings are stashed on `globalThis` rather than a plain module variable, specifically so they survive Next.js's dev-mode hot reload (a `let bookings = []` at module scope gets wiped on every file save in dev, which would make testing the conflict flow confusing).
- **Controlled form components.** The date range picker, car type select, and location input each just take `value`/`onChange` - they don't own their own state. The search page is the single source of truth, which is what lets the Search button read all three at once.

## Trade-offs and shortcuts

- No live-updating availability while sitting on the results page - a listing is only as fresh as when you searched, consistent with the brief's "between search and booking" framing rather than a stronger live-sync requirement.
- No optimistic UI with rollback on conflict (listed as optional bonus in the brief) - the booking form waits for the real response before showing success or the conflict message.
- No shared component library extraction (also an optional bonus) - see the note below on how I'd approach that if it were needed.
- Styling is intentionally plain/functional (shadcn primitives, no custom design system) - matches the brief's "clean and functional is enough."
- Vehicle type labels are capitalised from the raw value, with a single manual exception for "SUV" - not derived from any formatting library.

## Next.js routing and architecture

- **`/`** - the search page. A Client Component (it needs `useState` for the form fields and `useSearchParams`/`useRouter` for the URL-driven search).
- **`/book/[vehicleId]`** - a separate route for the booking form, per the brief's explicit ask for "separate routes for search and booking confirmation" rather than one client-rendered page. This one's a Server Component (reads `params`/`searchParams` directly, looks up the vehicle server-side), with just the interactive form (`BookingForm`) as a small Client Component island inside it.
- **`/bookings/[id]`** - the confirmation route, also a Server Component, with `CancelBookingButton` as its one Client Component island. Cancelling calls `router.refresh()` afterwards, which re-runs the Server Component and picks up the new status - no manual state duplication needed.
- **`/api/vehicles/availability`, `/api/bookings`, `/api/bookings/[id]`** - real Next.js Route Handlers implementing the brief's mock API contract (`GET`, `POST`, `DELETE` respectively), backed by `src/lib/store.ts`.

## Component reuse, if this were a bigger site

Right now domain components (`DatePicker`, `CarTypeSelect`, `LocationInput`, `VehicleCard`, `BookingForm`, `CancelBookingButton`) sit directly in `src/components/`, alongside the shadcn UI primitives in `src/components/ui/`. That split - generic primitives vs. domain-specific components - is already the right first boundary. For a larger site, the next step would be pulling the primitives (`ui/`) out into their own package if multiple apps needed them, and grouping the domain components by feature (e.g. `components/search/`, `components/booking/`) rather than a flat list, so a feature's components, and eventually its data-fetching logic, live together instead of being scattered by type.

## AI usage notes

I used Claude in an advisory role throughout - explaining Next.js/React APIs and patterns as I went (App Router conventions, Server vs. Client Components, `useEffect` data fetching, Tailwind's arbitrary-value and breakpoint behaviour), and talking through trade-offs before implementing anything, such as the Server Component vs. client-fetch decision for search results. I also used it to implement local testing - running the app in a browser after each feature to verify the actual behaviour (search, booking, the conflict scenario, cancellation, responsive layout at mobile and desktop widths) rather than assuming the code worked from reading it. This README itself was also drafted with Claude's help.

AI Usage on this project was relatively high as I got AI to complete various tasks from checking best practices for dealing with state to running the playwright tasks in the chrome browser to check that the results were as i expected. I'd estimate it was probably around 30% - 40%.  I also got AI to craft this README document but as is always the case when I use AI - It's not actually in control (it only thinks it is). Sometimes I dont agree with the way AI has completed something and therefore I'll either do it myself or ask/argue the point.  AI is a tool, just like we use VS Code, Chrome, Simulator and Android Studio. We must always remember the adage: "Rubbish in; Rubbish out".