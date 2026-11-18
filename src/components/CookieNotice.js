"use client";

import { useEffect, useRef, useState } from "react";
import InlineText from "@/components/InlineText";
import { readConsent, saveConsent } from "@/lib/consent";

/*
 * The cookie bar. It is in the server-rendered HTML, and shown before the
 * first paint by COOKIE_BAR_BOOT_SCRIPT (src/lib/consent.js), which puts
 * has-cookie-bar on <html> when no choice is stored; globals.css shows
 * .cookie only then. Once hydrated, the bar is removed for a visitor who
 * has already chosen. The footer "Manage Cookies" link reopens it, and
 * keyboard focus goes back to that link when it closes.
 * "Choose" stores "custom" for now. It should open the Oceara preferences
 * panel once that component is ported.
 */
export default function CookieNotice({ content = {} }) {
  // Rendered on the server; hidden by CSS unless <html> has has-cookie-bar
  const [open, setOpen] = useState(true);
  const barRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    // Storage is only readable in the browser, after mount
    const frame = requestAnimationFrame(() => {
      if (readConsent()) setOpen(false);
    });

    const onManage = (e) => {
      const opener = e.target.closest("[data-manage-cookies]");
      if (!opener) return;
      e.preventDefault();
      openerRef.current = opener;
      setOpen(true);
      requestAnimationFrame(() => barRef.current?.querySelector("button")?.focus());
    };
    document.addEventListener("click", onManage);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onManage);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("has-cookie-bar", open);
  }, [open]);

  const close = () => {
    setOpen(false);
    // Back to "Manage Cookies" when the bar was opened from it
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener?.isConnected) requestAnimationFrame(() => opener.focus());
  };

  const choose = (value) => {
    saveConsent(value);
    close();
  };

  if (!open) return null;

  return (
    <section
      ref={barRef}
      className="cookie"
      aria-labelledby="cookie-title"
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <div className="container cookie__inner">
        <h2 id="cookie-title" className="h3 cookie__title"><InlineText value={content.title ?? "Your Privacy"} /></h2>
        <div className="btn-row">
          <button type="button" className="btn btn--line" onClick={() => choose("custom")}><InlineText value={content["choose-label"] ?? "Choose"} inLink /></button>
          <button type="button" className="btn btn--line" onClick={() => choose("essential")}><InlineText value={content["reject-label"] ?? "Reject non-essential"} inLink /></button>
          <button type="button" className="btn btn--fill" onClick={() => choose("all")}><InlineText value={content["accept-label"] ?? "Accept"} inLink /></button>
        </div>
      </div>
    </section>
  );
}
