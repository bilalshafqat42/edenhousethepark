/*
 * Google Tag Manager container ID: the panel's SEO & Sharing field first,
 * then NEXT_PUBLIC_GTM_ID. Anything that is not a GTM-XXXX ID gives "",
 * and "" loads nothing at all.
 *
 * Pure, no dependencies.
 */
const GTM_ID = /^GTM-[A-Z0-9]{4,12}$/;

export function gtmId(panelValue, env = process.env) {
  for (const candidate of [panelValue, env.NEXT_PUBLIC_GTM_ID]) {
    const id = String(candidate ?? "").trim().toUpperCase();
    if (GTM_ID.test(id)) return id;
  }
  return "";
}

export const gtmScriptUrl = (id) => `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
