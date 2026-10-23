"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// All content is visible in the server-rendered HTML. Animations only run
// once GSAP has loaded and reduced motion is off, and every reveal plays
// once, so nothing is left hidden waiting for a trigger.
export default function Motion() {
  useEffect(() => {
    const header = document.querySelector("[data-header]");
    const progress = document.querySelector("[data-progress]");

    // Sticky header hairline and scroll progress bar
    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle("is-scrolled", y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const once = (trigger, start = "top 88%") => ({ trigger, start, once: true });

      // Page load: hero
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-line]", { yPercent: 112, duration: 0.95, stagger: 0.09 })
        .from("[data-hero-eyebrow]", { opacity: 0, x: -10, duration: 0.6 }, 0.2)
        .from("[data-hero-body]", { opacity: 0, y: 14, duration: 0.7 }, 0.45)
        .from("[data-hero-btn]", { opacity: 0, y: 14, duration: 0.7 }, 0.55)
        .from("[data-hero-img]", { opacity: 0, y: 20, duration: 1.1 }, 0.3);

      gsap.utils.toArray('[data-reveal="eyebrow"]').forEach((el) => {
        gsap.from(el, { opacity: 0, x: -10, duration: 0.6, ease: "power2.out", scrollTrigger: once(el) });
      });
      gsap.utils.toArray('[data-reveal="heading"]').forEach((el) => {
        gsap.from(el, { opacity: 0, y: 20, duration: 0.8, ease: "power3.out", scrollTrigger: once(el) });
      });
      gsap.utils.toArray('[data-reveal="body"]').forEach((el) => {
        gsap.from(el, { opacity: 0, y: 14, duration: 0.7, ease: "power2.out", scrollTrigger: once(el) });
      });
      gsap.utils.toArray("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          opacity: 0, y: 18, duration: 0.7, stagger: 0.05, ease: "power2.out",
          scrollTrigger: once(el, "top 90%"),
        });
      });

      // Pull quote, word by word on scrub
      const quote = document.querySelector("[data-quote]");
      if (quote) {
        gsap.fromTo(
          quote.querySelectorAll(".word"),
          { opacity: 0.14 },
          {
            opacity: 1, stagger: 0.1, ease: "none",
            scrollTrigger: { trigger: quote, start: "top 85%", end: "top 45%", scrub: 0.6 },
          }
        );
      }

      // Count up 459, 30 and 70
      gsap.utils.toArray("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const counter = { n: 0 };
        gsap.to(counter, {
          n: target, duration: 1.3, ease: "power2.out",
          scrollTrigger: once(el, "top 92%"),
          onUpdate: () => { el.textContent = Math.round(counter.n); },
          onComplete: () => { el.textContent = target; },
        });
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      mm.revert();
    };
  }, []);

  return null;
}
