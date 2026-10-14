# Offcut — Yazonistore storefront

A multi-page, mobile-responsive storefront concept. The catalogue intentionally starts empty: there are no invented sample products or fake supplier claims.

## Pages
- `index.html` — homepage
- `shop.html` — catalogue, category filters, search, and sorting
- `product.html?id=PRODUCT_ID` — dedicated product-detail page
- `bag.html` — shopping bag and subtotal preview
- `about.html` — brand approach and product-selection criteria
- `admin.html` — local catalogue management
- `styles.css` — shared responsive design system
- `app.js` — shared browser-side catalogue and bag behavior

## Current limitations
The admin catalogue is stored in the current browser's local storage. It is not shared across visitors or devices, and this prototype has no secure admin login. The shopping bag is also browser-local. Checkout does not process payments, create orders, or contact suppliers. The image URLs used for the editorial page are design photography, not product listings.

Before taking real orders, connect a shared database and authenticated admin, set up secure image storage, choose and verify suppliers, confirm shipping and return terms, and integrate a payment provider with server-side order handling. Do not put private keys in browser JavaScript.

## Static preview
On GitHub, go to **Settings → Pages** and publish the `main` branch from `/(root)`. Every page is a separate HTML file and links to the others through ordinary navigation.
