"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import InlineText from "@/components/InlineText";
import { gsap } from "@/lib/gsap";
import { Draggable } from "gsap/Draggable";
import { fillTokens } from "@/lib/fill-tokens";

gsap.registerPlugin(Draggable);

// A long, thin arrow pointing right; the previous button mirrors it in CSS.
function LongArrow() {
  return (
    <svg width="56" height="14" viewBox="0 0 56 14" fill="none" aria-hidden="true" focusable="false">
      <path d="M0 7h54M48 1l6 6-6 6" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

/*
 * Amenities: a looping row of cards. The current card starts at the page
 * margin; the cards cut off at either edge are darkened, with a long arrow
 * on each (below the row on phones).
 *
 * The cards are rendered three times (the outer two sets are hidden
 * copies), so the row never runs out. After each move the position quietly
 * jumps back into the middle set.
 *
 * Drag or swipe the row, click a cut-off card, use the arrows or the
 * keyboard's arrow keys.
 *
 * items: [{ src, alt, title, text }] (resolved by the page from the panel)
 */
export default function AmenitiesCarousel({
  items,
  label,
  hint = "Use the left and right arrow keys to move.",
  positionLabel = "{n} of {total}",
  previousLabel = "Previous slide",
  nextLabel = "Next slide",
}) {
  const n = items.length;
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const indexRef = useRef(n);
  const goToRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const cards = () => track.children;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // x that puts card k at the page margin
    const xFor = (k) => -(cards()[k].offsetLeft - cards()[0].offsetLeft);
    const step = () => cards()[1].offsetLeft - cards()[0].offsetLeft;
    const nearest = (x) => Math.max(0, Math.min(3 * n - 1, Math.round(-x / step())));

    // With the row at x: dim the cards cut off by either edge, and centre
    // each arrow on the cut-off strip at its side, level with the images.
    const layout = (x) => {
      const vw = viewport.clientWidth;
      let firstFull = null;
      let lastFull = null;
      for (const card of cards()) {
        const left = card.offsetLeft + x;
        const right = left + card.offsetWidth;
        const full = left >= -1 && right <= vw + 1;
        card.classList.toggle("is-dim", !full && right > 0 && left < vw);
        if (full) { firstFull ??= left; lastFull = right; }
      }
      const gap = step() - cards()[0].offsetWidth;
      const img = cards()[0].querySelector(".amenity__img");
      viewport.style.setProperty("--arrow-y", `${img.offsetHeight / 2}px`);
      if (firstFull !== null) {
        // Centre of each cut-off strip, kept far enough in that the whole
        // arrow (56px) stays on screen when a strip is very narrow
        const inside = (x) => Math.min(vw - 36, Math.max(36, x));
        viewport.style.setProperty("--arrow-l", `${inside(Math.max(0, firstFull - gap) / 2)}px`);
        viewport.style.setProperty("--arrow-r", `${inside(lastFull + gap + (vw - lastFull - gap) / 2)}px`);
      }
    };

    const goTo = (k) => {
      k = Math.max(0, Math.min(3 * n - 1, k));
      indexRef.current = k;
      layout(xFor(k));
      gsap.to(track, {
        x: xFor(k), duration: reduced ? 0 : 0.75, ease: "power3.inOut", overwrite: true,
        onComplete: () => {
          // Back into the middle set, at the same visual position
          if (k < n || k >= 2 * n) {
            indexRef.current = k < n ? k + n : k - n;
            gsap.set(track, { x: xFor(indexRef.current) });
            layout(xFor(indexRef.current));
          }
        },
      });
    };
    goToRef.current = goTo;

    gsap.set(track, { x: xFor(indexRef.current) });
    layout(xFor(indexRef.current));

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
      // A click (no drag) on a cut-off card moves the row towards it
      onClick(e) {
        const card = e.target.closest?.(".amenity");
        if (!card?.classList.contains("is-dim")) return;
        const k = Array.prototype.indexOf.call(cards(), card);
        goTo(indexRef.current + (k < indexRef.current ? -1 : 1));
      },
      // Only a real sideways drag stops a move in progress; a vertical
      // swipe that starts on the row (to scroll the page) must not.
      onDrag() { if (sideways(this)) gsap.killTweensOf(track); },
      onDragEnd() {
        // Not a sideways drag: carry on to (or stay on) the current card
        if (!sideways(this)) { goTo(indexRef.current); return; }
        // A flick moves at least one card in its direction
        const moved = this.x - xFor(indexRef.current);
        if (Math.abs(moved) < 40) { goTo(indexRef.current); return; }
        const target = nearest(this.x);
        goTo(target === indexRef.current ? indexRef.current + (moved < 0 ? 1 : -1) : target);
      },
    });

    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(indexRef.current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(indexRef.current - 1); }
    };
    viewport.addEventListener("keydown", onKey);

    const onResize = () => { gsap.set(track, { x: xFor(indexRef.current) }); layout(xFor(indexRef.current)); };
    window.addEventListener("resize", onResize);

    return () => {
      goToRef.current = null;
      drag.kill();
      gsap.killTweensOf(track);
      viewport.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [n]);

  const copies = [0, 1, 2].flatMap((copy) => items.map((item, i) => ({ ...item, copy, i })));

  return (
    <div
      className="amenities__viewport"
      ref={viewportRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={[label, hint].filter(Boolean).join(". ")}
    >
      <ul className="amenities__track" ref={trackRef}>
        {copies.map((item) => {
          const clone = item.copy !== 1;
          return (
            <li
              className="amenity"
              key={`${item.copy}-${item.i}`}
              aria-hidden={clone || undefined}
              aria-roledescription={clone ? undefined : "slide"}
              aria-label={clone ? undefined : fillTokens(positionLabel, { n: item.i + 1, total: n })}
            >
              <div className="amenity__img">
                <Image src={item.src} alt={clone ? "" : item.alt} fill sizes="(max-width: 600px) 84vw, (max-width: 1440px) 600px, 42vw" draggable={false} />
              </div>
              <h3 className="amenity__title"><InlineText value={item.title} /></h3>
              {item.text && <p className="amenity__text"><InlineText value={item.text} /></p>}
            </li>
          );
        })}
      </ul>
      <div className="amenities__nav">
        <button type="button" className="place__arrow amenities__arrow amenities__arrow--prev" aria-label={previousLabel} onClick={() => goToRef.current?.(indexRef.current - 1)}>
          <LongArrow />
        </button>
        <button type="button" className="place__arrow amenities__arrow amenities__arrow--next" aria-label={nextLabel} onClick={() => goToRef.current?.(indexRef.current + 1)}>
          <LongArrow />
        </button>
      </div>
    </div>
  );
}
