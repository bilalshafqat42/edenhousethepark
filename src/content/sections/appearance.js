/*
 * Logos and favicon. The header shows the black logo and the footer the
 * white one, both drawn at the same 638:458 proportions as the supplied
 * SVGs; a replacement should keep that shape and a transparent background.
 */
export const APPEARANCE_FIELDS = [
  {
    key: "logo-header",
    label: "Header logo (dark, on the light header)",
    type: "IMAGE",
    helperText: "SVG preferred, or a transparent PNG at least 276×200px. Shown 69×50px.",
    defaultValue: "/logo/eden-house-black.svg",
  },
  {
    key: "logo-footer",
    label: "Footer logo (light, on the dark footer)",
    type: "IMAGE",
    helperText: "SVG preferred, or a transparent PNG at least 268×192px. Shown 96px tall.",
    defaultValue: "/logo/eden-house-white.svg",
  },
  {
    key: "favicon",
    label: "Favicon (browser tab icon)",
    type: "IMAGE",
    helperText: "Square, at least 512×512px, SVG or PNG. Leave as /favicon.ico to keep the current icon.",
    defaultValue: "/favicon.ico",
  },
];
