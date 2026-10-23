"use client";

import { useEffect, useRef, useState } from "react";

const KEY = "eh-cookie-consent";

function readChoice() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function saveChoice(value) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked (private mode etc.). The bar still closes for this visit.
  }
}

// Shown on first visit only. The footer "Manage Cookies" link reopens it.
// "Choose" stores "custom" for now. It should open the Oceara preferences
// panel once that component is ported.
export default function CookieNotice() {
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    // Read after mount, since storage is not available during server render.
    const frame = requestAnimationFrame(() => {
      if (!readChoice()) setOpen(true);
    });

    const onManage = (e) => {
      if (!e.target.closest("[data-manage-cookies]")) return;
      e.preventDefault();
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

  const choose = (value) => {
    saveChoice(value);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <section
      ref={barRef}
      className="cookie"
      aria-labelledby="cookie-title"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <div className="container cookie__inner">
        <h2 id="cookie-title" className="h3 cookie__title">Your Privacy</h2>
        <div className="btn-row">
          <button type="button" className="btn btn--line" onClick={() => choose("custom")}>Choose</button>
          <button type="button" className="btn btn--line" onClick={() => choose("essential")}>Reject non-essential</button>
          <button type="button" className="btn btn--fill" onClick={() => choose("all")}>Accept</button>
        </div>
      </div>
    </section>
  );
}
