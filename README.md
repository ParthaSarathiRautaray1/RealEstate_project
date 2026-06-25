# Aurum Estates

Production-ready real estate lead generation and property showcase platform built with Next.js 15, TypeScript, Tailwind CSS, Shadcn-style UI primitives, Supabase PostgreSQL/Auth, Cloudinary, Resend, Leaflet, and Vercel.

## Current Status

- GitHub: https://github.com/ParthaSarathiRautaray1/RealEstate_project
- Production: https://realestateproject-ten.vercel.app
- Vercel project: `realestate_project`
- Primary branch: `main`
- Local project path: `C:\Users\parth\OneDrive\Desktop\Real`

The app is deployed and reachable on Vercel. Supabase, Cloudinary, and Resend credentials are configured locally in `.env.local` and in Vercel production environment variables. Do not commit real credentials.

## Phases Delivered

1. Database: `supabase/schema.sql` defines admins, owners, properties, property images, YouTube videos, reviews, and leads with RLS policies and indexes.
2. Auth: `/admin/login` uses Supabase Auth and the `admins` table to restrict dashboard access.
3. Public pages: homepage, listings, detail pages, image lightbox, YouTube embeds, owner details, reviews, maps, and lead capture.
4. Admin dashboard: metrics, property CRUD, owner management, review approval/delete, lead search, and Excel export.
5. Deployment: Vercel-ready config, metadata, sitemap, robots, and environment variable documentation.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with Supabase, Cloudinary, Resend, and admin email values.

Required environment variables:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
ADMIN_EMAIL=
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Create an auth user in Supabase Auth.
4. Insert that user into `admins`:

```sql
insert into public.admins (id, email, name)
values ('AUTH_USER_UUID', 'admin@example.com', 'Admin');
```

5. Optionally run `supabase/seed.sql` for demo listings.

If Supabase warns that `schema.sql` has destructive operations, that is expected because the schema drops/recreates policies and one trigger so it can be run again safely during setup.

## Cloudinary Setup

Create a Cloudinary account and add:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The admin upload API stores assets under `real-estate/properties`. In the property form you can **drag-and-drop or pick image files** and they upload straight to Cloudinary — no need to upload elsewhere first. Pasting an existing image URL (any allowed host) is still supported as a fallback.

## Adding a Property (Admin Guide)

Open **Admin → Properties → New** and fill the form. A few fields explained:

- **Title / Slug** — the slug is the URL text for the public page (`/properties/<slug>`, e.g. `glass-house-above-the-park`). It is **auto-generated from the title**; edit it only if you want a custom URL. It must be unique.
- **Images** — drag photos onto the upload box (or click to browse). Each file uploads to Cloudinary and appears as a thumbnail; the **first image is the cover photo** (use the ↑ button to promote another image, or × to remove). You may also paste an existing image URL.
- **Location & map** — type an address in the search box and press *Search* to auto-fill latitude/longitude (via OpenStreetMap), or **click anywhere on the map** to drop the pin and drag it to fine-tune. You can still type coordinates manually.
- **YouTube video links** — paste normal links (watch, share, `youtu.be`, Shorts, live, or embed). They are converted to proper embed URLs automatically. A link that is not a valid YouTube URL is shown as a "Watch on YouTube" link instead of a broken player. Note: if a video's owner has disabled embedding, YouTube shows "Video unavailable" — that is the video's own setting.

Public pages (`/`, `/properties`, `/properties/<slug>`) read this data back from Supabase, so a saved, **published** property appears immediately.

If a field is invalid (for example a description shorter than 20 characters), the form now highlights the exact field with a message and shows a toast — it no longer fails with a generic server error.

## Form Validation & Error Handling

Every admin form and CRUD action gives the admin clear feedback instead of throwing a raw server error:

- Server actions (`lib/actions/*`) **return** a typed `FormState` (`lib/actions/form-state.ts`) of `{ status, message, fieldErrors }` instead of throwing. Validation runs through Zod with human-readable messages (`lib/validations/schemas.ts`).
- Forms use React 19 `useActionState`. On error they show **inline messages under the offending fields** plus a **toast**; the submit button shows a pending state and disables while saving.
- Covered: admin **login**, **property** create/edit + delete, **owner** create + delete, and **review** approve + delete. Destructive actions ask for confirmation first.
- Friendly database errors: a duplicate slug, missing foreign key, or check-constraint failure is translated into a readable message (for example, a taken slug is reported on the slug field).
- The public **lead form** already validates with Zod + React Hook Form and shows success/error toasts.

## Resend Setup

Create a Resend API key and set:

```env
RESEND_API_KEY=
ADMIN_EMAIL=
```

Lead submissions are saved in Supabase and emailed to `ADMIN_EMAIL`.

If Resend delivery fails, the API still saves the lead and logs the email error. For production sending, verify a domain in Resend and replace `onboarding@resend.dev` in `app/api/leads/route.ts` with a verified sender.

## Vercel Deployment

