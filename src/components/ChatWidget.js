"use client";

import { useEffect, useRef, useState } from "react";

const PROMPTS = [
  "Reach Out To Us",
  "Let Us Know How We Can Help You",
  "Text Us",
  "Talk to Us",
];

const ANSWERS = ["Buyer / Investor", "Broker / Agent"];

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Shell only. Not connected to a chat provider yet.
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [prompt, setPrompt] = useState(0);
  const [paused, setPaused] = useState(false);
  const panelRef = useRef(null);
  const launcherRef = useRef(null);

  // Rotate the floating prompt. Stops on hover or focus, while the panel
  // is open, and when reduced motion is set.
  useEffect(() => {
    if (open || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setPrompt((p) => (p + 1) % PROMPTS.length), 4000);
    return () => clearInterval(id);
  }, [open, paused]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel.querySelector(FOCUSABLE)?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  return (
    <div className="chat">
      {open && (
        <div
          ref={panelRef}
          className="chat__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
        >
          <div className="chat__head">
            <div>
              <p id="chat-title" className="chat__name">Eden House The Park</p>
              <p className="label chat__by">by Refine</p>
              <p className="label chat__status"><span aria-hidden="true" />We Are Online</p>
            </div>
            <button type="button" className="chat__close" aria-label="Close chat" onClick={close}>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m1 1 10 10M11 1 1 11" stroke="currentColor" /></svg>
            </button>
          </div>
          <div className="chat__body">
            <p className="chat__msg body-sm">Hi there, thanks for visiting Eden House The Park by Refine.</p>
            <p className="chat__msg body-sm">{"Answer a few quick questions and I'll get you the floor plans, the payment plan and a direct line to our team."}</p>
            <p className="chat__msg body-sm">{"I'm here as a…"}</p>
            <div className="chat__answers" role="group" aria-label="I'm here as a">
              {ANSWERS.map((a) => (
                <button
                  key={a}
                  type="button"
                  className="btn btn--line"
                  aria-pressed={answer === a}
                  onClick={() => setAnswer(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          className="chat__prompt"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {PROMPTS[prompt]}
        </button>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="chat__launcher"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? (
          <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true"><path d="m1 1 10 10M11 1 1 11" stroke="currentColor" /></svg>
        ) : (
          <svg width="22" height="20" viewBox="0 0 22 20" aria-hidden="true"><path d="M1 1h20v13H8l-5 4v-4H1z" fill="none" stroke="currentColor" /></svg>
        )}
      </button>
    </div>
  );
}
