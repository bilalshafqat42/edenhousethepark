"use client";

import { useEffect, useRef, useState } from "react";

// The real component's stylesheet is tiny and also styles the stand-in
// below, so it stays a normal import; only the JavaScript is deferred.
import "react-phone-number-input/style.css";

/*
 * react-phone-number-input with its country metadata and flag set is one of
 * the heaviest pieces of JS on this page (about 130 KB compressed), and most
 * visitors never type a phone number. So it is not in the first load:
 *
 * - It starts loading when the visitor starts on the form, hovers the field
 *   or scrolls it into view, so it is normally ready before anyone reaches
 *   the phone number.
 * - Until then, a stand-in with the same markup and class names is shown.
 *   The stand-in is a real, typeable input: on iPhone the keyboard opens on
 *   the first tap (focus moved after an async load does not open it), and
 *   if the library fails to load at all, the form still works.
 * - The real component replaces the stand-in only while the stand-in is not
 *   focused, so a visitor is never interrupted mid-typing. The value lives
 *   in the parent form either way.
 * - A failed load is forgotten, so the next attempt retries instead of
 *   staying stuck. The mobile-number check (src/lib/phone-check.js) is
 *   preloaded with it, so submitting does not wait on a download.
 *
 * Props are passed straight through to react-phone-number-input once loaded.
 */
let loadPromise = null;
function loadPhoneInput() {
  loadPromise ??= Promise.all([
    import("react-phone-number-input"),
    import("react-phone-number-input/flags"),
    import("@/lib/phone-check"),
  ])
    .then(([mod, flagsMod]) => ({ PhoneInput: mod.default, flags: flagsMod.default }))
    .catch((error) => {
      loadPromise = null;
      throw error;
    });
  return loadPromise;
}

const DEFAULT_CALLING_CODES = { AE: "971" };

/*
 * The UAE flag, drawn inline so the stand-in shows a real flag from the
 * first paint instead of an empty box (country-flag-icons' own AE.svg).
 * The full flag set still arrives with the real component.
 */
function UaeFlag() {
  return (
    <svg
      className="PhoneInputCountryIconImg"
      viewBox="0 0 513 342"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#FFF" d="M0 0h513v342H0z" />
      <path fill="#00843d" d="M0 0h513v114H0z" />
      <path d="M0 228h513v114H0z" />
      <path fill="#c8102e" d="M0 0h171v342H0z" />
    </svg>
  );
}

export default function PhoneField(props) {
  const { className, value, placeholder, id, defaultCountry = "AE", disabled, onChange } = props;
  const [loaded, setLoaded] = useState(null);
  const [standInFocused, setStandInFocused] = useState(false);
  const wrapperRef = useRef(null);

  function load() {
    loadPhoneInput().then(setLoaded, () => {});
  }

  /*
   * Start loading as soon as the visitor starts on this form (focus or tap
   * anywhere in it), or when the field is actually on screen. "Actually":
   * the pop-up form is mounted all the time, hidden over the whole
   * viewport, and a plain IntersectionObserver would count it as visible
   * and load the library for every visitor.
   */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const form = el.closest("form");
    form?.addEventListener("focusin", load, { once: true });
    form?.addEventListener("pointerdown", load, { once: true });

    let observer;
    if (typeof IntersectionObserver !== "undefined" && typeof el.checkVisibility === "function") {
      observer = new IntersectionObserver(
        (entries) => {
          const shown = entries.some(
            (entry) =>
              entry.isIntersecting &&
              el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }),
          );
          if (shown) {
            observer.disconnect();
            load();
          }
        },
        { rootMargin: "300px 0px" },
      );
      observer.observe(el);
    }

    return () => {
      observer?.disconnect();
      form?.removeEventListener("focusin", load);
      form?.removeEventListener("pointerdown", load);
    };
  }, []);

  if (loaded && !standInFocused) {
    const { PhoneInput, flags } = loaded;
    return <PhoneInput {...props} flags={flags} />;
  }

  const prefix = DEFAULT_CALLING_CODES[defaultCountry];
  const shown = value || (props.international && prefix ? `+${prefix}` : "");

  return (
    <div
      ref={wrapperRef}
      className={["PhoneInput", className].filter(Boolean).join(" ")}
      onPointerEnter={load}
    >
      <div className="PhoneInputCountry" aria-hidden="true">
        <div className="PhoneInputCountryIcon PhoneInputCountryIcon--border">
          {defaultCountry === "AE" ? <UaeFlag /> : null}
        </div>
        <div className="PhoneInputCountrySelectArrow" />
      </div>
      <input
        id={id}
        name={props.name}
        type="tel"
        inputMode="tel"
        className="PhoneInputInput"
        value={shown}
        placeholder={placeholder}
        autoComplete="tel"
        disabled={disabled}
        required={props.required}
        aria-label={props["aria-label"]}
        aria-invalid={props["aria-invalid"]}
        aria-describedby={props["aria-describedby"]}
        onFocus={() => {
          setStandInFocused(true);
          load();
        }}
        onBlur={() => setStandInFocused(false)}
        onChange={(event) => {
          // Keep it in the same shape the real component emits: "+" and digits.
          const digits = event.target.value.replace(/[^\d+]/g, "");
          onChange?.(digits.startsWith("+") ? digits : digits ? `+${digits}` : "");
        }}
      />
    </div>
  );
}
