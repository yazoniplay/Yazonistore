# AuraFlame™ storefront

A single-product storefront for the AuraFlame™ Fireplace Diffuser, served through GitHub Pages and connected to Supabase for the product catalogue and PayPal checkout.

## Pages
- `index.html` — AuraFlame landing page, interactive visual preview, features, comparison and FAQ
- `product.html` — product gallery, price, product details and add-to-bag
- `bag.html` — shopping bag and checkout
- `shipping.html` — shipping and return information
- `contact.html` — customer support page
- `admin.html` — protected catalogue and order administration
- `store.css` — shared responsive design system
- `app.js` — catalogue, bag, checkout and storefront shell

## Checkout
The storefront starts PayPal checkout through the `paypal-create-order` Edge Function and verifies/captures orders through `paypal-capture-order`. Checkout is configured in USD. Display-currency previews are estimates and do not change the PayPal charge currency.

## Product information
Claims about verified reviews, stock counts, delivery guarantees, return guarantees, noise ratings, essential-oil compatibility and safety certifications should only be added when documentation or genuine order data confirms them.

Never commit a Supabase service-role key or payment secret to this repository.