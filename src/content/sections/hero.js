// The first screen: full-width render below the header, centred headline, call to action.
export const HERO_FIELDS = [
  { key: "image", label: "Background image", type: "IMAGE", helperText: "Landscape, at least 2400px wide.", defaultValue: "/images/renders/hero-aerial-canal.jpg" },
  {
    key: "image-alt",
    label: "Background image description (alt text)",
    type: "TEXT",
    defaultValue: "Aerial view of the Eden House The Park buildings along the Dubai Water Canal",
  },
  { key: "title", label: "Headline", type: "TEXT", defaultValue: "Homes Along The Dubai Water Canal" },
  { key: "body", label: "Text under the headline", type: "TEXT", defaultValue: "Seven Low-Rise Buildings Beside Al Safa Park, Developed By H&H." },
  { key: "cta-label", label: "Button label", type: "TEXT", defaultValue: "Get Prices & Floor Plans" },
  { key: "cta-href", label: "Button link", type: "LINK", defaultValue: "#floor-plans" },
];
