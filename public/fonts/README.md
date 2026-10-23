# Brand fonts

Drop the licensed Eden House font files here (.woff2 preferred, .woff or .otf/.ttf also fine).

Once the files are in, they get wired up in `src/app/layout.js` with `next/font/local`,
replacing the Google Fonts fallbacks (Bodoni Moda and Hanken Grotesk).
The CSS variables `--font-display` and `--font-sans` stay the same, so no other file changes.
