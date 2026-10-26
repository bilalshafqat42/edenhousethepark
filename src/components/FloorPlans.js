"use client";

import { useState } from "react";

const PLANS = {
  "2 Bedroom": {
    heading: "Two Bedroom",
    rows: [
      ["Suite Area", "1,477 – 1,500 SQ.FT."],
      ["Balcony Area", "435 – 461 SQ.FT."],
      ["Total Area", "1,933 – 1,961 SQ.FT."],
    ],
    text: "Two-bedroom apartments with open living and dining space, a private balcony and park views.",
  },
  // No total area row: it is unconfirmed. Do not calculate or estimate it.
  "3 Bedroom": {
    heading: "Three Bedroom",
    rows: [
      ["Suite Area", "1,782 – 1,855 SQ.FT."],
      ["Outdoor Area", "501 – 2,142 SQ.FT."],
    ],
    text: "Three-bedroom apartments with a maid's room, private outdoor space and skyline, park or canal views, depending on the unit.",
  },
};

export default function FloorPlans() {
  const [tab, setTab] = useState("2 Bedroom");
  const plan = PLANS[tab];

  return (
    <>
      <div className="tabs" role="group" aria-label="Choose a layout">
        {Object.keys(PLANS).map((key) => (
          <button
            key={key}
            type="button"
            className="tab"
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="spec" aria-live="polite">
        <h3 className="h3">{plan.heading}</h3>
        <dl>
          {plan.rows.map(([label, value]) => (
            <div key={label}>
              <dt className="label">{label}</dt>
              <dd className="figure">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="body">{plan.text}</p>
        <a href="#contact" className="btn btn--fill">View Floor Plan Samples</a>
      </div>
    </>
  );
}
