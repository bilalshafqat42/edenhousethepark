"use client";

import { useCallback, useEffect, useRef } from "react";
import ContactForm from "@/components/ContactForm";
import InlineText from "@/components/InlineText";
import { gsap } from "@/lib/gsap";

/*
 * "Enquire Now": opens the enquiry form in a pop-up. Built on the native
 * <dialog> (focus stays inside, Esc closes, the page behind is inert), with
 * GSAP fading it in and out. A click on the dark backdrop also closes it.
 */
export default function EnquiryDialog({ buttonLabel, title, formContent, closeLabel = "Close" }) {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const panelRef = useRef(null);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const open = () => {
    const dialog = dialogRef.current;
    dialog.showModal();
    document.documentElement.classList.add("is-modal-open");
    // Opacity only on the <dialog> itself: a GSAP transform on it makes GSAP
    // re-attach the element to measure it, which drops it out of the modal
    // top layer (focus and Esc stop working). The slide is on the panel.
    const d = reduced() ? 0 : 0.35;
    gsap.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: d, ease: "power2.out" });
    gsap.fromTo(panelRef.current, { y: 16 }, { y: 0, duration: d, ease: "power2.out" });
  };

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    gsap.to(dialog, {
      opacity: 0, duration: reduced() ? 0 : 0.2, ease: "power1.in",
      onComplete: () => dialog.close(),
    });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    // Esc: animate out instead of the instant native close
    const onCancel = (e) => { e.preventDefault(); close(); };
    const onClose = () => {
      document.documentElement.classList.remove("is-modal-open");
      openerRef.current?.focus(); // back to "Enquire Now"
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
    };
  }, [close]);

  return (
    <>
      <button type="button" className="btn register__btn" ref={openerRef} onClick={open} aria-haspopup="dialog">
        <InlineText value={buttonLabel} inLink />
      </button>
      <dialog
        ref={dialogRef}
        className="enquiry"
        aria-labelledby="enquiry-title"
        // A click on the backdrop (the dialog element itself) closes it
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div className="enquiry__panel" ref={panelRef}>
          <button type="button" className="enquiry__close" onClick={close} aria-label={closeLabel}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
          <h2 className="display-40 enquiry__title" id="enquiry-title"><InlineText value={title} /></h2>
          <ContactForm content={formContent} />
        </div>
      </dialog>
    </>
  );
}
