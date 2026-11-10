"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";

/*
 * Full-screen image viewer: black overlay, one image at a time, previous
 * and next arrows, swipe or drag to move, close button top right.
 * Keyboard: Esc closes, left and right arrows move, Tab stays inside.
 * GSAP fades the viewer in and out and slides each image in from the side
 * it came from.
 *
 * images: [{ src, alt, caption? }]; start: index to open on.
 */
export default function Lightbox({
  images,
  start = 0,
  label,
  onClose,
  closeLabel = "Close",
  previousLabel = "Previous image",
  nextLabel = "Next image",
}) {
  const [index, setIndex] = useState(start);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const frameRef = useRef(null);
  const dragStart = useRef(null);
  const direction = useRef(0);
  const closing = useRef(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  const count = images.length;
  const image = images[index];
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const move = useCallback((by) => {
    direction.current = by;
    setIndex((i) => (i + by + count) % count);
  }, [count]);

  // Fade out, then unmount
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(dialogRef.current, {
      autoAlpha: 0, duration: reduced ? 0 : 0.25, ease: "power1.in",
      onComplete: () => onCloseRef.current(),
    });
  }, [reduced]);

  // Open: the overlay fades in. Opacity only (not autoAlpha), so the close
  // button stays focusable from the first frame.
  useEffect(() => {
    gsap.fromTo(dialogRef.current, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.3, ease: "power1.out" });
  }, [reduced]);

  // Each new image slides in from the side it came from
  useEffect(() => {
    const from = direction.current * 60;
    gsap.fromTo(frameRef.current, { autoAlpha: 0, x: from, scale: from ? 1 : 0.97 }, {
      autoAlpha: 1, x: 0, scale: 1, duration: reduced ? 0 : 0.5, ease: "power3.out", overwrite: true,
    });
  }, [index, reduced]);

  useEffect(() => {
    const opener = document.activeElement;
    const root = document.documentElement;
    root.classList.add("is-modal-open");
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "Tab") {
        // Keep focus inside the viewer
        const items = dialogRef.current.querySelectorAll("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.classList.remove("is-modal-open");
      opener?.focus?.();
    };
  }, [move, close]);

  // Swipe on touch, drag with a mouse
  const onPointerDown = (e) => { dragStart.current = e.clientX; };
  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (count > 1 && Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      className="lightbox"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      // A click on the black area (not the image or a button) closes it
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <button type="button" className="lightbox__close" ref={closeRef} onClick={close} aria-label={closeLabel}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
      </button>

      <figure
        className="lightbox__stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragStart.current = null; }}
      >
        <div className="lightbox__frame" ref={frameRef}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="90vw"
            unoptimized={image.src.endsWith(".svg")}
            draggable={false}
          />
        </div>
        <figcaption className="lightbox__caption" aria-live="polite">
          {image.caption && <span>{image.caption}</span>}
          {count > 1 && <span className="lightbox__count">{index + 1} / {count}</span>}
        </figcaption>
      </figure>

      {count > 1 && (
        <>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => move(-1)} aria-label={previousLabel}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8" /></svg>
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => move(1)} aria-label={nextLabel}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" /></svg>
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
