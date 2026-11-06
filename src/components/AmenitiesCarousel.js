"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import InlineText from "@/components/InlineText";
import { gsap } from "@/lib/gsap";
import { scrollStep } from "@/lib/scroll-step";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

/*
 * Amenities: a row of cards that starts at the page margin and runs off the
 * right edge.
 *
 * Scrolling down moves the row on by one card while the section is pinned;
 * scrolling up passes through (src/lib/scroll-step.js, shared by every
 * carousel). Drag or swipe the row, or use the arrow keys, at any size; it
 * settles on the nearest card and stops at the first and last.
 *
 * items: [{ src, alt, title, text }] (resolved by the page from the panel)
 */
export default function AmenitiesCarousel({ items, label }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // x that puts card i at the left margin, clamped so the last card ends
    // at the right margin rather than leaving empty space after it.
    const minX = () => {
      const last = track.children[track.children.length - 1];
      const end = last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(track).paddingRight);
      return Math.min(0, viewport.clientWidth - end);
    };
    const xFor = (i) => {
      const card = track.children[i];
      const first = track.children[0];
      return Math.max(minX(), Math.min(0, -(card.offsetLeft - first.offsetLeft)));
    };
    const nearest = (x) => {
      let best = 0;
      for (let i = 0; i < track.children.length; i++) {
        if (Math.abs(xFor(i) - x) < Math.abs(xFor(best) - x)) best = i;
      }
      return best;
    };
    // The last card that still moves the row (later ones share its stop)
    const lastStop = () => nearest(minX());

    let index = 0;
    const goTo = (i) => {
      index = Math.max(0, Math.min(lastStop(), i));
      gsap.to(track, { x: xFor(index), duration: reduced ? 0 : 0.75, ease: "power3.inOut", overwrite: true });
    };

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
      bounds: { minX: minX(), maxX: 0 },
      edgeResistance: 0.85,
      allowNativeTouchScrolling: true, // vertical swipes still scroll the page
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() { pressX = this.pointerX; pressY = this.pointerY; },
      // Only a real sideways drag stops a slide in progress; a vertical
      // swipe that starts on the row (to scroll the page) must not.
      onDrag() { if (sideways(this)) gsap.killTweensOf(track); },
      onDragEnd() {
        // Not a sideways drag: carry on to (or stay on) the current card
        if (!sideways(this)) { goTo(index); return; }
        // A flick moves at least one card in its direction
        const moved = this.x - xFor(index);
        if (Math.abs(moved) < 40) goTo(index);
        else {
          const target = nearest(this.x);
          goTo(target === index ? index + (moved < 0 ? 1 : -1) : target);
        }
      },
    });

    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
    };
    viewport.addEventListener("keydown", onKey);

    const onResize = () => {
      drag.applyBounds({ minX: minX(), maxX: 0 });
      index = Math.min(index, lastStop());
      gsap.set(track, { x: xFor(index) });
    };
    window.addEventListener("resize", onResize);

    // Scroll step (shared with every carousel): one card on the way down
    // while the section is pinned; nothing on the way up.
    const stopScrollStep = scrollStep({
      viewport,
      section: viewport.closest("section") ?? viewport,
      onStep: () => goTo(index + 1),
    });

    return () => {
      stopScrollStep();
      drag.kill();
      gsap.killTweensOf(track);
      viewport.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [items.length]);

  return (
    <div
      className="amenities__viewport"
      ref={viewportRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${label}. Use the left and right arrow keys to move.`}
    >
      <ul className="amenities__track" ref={trackRef} data-stagger>
        {items.map((item, i) => (
          <li className="amenity" key={i} aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
            <div className="amenity__img">
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 600px) 84vw, (max-width: 1440px) 600px, 42vw" draggable={false} />
            </div>
            <h3 className="amenity__title"><InlineText value={item.title} /></h3>
            {item.text && <p className="amenity__text"><InlineText value={item.text} /></p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
