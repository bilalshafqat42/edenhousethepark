/*
 * The page title and description, and what WhatsApp, LinkedIn and others
 * show when a link is shared. The canonical address comes from SITE_URL.
 */
export const SEO_FIELDS = [
  { key: "meta-title", label: "Page title", type: "TEXT", defaultValue: "Eden House The Park by Refine | Low-Rise Living On The Canal" },
  { key: "meta-description", label: "Page description", type: "TEXT", long: true, defaultValue: "Low-Rise Residences On The Dubai Water Canal, Developed By H&H" },
  {
    key: "og-title",
    label: "Share title (blank: the page title)",
    type: "TEXT",
    defaultValue: "",
  },
  {
    key: "og-description",
    label: "Share description (blank: the page description)",
    type: "TEXT",
    long: true,
    defaultValue: "",
  },
  {
    key: "og-image",
    label: "Share image",
    type: "IMAGE",
    helperText: "1200×630px JPEG or PNG. Blank: no image in share previews. WhatsApp keeps an old preview for a while; share the link to yourself once after changing it.",
    defaultValue: "",
  },
];
