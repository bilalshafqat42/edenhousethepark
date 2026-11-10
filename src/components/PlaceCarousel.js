"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Draggable } from "gsap/Draggable";
import InlineText from "@/components/InlineText";
import { fillTokens } from "@/lib/fill-tokens";

gsap.registerPlugin(Draggable);

/*
 * "A Considered Sense Of Place": a looping, draggable carousel with the
 * active slide centred and its neighbours peeking in at the sides.
 *
 * The slides are rendered three times (the outer two sets are hidden
 * copies), so dragging left or right never runs out. After each move the
 * position quietly jumps back into the middle set.
 */
export default function PlaceCarousel({
  slides,
  label = "Renders of Eden House The Park",
  hint = "Use the left and right arrow keys to move.",
  positionLabel = "{n} of {total}",
  announcement = "Slide {n} of {total}",
}) {
  const n = slides.length;
  const start = n + 1; // second slide of the middle set, as in the design
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const indexRef = useRef(start);
  const [active, setActive] = useState(start % n);
  const firstCaption = useRef(true);

  // Captions: the active slide's fades up, the others fade out
  useEffect(() => {
    const track = trackRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const captions = gsap.utils.toArray(".place__caption", track);
    const current = gsap.utils.toArray(".place__slide.is-active .place__caption", track);
    if (firstCaption.current) { firstCaption.current = false; return; }
    // Slides without a caption give empty lists; GSAP warns on those, so skip.
    const others = captions.filter((c) => !current.includes(c));
    if (others.length) gsap.to(others, { autoAlpha: 0, y: 10, duration: 0.3, overwrite: true });
    if (!current.length) return;
    gsap.fromTo(current, { autoAlpha: 0, y: 10 }, {
      autoAlpha: 1, y: 0, duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.35, ease: "power2.out", overwrite: true,
    });
  }, [active]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Distance from one slide to the next, and the x that centres slide k
    const step = () => track.children[1].offsetLeft - track.children[0].offsetLeft;
    const xFor = (k) => (viewport.clientWidth - track.children[0].offsetWidth) / 2 - k * step();

    const goTo = (k, onDone) => {
      k = Math.max(0, Math.min(3 * n - 1, k));
      indexRef.current = k;
      setActive(k % n);
      gsap.to(track, {
        x: xFor(k), duration: reduced ? 0 : 0.75, ease: "power3.inOut", overwrite: true,
        onComplete: () => {
          // Back into the middle set, at the same visual position
          if (k < n || k >= 2 * n) {
            indexRef.current = k < n ? k + n : k - n;
            gsap.set(track, { x: xFor(indexRef.current) });
          }
          onDone?.();
        },
      });
    };

    gsap.set(track, { x: xFor(indexRef.current) });

    // A drag counts only when the finger or mouse moved more across than
    // down; a vertical swipe that starts on the row is the page scrolling.
    let pressX = 0;
    let pressY = 0;
    const sideways = (d) => {
      const dx = Math.abs(d.pointerX - pressX);
      const dy = Math.abs(d.pointerY - pressY);
      return dx > 8 && dx > dy;
    };

    const [drag] = Draggable.create(track, {
      type: "x",
      allowNativeTouchScrolling: true, // vertical swipes still scroll the page
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() { pressX = this.pointerX; pressY = this.pointerY; },
      // Only a real sideways drag stops a slide in progress; a vertical
      // swipe that starts on the row (to scroll the page) must not.
      onDrag() { if (sideways(this)) gsap.killTweensOf(track); },
      onDragEnd() {
        // Not a sideways drag: carry on to (or stay on) the current slide
        if (!sideways(this)) { goTo(indexRef.current); return; }
        const moved = this.x - xFor(indexRef.current);
        const count = Math.max(1, Math.round(Math.abs(moved) / step()));
        const by = Math.abs(moved) > 50 ? (moved < 0 ? count : -count) : 0;
        goTo(indexRef.current + by);
      },
    });

    // Arrow keys when the carousel has focus
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(indexRef.current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(indexRef.current - 1); }
    };
    viewport.addEventListener("keydown", onKey);

    const onResize = () => gsap.set(track, { x: xFor(indexRef.current) });
    window.addEventListener("resize", onResize);


    return () => {
      drag.kill();
      gsap.killTweensOf(track);
      viewport.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [n]);

  const copies = [0, 1, 2].flatMap((copy) => slides.map((slide, i) => ({ ...slide, copy, i })));

  return (
    <div
      className="place__viewport"
      ref={viewportRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={[label, hint].filter(Boolean).join(". ")}
    >
      <ul className="place__track" ref={trackRef} style={{ "--start": start }}>
        {copies.map((s) => {
          const clone = s.copy !== 1;
          return (
            <li
              key={`${s.copy}-${s.i}`}
              className={`place__slide${s.i === active ? " is-active" : ""}`}
              aria-hidden={clone || undefined}
              aria-roledescription={clone ? undefined : "slide"}
              aria-label={clone ? undefined : fillTokens(positionLabel, { n: s.i + 1, total: n })}
            >
              <Image
                src={s.src}
                alt={clone ? "" : s.alt}
                fill
                sizes="(max-width: 600px) 84vw, 53vw"
                style={s.position ? { objectPosition: s.position } : undefined}
                draggable={false}
              />
              {s.title && (
                <div className="place__caption">
                  <p className="place__caption-title"><InlineText value={s.title} /></p>
                  {s.text && <p className="place__caption-text"><InlineText value={s.text} /></p>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">
        {`${fillTokens(announcement, { n: active + 1, total: n })}${slides[active].titlePlain ? `: ${slides[active].titlePlain}` : ""}`}
      </p>
    </div>
  );
}
