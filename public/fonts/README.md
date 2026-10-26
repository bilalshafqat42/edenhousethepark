# Brand fonts

Source files for the Eden House brand fonts. They are not deployed:
`.gitignore` keeps everything in this folder except this note out of git.

The site loads only the weights the identity guidelines call for, from
`public/webfonts/`, declared by name with `@font-face` at the top of
`src/app/globals.css` (no system fallback fonts):

| Role | Font | Weights |
|---|---|---|
| Headlines, pull quotes, figures | Ivy Presto Display | Light 300, Regular 400 |
| Body, titles, labels | Beausite Classic | Light 300, Regular 400, Medium 500 |
| Arabic text (chat) | The Sans Arabic | Semi Light 300, Plain 400, Semi Bold 500 |

Ivy Presto Display and The Sans Arabic were converted from .otf to .woff2.
To add a weight, convert it into `public/webfonts/` and add an `@font-face`
rule for it in `globals.css`.
