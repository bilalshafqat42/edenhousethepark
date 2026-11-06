/*
 * robots.txt's rules (src/app/robots.js), pure so they can be tested.
 *
 * Search engines are kept out unless an admin has turned indexing on in the
 * panel AND this is not the staging site. Link-preview bots (WhatsApp,
 * LinkedIn, Slack, Teams...) are always let through: they build a share
 * card, they do not index.
 */
export function robotsRules({ allowIndexing, staging, siteUrl }) {
  const indexable = allowIndexing === true && !staging;
  return {
    rules: [
      { userAgent: "*", ...(indexable ? { allow: "/" } : { disallow: "/" }) },
      {
        userAgent: [
          "facebookexternalhit",
          "WhatsApp",
          "Twitterbot",
          "LinkedInBot",
          "Slackbot",
          "TelegramBot",
          "Discordbot",
          "SkypeUriPreview",
          "MicrosoftPreview",
        ],
        allow: "/",
      },
    ],
    ...(indexable ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
