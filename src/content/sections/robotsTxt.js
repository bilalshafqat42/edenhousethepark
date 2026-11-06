/*
 * Search engine indexing, off until an admin turns it on. The staging site
 * (stg- address) is never indexed whatever this says. Link-preview bots
 * (WhatsApp, LinkedIn, Slack, Teams) are always allowed, so shared links
 * keep their preview.
 */
export const ROBOTS_FIELDS = [
  {
    key: "allow-indexing",
    label: "Allow search engines to index this site",
    type: "BOOLEAN",
    helperText: "Turn on only on the live site, once it is ready to be found on Google.",
    defaultValue: "false",
  },
];
