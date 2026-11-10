/*
 * Small labels shared by the image viewer, the enquiry popup and the three
 * carousels. Most are read out by screen readers only and are not seen on
 * screen. {n}, {total} and {title} are filled in on the page.
 */
export const LABELS_FIELDS = [
  { key: "close-label", label: "Close buttons (image viewer and enquiry form; screen readers)", type: "TEXT", defaultValue: "Close" },
  { key: "previous-image-label", label: "Image viewer: previous button (screen readers)", type: "TEXT", defaultValue: "Previous image" },
  { key: "next-image-label", label: "Image viewer: next button (screen readers)", type: "TEXT", defaultValue: "Next image" },
  { key: "previous-slide-label", label: "Carousels: previous arrow (screen readers)", type: "TEXT", defaultValue: "Previous slide" },
  { key: "next-slide-label", label: "Carousels: next arrow (screen readers)", type: "TEXT", defaultValue: "Next slide" },
  {
    key: "carousel-hint",
    label: "Carousels: how to move with the keyboard (screen readers)",
    type: "TEXT",
    defaultValue: "Use the left and right arrow keys to move.",
  },
  {
    key: "slide-position",
    label: "Carousels: each slide's position (screen readers; {n} and {total} are filled in)",
    type: "TEXT",
    defaultValue: "{n} of {total}",
  },
  {
    key: "slide-announcement",
    label: "Carousels: read out when the slide changes ({n}, {total}; the slide's caption title follows when it has one)",
    type: "TEXT",
    defaultValue: "Slide {n} of {total}",
  },
];
