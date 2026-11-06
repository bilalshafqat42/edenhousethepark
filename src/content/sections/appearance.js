/*
 * Logos and favicon. The header and the light footer both show the dark
 * logo, drawn at the same 638:458 proportions as the supplied
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
    label: "Footer logo (dark, on the light footer)",
    type: "IMAGE",
    helperText: "SVG preferred, or a transparent PNG at least 280×204px. Shown 102px tall.",
    defaultValue: "/logo/eden-house-black.svg",
  },
  {
    key: "favicon",
    label: "Favicon (browser tab icon)",
    type: "IMAGE",
    helperText: "Square, at least 512×512px, SVG or PNG. Leave as /favicon.ico to keep the current icon.",
    defaultValue: "/favicon.ico",
  },
];
