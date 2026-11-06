"use client";

import { ScrollTrigger } from "@/lib/gsap";

/*
 * The carousels' scroll step, shared by every carousel section.
 *
 * Scrolling down: a GSAP ScrollTrigger pin holds the section still for a
 * stretch of scroll while the carousel moves on by exactly one card
 * (onStep), then the page carries on to the next section. The page itself
 * never stops responding to the scroll.
 *
 * Scrolling up: the section passes through with no sideways movement. The
 * step re-arms once the section has been scrolled back above.
 *
 * In-page links (menu, buttons) that glide past are not scrolls, so they do
 * not trigger a step. Off entirely with reduced motion.
 *
 * Returns a cleanup function.
 */
export function scrollStep({ viewport, section, onStep, hold = 0.9 }) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  let linkUntil = 0;
  const markLink = (e) => {
    if (e.target.closest?.('a[href^="#"]')) linkUntil = performance.now() + 2000;
  };
  document.addEventListener("click", markLink, true);

  let armed = true;
  const trigger = ScrollTrigger.create({
    trigger: viewport,
    pin: section,
    start: "center 56%", // the carousel centred in the space below the header
    // How long it holds: long enough for the slide to finish while the
    // section stays put, with a floor so short laptop screens get the same.
    end: () => `+=${Math.round(Math.max(window.innerHeight * hold, 820))}`,
    anticipatePin: 1,
    refreshPriority: 1, // pins are measured before the triggers below them
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (!armed || self.direction !== 1 || self.progress < 0.04) return;
      armed = false;
      if (performance.now() > linkUntil) onStep();
    },
    onLeaveBack: () => { armed = true; },
  });

  // The pin adds scroll space, so every trigger is put in page order and
  // measured again.
  requestAnimationFrame(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  return () => {
    trigger.kill();
    document.removeEventListener("click", markLink, true);
  };
}
