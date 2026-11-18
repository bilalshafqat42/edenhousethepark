/*
 * The visitor's cookie choice, kept in localStorage by CookieNotice:
 * "all" (Accept), "essential" (Reject non-essential) or "custom" (Choose).
 * Only "all" allows analytics (GoogleTagManager.js). A change is announced
 * with the CONSENT_EVENT window event, detail = the new choice.
 */
export const CONSENT_KEY = "eh-cookie-consent";
export const CONSENT_EVENT = "eh-cookie-consent";

export function readConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function saveConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked (private mode etc.). The choice still applies to this visit.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export const allowsAnalytics = (choice) => choice === "all";

/*
 * Runs in <head> before the first paint (layout.js): with no stored choice
 * the server-rendered cookie bar is shown at once, as part of the first
 * paint, instead of appearing after the page's JavaScript has loaded (where
 * it became the page's late "largest paint" on phones). A returning visitor
 * never sees it flash. Without JavaScript the bar stays hidden, since its
 * buttons could not work.
 */
export const COOKIE_BAR_BOOT_SCRIPT = `try{if(!localStorage.getItem(${JSON.stringify(CONSENT_KEY)}))document.documentElement.classList.add("has-cookie-bar")}catch(e){document.documentElement.classList.add("has-cookie-bar")}`;
