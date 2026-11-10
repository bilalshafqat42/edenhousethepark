"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import InlineText from "@/components/InlineText";
import Lightbox from "@/components/Lightbox";
import { gsap } from "@/lib/gsap";
import { fillTokens } from "@/lib/fill-tokens";

/*
 * Interiors and floor plans, all from the panel's Floor Plans section (the
 * page resolves images and links before passing them in). Render on the
 * left half; tabs on the right swap it. The scan icon opens the renders full
 * screen, and "View Floor Plan Samples" opens the chosen layout's plans, or
 * follows the button link when that layout has none.
 */
export default function FloorPlans({
  eyebrow,
  heading,
  body,
  tabsLabel,
  ctaLabel,
  ctaHref = "#contact",
  layouts = [],
  planCaption = "{layout} floor plan {n}",
  plansViewerLabel = "{layout} floor plans",
  expandLabel = "View the image full screen",
  rendersViewerLabel = "Interior renders",
  viewerLabels = {},
}) {
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState(null); // { images, start, label }
  const mediaRef = useRef(null);
  const specRef = useRef(null);
  const first = useRef(true);
  const layout = layouts[active] ?? layouts[0];

  // Tab change: the new render crossfades in with a slow settle, and the
  // layout details rise in. Skipped on first paint (CSS shows tab one).
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renders = gsap.utils.toArray(".plans__render", mediaRef.current);
    const d = reduced ? 0 : 1;
    renders.forEach((el, i) => {
      if (i === active) {
        gsap.set(el, { zIndex: 1 });
        gsap.fromTo(el, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.9 * d, ease: "power2.out", overwrite: true });
      } else {
        gsap.set(el, { zIndex: 0 });
        gsap.to(el, { autoAlpha: 0, duration: 0.9 * d, delay: 0.2 * d, ease: "power1.out", overwrite: true });
      }
    });
    gsap.fromTo(specRef.current.children, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1, y: 0, duration: 0.5 * d, stagger: 0.05 * d, ease: "power2.out", overwrite: true,
    });
  }, [active]);

  if (!layout) return null;

  const renders = layouts.map((l) => ({ ...l.render, caption: l.headingPlain }));
  const floorPlans = layout.plans.map((src, i) => ({
    src,
    alt: fillTokens(planCaption, { layout: layout.headingPlain, n: i + 1 }),
    caption: fillTokens(planCaption, { layout: layout.headingPlain, n: i + 1 }),
  }));

  return (
    <section className="plans split-section split-section--reverse" id="floor-plans">
      <div className="split-section__media plans__media" ref={mediaRef}>
        {layouts.map((l, i) => (
          <div key={i} className={`plans__render${i === active ? " is-active" : ""}`} aria-hidden={i !== active}>
            <Image src={l.render.src} alt={i === active ? l.render.alt : ""} fill sizes="(max-width: 1000px) 100vw, 50vw" />
          </div>
        ))}
        {/* Sticky, so the icon stays below the header while the image scrolls */}
        <div className="plans__expand-wrap">
          <button
            type="button"
            className="plans__expand"
            aria-label={expandLabel}
            onClick={() => setViewer({ images: renders, start: active, label: rendersViewerLabel })}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="split-section__text plans__text">
        <p className="eyebrow" data-reveal="eyebrow"><InlineText value={eyebrow} /></p>
        <h2 className="display-40" data-reveal="heading"><InlineText value={heading} /></h2>
        {body && <p className="lead plans__lead" data-reveal="body"><InlineText value={body} /></p>}

        <div className="tabs" role="group" aria-label={tabsLabel}>
          {layouts.map((l, i) => (
            <button key={i} type="button" className="tab" aria-pressed={i === active} onClick={() => setActive(i)}>
              <InlineText value={l.tab} inLink />
            </button>
          ))}
        </div>

        <div className="spec" aria-live="polite" ref={specRef}>
          <h3 className="spec__title"><InlineText value={layout.heading} /></h3>
          {layout.text && <p className="lead spec__text"><InlineText value={layout.text} /></p>}
          {layout.rows.length > 0 && (
            <dl>
              {layout.rows.map(([label, value], i) => (
                <div key={i}>
                  <dt className="label"><InlineText value={label} /></dt>
                  <dd><InlineText value={value} /></dd>
                </div>
              ))}
            </dl>
          )}
          {floorPlans.length > 0 ? (
            <button
              type="button"
              className="btn btn--fill"
              onClick={() => setViewer({ images: floorPlans, start: 0, label: fillTokens(plansViewerLabel, { layout: layout.headingPlain }) })}
            >
              <InlineText value={ctaLabel} inLink />
            </button>
          ) : (
            <a href={ctaHref} className="btn btn--fill"><InlineText value={ctaLabel} inLink /></a>
          )}
        </div>
      </div>

      {viewer && <Lightbox {...viewer} {...viewerLabels} onClose={() => setViewer(null)} />}
    </section>
  );
}
