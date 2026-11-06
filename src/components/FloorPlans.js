"use client";

import { useState } from "react";
import InlineText from "@/components/InlineText";

// A layout's area rows (row-1-label/value ... row-4-label/value); a row with no label is skipped.
function rowsOf(plan) {
  return [1, 2, 3, 4]
    .map((n) => [plan[`row-${n}-label`], plan[`row-${n}-value`]])
    .filter(([label]) => typeof label === "string" && label.trim() !== "");
}

// Layout tabs and their area details. The layouts come from the panel's Floor Plans section.
export default function FloorPlans({ plans = [], tabsLabel, ctaLabel, ctaHref = "#contact" }) {
  const [tab, setTab] = useState(0);
  const plan = plans[tab] ?? plans[0];

  if (!plan) return null;

  return (
    <>
      <div className="tabs" role="group" aria-label={tabsLabel}>
        {plans.map((item, i) => (
          <button
            key={i}
            type="button"
            className="tab"
            aria-pressed={tab === i}
            onClick={() => setTab(i)}
          >
            <InlineText value={item.tab} inLink />
          </button>
        ))}
      </div>

      <div className="spec" aria-live="polite">
        <h3 className="h3"><InlineText value={plan.heading} /></h3>
        <dl>
          {rowsOf(plan).map(([label, value], i) => (
            <div key={i}>
              <dt className="label"><InlineText value={label} /></dt>
              <dd className="figure"><InlineText value={value} /></dd>
            </div>
          ))}
        </dl>
        <p className="body"><InlineText value={plan.text} /></p>
        <a href={ctaHref} className="btn btn--fill"><InlineText value={ctaLabel} inLink /></a>
      </div>
    </>
  );
}
