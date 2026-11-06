"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import InlineText from "@/components/InlineText";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

/*
 * Amenities: a row of cards that starts at the page margin and runs off the
 * right edge.
 *
 * Tablet and desktop: the section pins when it reaches the screen and each
 * scroll moves the row on by one card. After the last card the page carries
 * on scrolling to the next section. Arrow keys step through the same stops.
 *
 * Phones, or with reduced motion on: no scroll hijacking. Drag or swipe the
 * row instead; it settles on the nearest card and stops at the first and last.
 *
 * items: [{ src, alt, title, text }] (resolved by the page from the panel)
 */
const PINNED = "(min-width: 601px) and (prefers-reduced-motion: no-preference)";
const FREE = "(max-width: 600px), (prefers-reduced-motion: reduce)";

export default function AmenitiesCarousel({ items, label }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const section = viewport.closest("section") ?? viewport;
    const header = document.querySelector("[data-header]");

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
    /** Distinct resting positions, as scroll progress 0..1 (cards near the end share one). */
    const stops = () => {
      const range = minX();
      if (range === 0) return [0];
      const all = [...track.children].map((_, i) => xFor(i) / range);
      return all.filter((p, i) => i === 0 || p - all[i - 1] > 0.001);
    };

    const mm = gsap.matchMedia();

    // ---- Tablet and desktop: pinned, scroll-driven ----
    mm.add(PINNED, () => {
      const headerH = () => header?.offsetHeight ?? 0;

      const tween = gsap.to(track, {
        x: () => minX(),
        ease: "none",
        scrollTrigger: {
          // Pin the section with the row of cards centred in the space below
          // the header; the heading scrolls up out of view if there's no room.
          trigger: viewport,
          start: () => `center center+=${headerH() / 2}`,
          // About 70% of a screen of scrolling per card
          end: () => `+=${Math.max(1, stops().length - 1) * window.innerHeight * 0.7}`,
          pin: section,
          scrub: 0.6,
          invalidateOnRefresh: true,
          snap: {
            // Ignore GSAP's momentum prediction (it skips cards on a hard
            // scroll) and step from where the row actually is.
            inertia: false,
            snapTo: () => {
              const value = tween.scrollTrigger.progress;
              const list = stops();
              const dir = tween.scrollTrigger.direction;
              // One scroll gesture moves one card in the direction travelled
              const ahead = dir > 0 ? list.find((p) => p >= value - 0.001) : [...list].reverse().find((p) => p <= value + 0.001);
              return ahead ?? gsap.utils.snap(list, value);
            },
            duration: { min: 0.35, max: 0.8 },
            delay: 0.05,
            ease: "power3.inOut",
          },
        },
      });
      const st = tween.scrollTrigger;

      const onKey = (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const list = stops();
        const now = gsap.utils.snap(list, st.progress);
        const i = Math.max(0, Math.min(list.length - 1, list.indexOf(now) + (e.key === "ArrowRight" ? 1 : -1)));
        gsap.to(window, { scrollTo: st.start + list[i] * (st.end - st.start), duration: 0.7, ease: "power3.out", overwrite: true });
      };
      viewport.addEventListener("keydown", onKey);

      // Sections below moved down by the pin: recalculate their triggers.
      ScrollTrigger.refresh();

      return () => {
        viewport.removeEventListener("keydown", onKey);
      };
    });

    // ---- Phones and reduced motion: drag or swipe ----
    mm.add(FREE, () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nearest = (x) => {
        let best = 0;
        for (let i = 0; i < track.children.length; i++) {
          if (Math.abs(xFor(i) - x) < Math.abs(xFor(best) - x)) best = i;
        }
        return best;
      };
      let index = 0;
      const goTo = (i) => {
        index = Math.max(0, Math.min(track.children.length - 1, i));
        gsap.to(track, { x: xFor(index), duration: reduced ? 0 : 0.7, ease: "power3.out", overwrite: true });
      };

      const [drag] = Draggable.create(track, {
        type: "x",
        bounds: { minX: minX(), maxX: 0 },
        edgeResistance: 0.85,
        allowNativeTouchScrolling: true,
        cursor: "grab",
        activeCursor: "grabbing",
        onPress() { gsap.killTweensOf(track); },
        onDragEnd() {
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
        gsap.set(track, { x: xFor(index) });
      };
      window.addEventListener("resize", onResize);

      return () => {
        drag.kill();
        gsap.killTweensOf(track);
        gsap.set(track, { x: 0 });
        viewport.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
      };
    });

    return () => mm.revert();
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
