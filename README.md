# Yazonistore

Premium, minimal general-store starter with a Supabase-backed admin workspace and manual Trend Radar.

## Included
- Responsive storefront; no fake sample products
- Supabase email/password admin sign-in
- Product create/edit/delete and publish/draft controls
- Manual trend research records with source URL, observed views, checked date, supplier + shipping cost, target price, notes and status
- Estimated gross margin calculation (not net profit)
- SQL schema and Row Level Security policies

## Setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/setup.sql`.
3. In Supabase Authentication, create an administrator user. Copy the user's UUID and run:
   ```sql
   insert into public.profiles (id, role) values ('YOUR_AUTH_USER_UUID', 'admin')
   on conflict (id) do update set role = 'admin';
   ```
4. In Supabase API settings, copy the project URL and public publishable key (or legacy anon key) into `config.js`:
   ```js
   window.STORE_CONFIG = {
     supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
     supabasePublishableKey: "YOUR_PUBLIC_PUBLISHABLE_KEY"
   };
   ```
   Never put a service_role/secret key in browser code. Keep RLS enabled.
5. Enable GitHub Pages in repository Settings → Pages → deploy from the `main` branch, root folder.
6. Add the deployed GitHub Pages URL to Supabase Auth's allowed site/redirect URLs if required.
7. Test public product reads and admin-only writes in separate sessions.

## Trend Radar data honesty
This is a manual research queue, not a TikTok scraper. Enter sources you have checked, include the source link and date, and leave view counts blank if not verified. Views are not proof of product sales. Add only approved APIs or data sources in accordance with their terms.

## Not implemented
- Checkout/payment processing
- Supplier ordering, fulfilment, or shipment tracking integration
- Automatic stock sync
- Automatic TikTok trend collection
- Order/customer database

Do not accept orders until checkout, server-side payment verification, fulfilment, consumer terms, privacy, returns and applicable Swedish/EU business and tax requirements are addressed. A public catalogue alone is not a working ecommerce checkout.

## Margin math
Estimated gross margin = retail price − supplier + shipping cost. This excludes payment fees, refunds, taxes, advertising and other costs.