This project has already been deployed once with Vercel CLI.

Useful commands:

```bash
vercel env ls
vercel deploy --prod
```

For a fresh deployment:

1. Push the latest `main` branch to GitHub.
2. Import or link the repository in Vercel.
3. Add all variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
5. Deploy.

Current production alias:

```txt
https://realestateproject-ten.vercel.app
```

Note: after the first successful production deploy, two later CLI redeploy attempts were shown by Vercel CLI as `UNKNOWN`. The ready production deployment remains live and aliased to the URL above.

## Major Modules

- `lib/supabase/*`: browser, server, and service-role Supabase clients.
- `lib/actions/*`: server actions for admin auth and dashboard mutations.
- `app/api/leads`: public lead endpoint with Zod validation and Resend notification.
- `app/api/admin/upload`: authenticated Cloudinary upload endpoint (wired into the form's drag-and-drop uploader).
- `app/api/admin/leads/export`: Excel export endpoint using `xlsx`.
- `components/admin/image-uploader.tsx`: drag-and-drop Cloudinary uploader with thumbnails, reordering, and a paste-URL fallback.
- `components/admin/location-picker.tsx` + `location-map-inner.tsx`: address search (OpenStreetMap Nominatim) and click-to-place map that fill latitude/longitude.
- `lib/actions/form-state.ts`: shared `FormState` returned by every admin action for consistent validation/error feedback.
- `components/admin/action-button.tsx`: single-button form (delete/approve) with confirm guard and error toast.
- `components/admin/{property-form,owner-form,login-form}.tsx` + `field-error.tsx`: `useActionState` forms with inline field errors and toasts.
- `lib/utils.ts` `youtubeEmbedUrl`: normalises any YouTube URL (watch, `youtu.be`, Shorts, live, embed, bare id) into an embeddable URL, or null when invalid.
- `components/property/*`: listing cards, search, gallery, and lead form UI.
- `components/maps/property-map.tsx`: Leaflet + OpenStreetMap property map.
- `app/(public)/*`: public website routes.
- `app/admin/*`: secured admin dashboard routes.

## Design System

The interface was designed light-first, with the dark theme derived from the same token set so both modes stay consistent.

- **Typography**: `Fraunces` (an optical-size variable serif) for display headings and `Plus Jakarta Sans` for body/UI text, wired through the `--font-serif` / `--font-sans` CSS variables and exposed as Tailwind `font-serif` / `font-sans`.
- **Color tokens**: a warm-ivory canvas with a deep-emerald primary and a champagne-gold accent in light mode; the dark mode is a charcoal-green canvas with a luminous emerald and brighter gold. All values are HSL CSS variables in `app/globals.css` (`:root` for light, `.dark` for dark).
- **Theme toggle**: a working light/dark switch (`components/theme-toggle.tsx`) built on `next-themes`, with an animated Sun/Moon swap. It lives in the public header and the admin sidebar. `defaultTheme` is `light` and the choice is persisted across visits. (This replaces the previous non-functional moon icon.)
- **3D interaction**: `components/ui/tilt-card.tsx` is a reusable, mouse-follow 3D tilt wrapper (Framer Motion) with an optional light glare, used on the property cards for depth on hover.
- **Surfaces & motion**: refined glassmorphism (`.glass`), soft/glow/luxury shadow scale, gradient text, pill buttons with press feedback, and Framer Motion scroll-reveal sections.

Only presentation changed in this pass — data fetching, forms, validation, auth, and admin actions were left intact.

## Notes

The UI includes responsive layouts, light/dark themes with a working toggle, loading skeletons, empty states, hover transitions, 3D tilt cards, scroll reveal animations, SEO metadata, sitemap, and robots configuration.

Implementation notes from setup:

- `schema.sql` is re-runnable and drops existing policies before recreating them.
- The contact lead form converts empty `property_id` and `budget` values to `null`.
- The lead form shows visible success/failure feedback.
- Fonts are loaded with `next/font/google` (Fraunces + Plus Jakarta Sans) and self-hosted by Next.js at build time, so there is no Google Fonts dependency at runtime. A network connection is only needed during the build.
- Leaflet maps are loaded through a client-only dynamic wrapper for Next.js 15 compatibility.
- The property form is a client component that still submits through the `upsertProperty` server action; the image uploader and location picker write into the same `image_urls` / `latitude` / `longitude` fields, so the server action and database schema are unchanged.
- The slug auto-generates from the title for new properties but is left untouched when editing an existing property (so saved URLs stay stable).
- The property gallery (`components/property/gallery.tsx`) is an Instagram-style swipeable carousel (native touch swipe, arrows, dots, thumbnail strip) with a fullscreen lightbox that has a close button and arrow-key/swipe navigation. The lightbox sits above Leaflet's map controls (`z-[1101]` vs Leaflet's `z-index: 1000`) so the map can never overlap the photo viewer.

Verification commands:

```bash
npm run lint
npm run typecheck
npm run build
```
