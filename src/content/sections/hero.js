// The first screen: full-bleed render, centred headline, call to action.
// The key figures along its bottom come from Project Features.
export const HERO_FIELDS = [
  { key: "image", label: "Background image", type: "IMAGE", helperText: "Landscape, at least 2400px wide.", defaultValue: "/images/renders/hero-aerial-canal.jpg" },
  {
    key: "image-alt",
    label: "Background image description (alt text)",
    type: "TEXT",
    defaultValue: "Aerial view of the Eden House The Park buildings along the Dubai Water Canal",
  },
  { key: "title", label: "Headline", type: "TEXT", defaultValue: "Life, Set Around A Park On The Canal" },
  { key: "body", label: "Text under the headline", type: "TEXT", defaultValue: "Low-Rise Residences On The Dubai Water Canal, Developed By H&H" },
  { key: "cta-label", label: "Button label", type: "TEXT", defaultValue: "Get Prices & Floor Plans" },
  { key: "cta-href", label: "Button link", type: "LINK", defaultValue: "#floor-plans" },
];
