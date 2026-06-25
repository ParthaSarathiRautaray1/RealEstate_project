# Aurum Estates

Production-ready real estate lead generation and property showcase platform built with Next.js 15, TypeScript, Tailwind CSS, Shadcn-style UI primitives, Supabase PostgreSQL/Auth, Cloudinary, Resend, Leaflet, and Vercel.

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

## Cloudinary Setup

Create a Cloudinary account and add:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The admin upload API stores assets under `real-estate/properties`. Admin forms also accept Cloudinary URLs line by line.

## Resend Setup

Create a Resend API key and set:

```env
RESEND_API_KEY=
ADMIN_EMAIL=
```

Lead submissions are saved in Supabase and emailed to `ADMIN_EMAIL`.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add all variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
5. Deploy.

## Major Modules

- `lib/supabase/*`: browser, server, and service-role Supabase clients.
- `lib/actions/*`: server actions for admin auth and dashboard mutations.
- `app/api/leads`: public lead endpoint with Zod validation and Resend notification.
- `app/api/admin/upload`: authenticated Cloudinary upload endpoint.
- `app/api/admin/leads/export`: Excel export endpoint using `xlsx`.
- `components/property/*`: listing cards, search, gallery, and lead form UI.
- `components/maps/property-map.tsx`: Leaflet + OpenStreetMap property map.
- `app/(public)/*`: public website routes.
- `app/admin/*`: secured admin dashboard routes.

## Notes

The UI includes responsive layouts, dark mode variables, loading skeletons, empty states, hover transitions, scroll reveal animations, SEO metadata, sitemap, and robots configuration.
