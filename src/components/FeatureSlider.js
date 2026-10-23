"use client";

import { useEffect, useRef, useState } from "react";

const SLIDES = [
  { alt: "Car-free park between the buildings", bg: "var(--green-50)" },
  { alt: "Two-bedroom living room with a private balcony", bg: "var(--stone-50)" },
  { alt: "Three-bedroom bedroom with floor-to-ceiling windows", bg: "var(--green-75)" },
  { alt: "Swimming pool within the gardens", bg: "var(--mint)" },
  { alt: "Canal promenade beside the community", bg: "var(--green-50)" },
];

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// No autoplay. Native horizontal scroll with snap, plus arrows, dots,
// mouse drag and arrow keys. Reduced motion jumps instead of sliding.
export default function FeatureSlider() {
  const trackRef = useRef(null);
  const drag = useRef(null);
  const [index, setIndex] = useState(0);

  const slideWidth = () => {
    const track = trackRef.current;
    const first = track?.children[0];
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.offsetWidth + gap;
  };

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.max(0, Math.min(SLIDES.length - 1, i));
    track.scrollTo({
      left: target * slideWidth(),
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    const onScroll = () => {
      const w = slideWidth();
      if (!w) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      setIndex(atEnd ? SLIDES.length - 1 : Math.round(track.scrollLeft / w));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
  };

  // Mouse drag. Touch already scrolls natively.
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    drag.current = { x: e.clientX, left: track.scrollLeft, moved: false };
    track.classList.add("is-dragging");
    track.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.left - dx;
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    const track = trackRef.current;
    track.classList.remove("is-dragging");
    drag.current = null;
    goTo(Math.round(track.scrollLeft / slideWidth()));
  };

  return (
    <div className="slider">
      <div
        ref={trackRef}
        className="slider__track"
        role="region"
        aria-roledescription="carousel"
        aria-label="Project images"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.alt}
            className="slot slider__slide"
            role="img"
            aria-label={s.alt}
            aria-roledescription="slide"
            style={{ backgroundColor: s.bg }}
            data-index={i}
          />
        ))}
      </div>

      <div className="slider__controls">
        <div className="slider__dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.alt}
              type="button"
              className="slider__dot"
              aria-label={`Show image ${i + 1} of ${SLIDES.length}`}
              aria-current={index === i || undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className="slider__arrows">
          <button
            type="button"
            className="slider__arrow"
            aria-label="Previous image"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M5 1 1 5l4 4M1 5h14" fill="none" stroke="currentColor" /></svg>
          </button>
          <button
            type="button"
            className="slider__arrow"
            aria-label="Next image"
            disabled={index === SLIDES.length - 1}
            onClick={() => goTo(index + 1)}
          >
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="m11 1 4 4-4 4M15 5H1" fill="none" stroke="currentColor" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
