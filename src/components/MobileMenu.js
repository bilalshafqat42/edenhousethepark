"use client";

import { useEffect, useRef, useState } from "react";
import InlineText from "@/components/InlineText";

// Menu for screens up to 1000px, where the header links are hidden.
export default function MobileMenu({
  links,
  ctaLabel,
  ctaHref = "#contact",
  menuLabel = "Menu",
  openLabel = "Open menu",
  closeLabel = "Close menu",
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector("a")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-toggle"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true" className={open ? "menu-toggle__icon is-open" : "menu-toggle__icon"} />
      </button>

      <nav
        id="mobile-menu"
        ref={panelRef}
        className={open ? "mobile-menu is-open" : "mobile-menu"}
        aria-label={menuLabel}
        hidden={!open}
      >
        <ul>
          {links.map((item, i) => (
            <li key={`${item.href}-${i}`}>
              <a href={item.href} onClick={() => setOpen(false)}><InlineText value={item.label} inLink /></a>
            </li>
          ))}
        </ul>
        <a href={ctaHref} className="btn btn--fill" onClick={() => setOpen(false)}><InlineText value={ctaLabel} inLink /></a>
      </nav>
    </>
  );
}
