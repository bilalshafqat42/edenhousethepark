"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, allowsAnalytics, readConsent } from "@/lib/consent";
import { gtmScriptUrl } from "@/lib/gtm";

/*
 * Optional Google Tag Manager. Nothing is loaded without a container ID,
 * and nothing is loaded until the visitor has chosen "Accept" in the cookie
 * bar (now or on an earlier visit). Choosing it later loads GTM at once.
 * Hosts are allowed in next.config.mjs's Content-Security-Policy.
 */
export default function GoogleTagManager({ id }) {
  useEffect(() => {
    if (!id) return undefined;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.async = true;
      script.src = gtmScriptUrl(id);
      document.head.appendChild(script);
    };
    if (allowsAnalytics(readConsent())) load();
    const onConsent = (e) => {
      if (allowsAnalytics(e.detail)) load();
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, [id]);

  return null;
}
