"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// All content is visible in the server-rendered HTML. Animations only run
// once GSAP has loaded and reduced motion is off, and every reveal plays
// once, so nothing is left hidden waiting for a trigger.
export default function Motion() {
  useEffect(() => {
    const header = document.querySelector("[data-header]");
    const progress = document.querySelector("[data-progress]");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Header turns frosted once the page has scrolled 40px
    const headerState = ScrollTrigger.create({
      start: 40,
      end: "max",
      onToggle: (self) => header?.classList.toggle("is-scrolled", self.isActive),
    });
    header?.classList.toggle("is-scrolled", window.scrollY > 40);

    // Scroll progress bar, smoothed slightly
    const progressBar = progress
      ? gsap.fromTo(progress, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        })
      : null;

    // In-page links (menu, buttons, skip link) glide to their section with
    // GSAP, stopping just below the sticky header.
    const onLinkClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      let id;
      try {
        id = decodeURIComponent(link.getAttribute("href").slice(1));
      } catch {
        return; // a malformed panel link: leave it to the browser
      }
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return;
      e.preventDefault();
      const offset = header?.offsetHeight ?? 0;
      // A carousel section is wrapped in GSAP's pin spacer; aim at the spacer
      // so the section lands just below the header, before its pin starts.
      const aim = target?.parentElement?.classList.contains("pin-spacer") ? target.parentElement : target;
      gsap.to(window, {
        scrollTo: { y: aim ?? 0, offsetY: aim ? offset : 0, autoKill: true },
        duration: reduced ? 0 : 1.1,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: () => {
          history.replaceState(null, "", id ? `#${id}` : location.pathname);
          // Move keyboard focus to the section, as a normal link jump does
          if (target) {
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          }
        },
      });
    };
    document.addEventListener("click", onLinkClick);

    // Flags the footer on <html> so the chat teaser steps aside over it.
    const footer = document.querySelector("footer");
    const footerObserver = footer
      ? new IntersectionObserver(([entry]) => {
          document.documentElement.toggleAttribute("data-footer-in-view", entry.isIntersecting);
        })
      : null;
    footerObserver?.observe(footer);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const once = (trigger, start = "top 88%") => ({ trigger, start, once: true });

      // Page load: the header slides down from the top, the hero render
      // settles with a slow zoom-out, then the hero copy rises in.
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("[data-header]", { yPercent: -100, opacity: 0, duration: 1, clearProps: "transform,opacity" }, 0)
        // Scale only, no fade: the render stays visible from the first paint,
        // so it counts as the page's main content straight away (LCP).
        .from("[data-hero-img]", { scale: 1.08, duration: 1.6, ease: "power2.out" }, 0)
        .from("[data-hero-line]", { yPercent: 112, duration: 0.95, stagger: 0.09 }, 0.35)
        .from("[data-hero-body]", { opacity: 0, y: 14, duration: 0.7 }, 0.75)
        .from("[data-hero-btn]", { opacity: 0, y: 14, duration: 0.7 }, 0.85);

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
      headerState.kill();
      progressBar?.scrollTrigger?.kill();
      progressBar?.kill();
      document.removeEventListener("click", onLinkClick);
      footerObserver?.disconnect();
      mm.revert();
    };
  }, []);

  return null;
}
