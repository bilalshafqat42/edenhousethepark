"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";

const R = "/images/renders";
const PLAN_PLACEHOLDER = "/images/floor-plans/placeholder.svg";

/*
 * Layout tabs. Each has its own render on the left and its own floor plan
 * samples for the viewer.
 * TODO(content): the 3 and 4 bedroom renders are stand-ins, the floor plans
 * are placeholders, and the 4 bedroom details are not supplied yet.
 */
const PLANS = [
  {
    tab: "2 Bedroom",
    heading: "Two Bedroom",
    render: { src: `${R}/bedroom.jpg`, alt: "Bedroom with an oak-panelled wall and a sculpted rug" },
    rows: [
      ["Suite Area", "1,477 – 1,500 SQ.FT."],
      ["Balcony Area", "435 – 461 SQ.FT."],
      ["Total Area", "1,933 – 1,961 SQ.FT."],
    ],
    text: "Two-bedroom apartments with open living and dining space, a private balcony and park views.",
    plans: 2,
  },
  {
    tab: "3 Bedroom",
    heading: "Three Bedroom",
    render: { src: `${R}/residents-lounge.jpg`, alt: "Lounge with seating and a long dining table" },
    // No total area row: it is unconfirmed. Do not calculate or estimate it.
    rows: [
      ["Suite Area", "1,782 – 1,855 SQ.FT."],
      ["Outdoor Area", "501 – 2,142 SQ.FT."],
    ],
    text: "Three-bedroom apartments with a maid's room, private outdoor space and skyline, park or canal views, depending on the unit.",
    plans: 2,
  },
  {
    tab: "4 Bedroom",
    heading: "Four Bedroom",
    render: { src: `${R}/marble-corridor.jpg`, alt: "Corridor with green marble walls" },
    rows: [],
    text: null,
    plans: 2,
  },
];

const floorPlansFor = (plan) =>
  Array.from({ length: plan.plans }, (_, i) => ({
    src: PLAN_PLACEHOLDER,
    alt: `${plan.heading} floor plan sample ${i + 1}`,
    caption: `${plan.heading} floor plan, sample ${i + 1}`,
  }));

const RENDERS = PLANS.map((p) => ({ ...p.render, caption: p.heading }));

/* Interiors and floor plans: render on the left, layout details on the right */
export default function FloorPlans() {
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState(null); // { images, start, label }
  const plan = PLANS[active];

  return (
    <section className="plans split-section split-section--reverse" id="floor-plans">
      <div className="split-section__media plans__media">
        {PLANS.map((p, i) => (
          <div key={p.tab} className={`plans__render${i === active ? " is-active" : ""}`} aria-hidden={i !== active}>
            <Image src={p.render.src} alt={i === active ? p.render.alt : ""} fill sizes="(max-width: 1000px) 100vw, 50vw" />
          </div>
        ))}
        <button
          type="button"
          className="plans__expand"
          aria-label="View the image full screen"
          onClick={() => setViewer({ images: RENDERS, start: active, label: "Interior renders" })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
          </svg>
        </button>
      </div>

      <div className="split-section__text plans__text">
        <p className="eyebrow" data-reveal="eyebrow">Interiors To Elevate Your Living</p>
        <h2 className="display-40" data-reveal="heading">The Comfort Of Space And Privacy</h2>
        <p className="lead plans__lead" data-reveal="body">
          Generously proportioned two-bedroom residences with private outdoor spaces and a welcoming sense of comfort.
        </p>

        <div className="tabs" role="group" aria-label="Choose a layout">
          {PLANS.map((p, i) => (
            <button key={p.tab} type="button" className="tab" aria-pressed={i === active} onClick={() => setActive(i)}>
              {p.tab}
            </button>
          ))}
        </div>

        <div className="spec" aria-live="polite">
          <h3 className="spec__title">{plan.heading}</h3>
          {plan.text && <p className="lead spec__text">{plan.text}</p>}
          {plan.rows.length > 0 && (
            <dl>
              {plan.rows.map(([label, value]) => (
                <div key={label}>
                  <dt className="label">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <button
            type="button"
            className="btn btn--fill"
            onClick={() => setViewer({ images: floorPlansFor(plan), start: 0, label: `${plan.heading} floor plans` })}
          >
            View Floor Plan Samples
          </button>
        </div>
      </div>

      {viewer && <Lightbox {...viewer} onClose={() => setViewer(null)} />}
    </section>
  );
}
