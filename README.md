# North Star Bakery Touchstone 4

This continues the same four-page bakery website from Touchstones 2 and 3. The HTML pages, stylesheet, JavaScript modules, and media folder are at the repository root.

## Live website

https://christopherreece279.github.io/North-Star-Bakery/

## Features

- Filter products by All products, Breads, Pastries, or Cakes.
- Save, remove, or clear a product shortlist.
- Remember favorites and the selected category using localStorage.
- Add saved products to the Contact form without replacing existing writing.
- Validate required fields, email, lengths, and pickup dates with nearby messages.

The form is a classroom demonstration. It validates locally and sends no order, payment, or personal details to a bakery. Only product IDs and the selected category are stored.

## Files

`data.mjs` defines products and field configuration. `logic.mjs` holds pure data and validation functions. `app.js` connects these functions to DOM events and browser storage. `styles.css` retains the four-color, two-font, mobile-first Flexbox design.

## Codespaces preview

Open the repository in Codespaces and serve the repository root, for example with `python3 -m http.server 8000`. Open port 8000 from the Ports panel and use its forwarded URL as the IDE preview. JavaScript modules require an HTTP preview, not a file URL. Keep the Codespace running while its preview is in use.

## Tests

Run `node test_touchstone4.mjs` to check storage normalization, save/restore logic, favorites, prefill, and validation rules. Browser interaction and actual storage must also be checked on the live website.

Business details and prices are sample content for the North Star Bakery course scenario.
