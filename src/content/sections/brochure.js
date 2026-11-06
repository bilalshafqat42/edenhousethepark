/*
 * The brochure behind both "Download Brochure" buttons (Payment Plan and
 * About). Upload the PDF here or paste its link. Left blank, the buttons
 * stay and take the visitor to the contact form instead.
 */
export const BROCHURE_FIELDS = [
  {
    key: "url",
    label: "Brochure PDF",
    type: "LINK",
    helperText: "Upload a PDF or paste an https:// link. Blank: the buttons go to the contact form.",
    defaultValue: "",
  },
];
