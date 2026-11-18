// The page shown for an address that does not exist (404), in the Privacy page's frame.
export const NOT_FOUND_FIELDS = [
  { key: "title", label: "Heading", type: "TEXT", defaultValue: "Page Not Found" },
  {
    key: "body",
    label: "Text",
    type: "TEXT",
    long: true,
    defaultValue: "The page you are looking for does not exist or has moved.",
  },
  { key: "home-label", label: "Button label (back to the home page)", type: "TEXT", defaultValue: "Back To The Home Page" },
];
