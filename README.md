# Offcut — curated product store concept

A static, mobile-first storefront concept for a small collection of everyday finds.

## Files
- `index.html` — storefront, product detail modal, bag drawer, admin UI
- `styles.css` — responsive editorial design
- `app.js` — catalogue rendering, search, filters, bag, and local admin

## Preview
This project is a frontend prototype. It does not have a live payment provider, order backend, supplier integration, or newsletter service.

### Catalogue admin
Use **Catalogue admin** in the footer to add, edit, delete, or reset products. The current prototype stores catalogue changes in the current browser's `localStorage`. Image uploads are compressed and stored locally in that same browser. This is useful for testing the interface, but changes are not shared with other visitors and can be lost if browser storage is cleared.

Before launch, connect a shared database and private admin authentication, validate uploaded files on the server, and implement secure checkout, order handling, privacy information, and verified supplier/delivery details. Never place private API keys in frontend code.

## Deploying a static preview
The site can be served as static files. To publish with GitHub Pages, open the repository's **Settings → Pages** and choose the `main` branch and `/(root)` as the source. Static hosting does not make the catalogue shared or enable checkout.

## Design references
The visual direction takes broad inspiration from real editorial ecommerce patterns: restrained type, product-first imagery, useful category navigation, and clear product information. It is not a copy of another brand's assets or layout.
