"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";
import InlineText from "@/components/InlineText";

gsap.registerPlugin(Draggable, Observer);

/*
 * "A Considered Sense Of Place": a looping, draggable carousel with the
 * active slide centred and its neighbours peeking in at the sides.
 *
 * The slides are rendered three times (the outer two sets are hidden
 * copies), so dragging left or right never runs out. After each move the
 * position quietly jumps back into the middle set.
 *
 * Scrolling down into the carousel holds the page for one gesture and moves
 * it on by one slide; the next scroll carries on down the page. Scrolling
 * up passes through normally. Off for reduced motion.
 */
export default function PlaceCarousel({ slides }) {
  const n = slides.length;
  const start = n + 1; // second slide of the middle set, as in the design
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const indexRef = useRef(start);
  const [active, setActive] = useState(start % n);

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
        x: xFor(k), duration: reduced ? 0 : 0.9, ease: "power3.inOut", overwrite: true,
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

    const [drag] = Draggable.create(track, {
      type: "x",
      allowNativeTouchScrolling: true, // vertical swipes still scroll the page
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() { gsap.killTweensOf(track); },
      onDragEnd() {
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

    // Scroll step: one slide on the way down, then the page carries on.
    let lastInput = 0;
    let lastTouch = 0;
    let linkUntil = 0;
    let armed = true;
    let locked = false;
    let busy = false;
    let lockY = 0;
    const markInput = () => { lastInput = performance.now(); };
    const markTouch = () => { lastInput = lastTouch = performance.now(); };
    // A menu or button link scrolling the page is not a scroll gesture
    const markLink = (e) => { if (e.target.closest?.('a[href^="#"]')) linkUntil = performance.now() + 2000; };
    window.addEventListener("wheel", markInput, { passive: true });
    window.addEventListener("touchmove", markTouch, { passive: true });
    window.addEventListener("touchend", markTouch, { passive: true });
    document.addEventListener("click", markLink, true);

    // A real wheel turn, or a swipe whose momentum is still carrying the page
    const fromGesture = () => {
      const now = performance.now();
      if (now < linkUntil) return false;
      return now - lastInput < 250 || now - lastTouch < 1500;
    };

    const root = document.documentElement;
    const release = () => {
      locked = false; busy = false; gate.disable();
      root.style.removeProperty("overflow");
    };
    // Wait for trackpad momentum to settle so the gesture that moved the
    // slide does not also scroll the page.
    const releaseWhenQuiet = () => {
      if (performance.now() - lastInput > 220) release();
      else setTimeout(releaseWhenQuiet, 60);
    };

    const gate = Observer.create({
      target: window,
      type: "wheel,touch",
      tolerance: 10,
      preventDefault: true,
      onChangeY: (self) => {
        if (!locked || busy) return;
        // A wheel turned down, or a finger swiped up, means "scroll down"
        const down = self.event.type === "wheel" ? self.deltaY > 0 : self.deltaY < 0;
        if (down) {
          busy = true;
          goTo(indexRef.current + 1, () => setTimeout(releaseWhenQuiet, 150));
        } else {
          release();
        }
      },
    });
    gate.disable();

    // Arrow keys, Page Down or a link moving the page also let it go
    const onScroll = () => { if (locked && Math.abs(window.scrollY - lockY) > 40) release(); };
    window.addEventListener("scroll", onScroll, { passive: true });

    const trigger = reduced ? null : ScrollTrigger.create({
      trigger: viewport,
      start: "center 56%",
      onEnter: (self) => {
        // Only for a real wheel or swipe, not a menu link passing through
        if (!armed || !fromGesture()) return;
        armed = false;
        locked = true;
        // One pixel past the start, so ScrollTrigger does not read it as
        // having scrolled back above the carousel.
        lockY = self.start + 1;
        // On touch screens, stop the swipe's momentum where the carousel sits
        if (performance.now() - lastTouch < 1500) root.style.overflow = "hidden";
        window.scrollTo({ top: lockY, behavior: "instant" });
        gate.enable();
      },
      onLeaveBack: () => { armed = true; release(); },
    });

    return () => {
      trigger?.kill();
      gate.kill();
      drag.kill();
      gsap.killTweensOf(track);
      viewport.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", markInput);
      window.removeEventListener("touchmove", markTouch);
      window.removeEventListener("touchend", markTouch);
      document.removeEventListener("click", markLink, true);
      root.style.removeProperty("overflow");
      window.removeEventListener("scroll", onScroll);
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
      aria-label="Renders of Eden House The Park. Use the left and right arrow keys to move."
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
              aria-label={clone ? undefined : `${s.i + 1} of ${n}`}
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
        {`Slide ${active + 1} of ${n}${slides[active].titlePlain ? `: ${slides[active].titlePlain}` : ""}`}
      </p>
    </div>
  );
}
