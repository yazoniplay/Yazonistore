# Offcut — Yazonistore storefront

A multi-page, mobile-responsive storefront connected to the Supabase project **Yazoniplay Next**.

## Pages
- `index.html` — homepage and featured products
- `shop.html` — live catalogue, category filters, search, and sorting
- `product.html?id=PRODUCT_ID` — dedicated product-detail page
- `bag.html` — browser-local shopping bag and subtotal preview
- `about.html` — brand approach and product-selection criteria
- `admin.html` — protected sign-in, shared catalogue management, recent paid orders and fulfilment status
- `styles.css` — shared responsive design system
- `app.js` — Supabase client, product loading, bag behavior, and admin operations

## Supabase setup
The frontend uses the project's publishable key. This key is intended for browser use and is protected by database RLS policies. Never add a service-role or secret key to this repository.

The database contains:
- `public.products` — product name, price, category, description, image URL, featured/active flags and timestamps.
- `public.store_admins` — allowlist of Auth user IDs permitted to manage products.
- `product-images` Storage bucket — public product image delivery; uploads and changes require an approved admin.

Visitors can read active products. Only users whose Auth ID is in `store_admins` can manage the catalogue or upload product images. Create an account through `admin.html` and then add that user's Auth ID to `store_admins` (or ask the project owner to authorize the account). Creating an account alone does not grant admin rights.

## Checkout and orders
The storefront starts PayPal checkout through the `paypal-create-order` Edge Function and verifies/captures the order through `paypal-capture-order`. Completed captures are written to `public.orders` by the server using the service-role key. The service-role key must never be exposed in browser code.

The admin page shows up to 100 recent captured orders and lets approved admins update fulfilment status. The order table is protected by Row Level Security; only approved store admins can read or update order records. Confirm shipping, returns, taxes and supplier fulfilment before accepting real customer orders.

## GitHub Pages
On GitHub, go to **Settings → Pages** and publish the `main` branch from `/(root)`. All storefront sections are separate HTML pages linked through ordinary navigation.
