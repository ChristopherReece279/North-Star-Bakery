# North Star Bakery Touchstone 3

This is the same four-page North Star Bakery website created for Touchstone Task 2, with a shared external stylesheet and small markup additions for Flexbox grouping. The original page content, media, navigation paths, and form fields remain present.

The `dist` directory contains the four HTML files, `styles.css`, and all supplied media. There is no JavaScript or build dependency. The four CSS colors are cream `#FFF8F0`, brown `#6B3E26`, peach `#D88C5A`, and charcoal `#2F2A26`. The two font families are Georgia and Arial, with generic browser fallbacks.

Base rules stack content for narrow screens. A `min-width: 48rem` media query introduces Flexbox columns, and `min-width: 68rem` increases spacing. Controls remain at least 44 CSS pixels tall. The picture element continues to select a wide featured image at 700px and above.

## Open in GitHub Codespaces

Create a public GitHub repository, upload this project's contents, and open the repository in Codespaces. Open `dist/index.html` with the IDE's preview feature. If you use a server, serve the `dist` directory and use the forwarded-port preview URL. Copy the actual public repository URL and working IDE preview URL into the Word template. No GitHub repository URL has been generated in this package.

The form demonstrates native HTML validation. It has no order-processing backend, accepts no payments, and sends no bakery request.

## Review before submission

Check all four pages at approximately 375px, 768px, and 1440px. Confirm readable text, keyboard focus, navigation, responsive images, media playback, form labels, and native validation. A real browser screenshot is required in the submission document. Source checks and contrast calculations do not replace browser testing.
