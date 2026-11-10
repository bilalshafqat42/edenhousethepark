import Image from "next/image";
import Chat from "@/components/Chat";
import CookieNotice from "@/components/CookieNotice";
import FloorPlans from "@/components/FloorPlans";
import InlineText from "@/components/InlineText";
import LocationExplorer from "@/components/Location/LocationExplorer";
import MobileMenu from "@/components/MobileMenu";
import Motion from "@/components/Motion";
import { chatTextFromContent } from "@/content/sections/chatText";
import { HERO_IMAGE_FALLBACK } from "@/content/sections/hero";
import { readSections } from "@/lib/page-content";
import { plainTextValues, toPlainText } from "@/lib/inline-text";
import { isExternalHref, safeHref, safeImageSrc, wholeNumber } from "@/lib/safe-url";
import PlaceCarousel from "@/components/PlaceCarousel";
import AmenitiesCarousel from "@/components/AmenitiesCarousel";
import EnquiryDialog from "@/components/EnquiryDialog";

/*
 * Every word and image on this page comes from the admin panel, through
 * getSectionContent (src/lib/page-content.js). With the panel empty or
 * unreachable, each field falls back to the snapshot and then to its default
 * in src/content/sections/*.js, which are the page's original values, so the
 * page renders exactly as it did before the panel was connected.
 *
 * Visible text renders through <InlineText> (it may hold bold, italic or a
 * link from the panel); attributes (alt, aria-label) use plain text.
 */

const DEFAULT_LOGO = "/logo/eden-house-black.svg";

// The dark logo, in the header and on the light footer.
function Logo({ ariaLabel, src, priority = false }) {
  return (
    <a href="#top" className="logo" aria-label={ariaLabel}>
      <Image src={src} alt="" width={638} height={458} priority={priority} />
    </a>
  );
}

function ImageStrip({ items, label }) {
  return (
    <section className="strip" aria-label={label}>
      {/* tabIndex: on phones the row scrolls sideways, so keyboard users must be able to reach it */}
      <div className="strip__row" data-stagger tabIndex={0}>
        {items.map((item, i) => (
          <figure key={`${item.src}-${i}`} className="strip__item" style={{ "--w": item.w }}>
            <Image src={item.src} alt={item.alt} fill sizes={`${Math.round((item.w / 1440) * 100)}vw`} />
          </figure>
        ))}
      </div>
    </section>
  );
}

// A figure that counts up from 0 (Motion.js) when the panel gives a whole number.
function CountFigure({ figure, count }) {
  const target = wholeNumber(count);
  return target !== null ? <span data-count={target}><InlineText value={figure} /></span> : <InlineText value={figure} />;
}

function BrochureLink({ href, className, label }) {
  const external = isExternalHref(href);
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <InlineText value={label} inLink />
    </a>
  );
}

const plain = (value) => toPlainText(value ?? "");
const list = (value) => (Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : []);

export default async function Home() {
  const c = await readSections([
    "navigation", "appearance", "hero", "intro", "place", "features", "imageStrips", "gallery", "interiors", "floorPlans",
    "location", "payment", "brochure", "about", "contact", "contactForm", "footer", "cookies", "labels",
    "chatAgent", "chatTextEn", "chatTextAr",
  ]);
  const { navigation: nav, hero, intro, place, features, gallery, interiors, payment, about, contact, footer } = c;

  const navLinks = list(nav.links).map((item) => ({ label: item.label, href: safeHref(item.href, "#") }));
  const headerLogo = safeImageSrc(c.appearance["logo-header"], DEFAULT_LOGO);
  const footerLogo = safeImageSrc(c.appearance["logo-footer"], DEFAULT_LOGO);
  const logoLabel = plain(nav["logo-aria-label"]);
  const showFeatures = String(features.visible) === "true";
  const featureItems = list(features.items);
  const showStrip = String(c.imageStrips.visible) === "true";
  const aboutLogo = safeImageSrc(about.logo, "");
  const strip = (items) =>
    list(items)
      .map((item) => ({ src: safeImageSrc(item.image, ""), alt: plain(item.alt), w: wholeNumber(item.width) || 316 }))
      .filter((item) => item.src);
  const brochureHref = safeHref(c.brochure.url, "#contact");
  const slidesOf = (items) => list(items)
    .map((item) => ({
      src: safeImageSrc(item.image, ""),
      alt: plain(item.alt),
      title: item.title || "",
      titlePlain: plain(item.title),
      text: item.text || "",
      position: /^[\d.]+% [\d.]+%$/.test(String(item.position ?? "").trim()) ? String(item.position).trim() : undefined,
    }))
    .filter((item) => item.src);
  const placeSlides = slidesOf(place.slides);
  const interiorSlides = slidesOf(interiors.slides);
  // Interiors and floor plans: each layout's render, area rows and plans
  // Screen-reader and viewer labels (Viewer & Carousel Labels section)
  const ui = plainTextValues(c.labels);
  const viewerLabels = {
    closeLabel: ui["close-label"],
    previousLabel: ui["previous-image-label"],
    nextLabel: ui["next-image-label"],
  };
  const carouselLabels = {
    hint: ui["carousel-hint"],
    positionLabel: ui["slide-position"],
    announcement: ui["slide-announcement"],
    previousLabel: plain(ui["previous-slide-label"]),
    nextLabel: plain(ui["next-slide-label"]),
  };
  const fp = c.floorPlans;
  const fallbackRender = safeImageSrc(fp.image, "/images/renders/bedroom.jpg");
  const floorPlans = {
    eyebrow: fp.eyebrow,
    heading: fp.heading,
    body: fp.body,
    tabsLabel: plain(fp["tabs-aria-label"]),
    ctaLabel: fp["cta-label"],
    ctaHref: safeHref(fp["cta-href"], "#contact"),
    planCaption: plain(fp["plan-caption"]),
    plansViewerLabel: plain(fp["plans-viewer-label"]),
    expandLabel: plain(fp["expand-aria-label"]),
    rendersViewerLabel: plain(fp["renders-viewer-label"]),
    viewerLabels,
    layouts: list(fp.plans).map((plan) => ({
      tab: plan.tab,
      heading: plan.heading,
      headingPlain: plain(plan.heading),
      text: plan.text || "",
      render: {
        src: safeImageSrc(plan.image, fallbackRender),
        alt: plain(plan.image ? plan["image-alt"] : fp["image-alt"]),
      },
      rows: [1, 2, 3, 4]
        .map((n) => [plan[`row-${n}-label`], plan[`row-${n}-value`]])
        .filter(([label]) => typeof label === "string" && label.trim() !== ""),
      plans: [1, 2, 3, 4].map((n) => safeImageSrc(plan[`plan-${n}-image`], "")).filter(Boolean),
    })),
  };
  const amenities = list(gallery.items)
    .map((g) => ({ src: safeImageSrc(g.image, ""), alt: plain(g.alt), title: g.title || "", text: g.text || "" }))
    .filter((g) => g.src);
  const contacts = list(contact.details).map((item) => ({ ...item, href: safeHref(item.href, "#contact") }));
  const privacyHref = safeHref(footer["privacy-href"], "/privacy");

  return (
    <>
      <a href="#main" className="skip-link"><InlineText value={nav["skip-link-label"]} inLink /></a>
      <div className="progress" aria-hidden="true" data-progress />

      <header className="header" data-header>
        <div className="container header__inner">
          <Logo ariaLabel={logoLabel} src={headerLogo} priority />
          <nav className="nav" aria-label={plain(nav["nav-aria-label"])}>
            <ul className="nav__links label">
              {navLinks.map((item, i) => (
                <li key={`${item.href}-${i}`}><a href={item.href}><InlineText value={item.label} inLink /></a></li>
              ))}
            </ul>
            <a href={safeHref(nav["cta-href"], "#contact")} className="btn btn--fill"><InlineText value={nav["cta-label"]} inLink /></a>
            <MobileMenu
              links={navLinks}
              ctaLabel={nav["cta-label"]}
              ctaHref={safeHref(nav["cta-href"], "#contact")}
              menuLabel={plain(nav["mobile-menu-aria-label"])}
              openLabel={plain(nav["menu-open-label"])}
              closeLabel={plain(nav["menu-close-label"])}
            />
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero: full-width render below the header, centred copy in the lower part */}
        <section className="hero" id="top" data-hero>
          <div className="hero__media" data-hero-img>
            <Image
              src={safeImageSrc(hero.image, HERO_IMAGE_FALLBACK)}
              alt={plain(hero["image-alt"])}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
            />
          </div>
          <div className="hero__shade" aria-hidden="true" />
          <div className="container hero__content">
            <h1 className="hero__title">
              <span className="hero__line"><span data-hero-line><InlineText value={hero.title} /></span></span>
            </h1>
            <p className="hero__body" data-hero-body><InlineText value={hero.body} /></p>
            <a href={safeHref(hero["cta-href"], "#floor-plans")} className="btn hero__cta" data-hero-btn>
              <InlineText value={hero["cta-label"]} inLink />
            </a>
          </div>
        </section>

        {/* Project overview */}
        <section className="overview bg-mint" aria-labelledby="overview-title">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow"><InlineText value={intro.eyebrow} /></p>
            <h2 className="display-40" id="overview-title" data-reveal="heading"><InlineText value={intro.heading} /></h2>
            <p className="lead" data-reveal="body">
              <InlineText value={intro.body} />
            </p>
            <ul className="overview__stats" data-stagger>
              {list(intro.stats).map((f, i) => (
                <li key={i}>
                  <p className="overview__fig">
                    <CountFigure figure={f.figure} count={f.count} />
                  </p>
                  <p className="label"><InlineText value={f.label} /></p>
                </li>
              ))}
            </ul>
            <div className="btn-row overview__actions">
              <BrochureLink href={brochureHref} className="btn btn--line" label={intro["brochure-label"]} />
              <a href={safeHref(intro["request-href"], "#contact")} className="btn btn--line"><InlineText value={intro["request-label"]} inLink /></a>
            </div>
          </div>
        </section>

        {/* A considered sense of place: draggable render carousel */}
        <section className="place" aria-labelledby="place-title">
          <div className="container">
            <h2 className="display-40" id="place-title" data-reveal="heading"><InlineText value={place.heading} /></h2>
            <p className="lead" data-reveal="body">
              <InlineText value={place.body} />
            </p>
          </div>
          {placeSlides.length > 0 && <PlaceCarousel slides={placeSlides} label={plain(place.heading)} {...carouselLabels} />}
        </section>

        {/* Project features: hidden in the new design, switched on from the panel */}
        {showFeatures && (
          <section className="section features bg-green">
            <div className="container">
              <p className="eyebrow" data-reveal="eyebrow"><InlineText value={features.eyebrow} /></p>
              <ul className="stats" data-stagger>
                {featureItems.map((f, i) => (
                  <li className="feature" key={i}>
                    <p className="figure feature__fig">
                      <CountFigure figure={f.figure} count={f.count} />
                    </p>
                    <p className="label feature__label"><InlineText value={f.label} /></p>
                    <p className="body-sm feature__text"><InlineText value={f.text} /></p>
                  </li>
                ))}
              </ul>
              <a href={safeHref(features["cta-href"], "#contact")} className="btn btn--light"><InlineText value={features["cta-label"]} inLink /></a>
            </div>
          </section>
        )}

        {/* Interior image row: hidden in the new design, switched on from the panel */}
        {showStrip && <ImageStrip items={strip(c.imageStrips["interior-items"])} label={plain(c.imageStrips["interior-label"])} />}

        <FloorPlans {...floorPlans} />

        {/* Payment plan */}
        <section className="section payment bg-mint" id="payment-plan">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow"><InlineText value={payment.eyebrow} /></p>
            <h2 className="display-40" data-reveal="heading"><InlineText value={payment.heading} /></h2>
            {plain(payment.summary) && <p className="lead payment__summary" data-reveal="body"><InlineText value={payment.summary} /></p>}
            <div className="split">
              <div>
                <p className="figure"><CountFigure figure={payment["before-percent"]} count={payment["before-percent"]} />%</p>
                <p className="label"><InlineText value={payment["before-label"]} /></p>
              </div>
              <div>
                <p className="figure"><CountFigure figure={payment["handover-percent"]} count={payment["handover-percent"]} />%</p>
                <p className="label"><InlineText value={payment["handover-label"]} /></p>
              </div>
            </div>
            <ul className="stats schedule" data-stagger>
              {list(payment.schedule).map((s, i) => (
                <li key={i}>
                  <p className="figure"><InlineText value={s.figure} /></p>
                  <p className="label"><InlineText value={s.label} /></p>
                </li>
              ))}
            </ul>
            <p className="fine">
              <InlineText value={payment["fine-print"]} />
            </p>
            <div className="btn-row">
              <BrochureLink href={brochureHref} className="btn btn--line" label={payment["brochure-label"]} />
              <a href={safeHref(payment["cta-href"], "#contact")} className="btn btn--line"><InlineText value={payment["cta-label"]} inLink /></a>
            </div>
          </div>
        </section>

        {/* Amenities: centred heading and intro, then a draggable row of cards */}
        <section className="amenities" id="amenities" aria-labelledby="amenities-title">
          <div className="container amenities__head">
            {plain(gallery.eyebrow) && <p className="eyebrow" data-reveal="eyebrow"><InlineText value={gallery.eyebrow} /></p>}
            <h2 className="display-40" id="amenities-title" data-reveal="heading"><InlineText value={gallery.heading} /></h2>
            {plain(gallery.body) && <p className="lead" data-reveal="body"><InlineText value={gallery.body} /></p>}
          </div>
          {amenities.length > 0 && <AmenitiesCarousel items={amenities} label={plain(gallery.heading)} hint={carouselLabels.hint} positionLabel={carouselLabels.positionLabel} />}
        </section>

        {/* An expression of understated luxury: interiors carousel */}
        <section className="place interiors" aria-labelledby="interiors-title">
          <div className="container">
            <h2 className="display-40" id="interiors-title" data-reveal="heading"><InlineText value={interiors.heading} /></h2>
            <p className="lead" data-reveal="body">
              <InlineText value={interiors.body} />
            </p>
          </div>
          {interiorSlides.length > 0 && <PlaceCarousel slides={interiorSlides} label={plain(interiors.heading)} {...carouselLabels} />}
        </section>

        {/* Location: copy on the left half, Mapbox map on the right half */}
        <section className="location" id="location">
          <LocationExplorer content={c.location}>
            {plain(c.location.eyebrow) && <p className="eyebrow" data-reveal="eyebrow"><InlineText value={c.location.eyebrow} /></p>}
            <h2 className="display-40" data-reveal="heading"><InlineText value={c.location.heading} /></h2>
            <p className="lead" data-reveal="body">
              <InlineText value={c.location.body} />
            </p>
          </LocationExplorer>
        </section>

        {/* About the developer: logo, heading and button left; text right */}
        <section className="section about" id="about">
          <div className="container about__grid">
            <div className="about__head">
              {aboutLogo && (
                <Image className="about__logo" src={aboutLogo} alt="" width={180} height={90} unoptimized={aboutLogo.endsWith(".svg")} />
              )}
              {plain(about.eyebrow) && <p className="eyebrow" data-reveal="eyebrow"><InlineText value={about.eyebrow} /></p>}
              <h2 className="display-46" data-reveal="heading"><InlineText value={about.heading} /></h2>
              <BrochureLink href={brochureHref} className="btn btn--line" label={about["brochure-label"]} />
            </div>
            <div className="about__body" data-reveal="body">
              {list(about.paragraphs).map((p, i) => (
                <p className="lead" key={i}>
                  <InlineText value={p.text} />
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Register your interest: full-width render; the button opens the form */}
        <section className="register" id="contact" aria-labelledby="register-title">
          <div className="register__media" aria-hidden="true">
            <Image src={safeImageSrc(contact.image, "/images/renders/hero-aerial-canal.jpg")} alt="" fill sizes="100vw" />
          </div>
          <div className="container register__content">
            <p className="eyebrow" data-reveal="eyebrow"><InlineText value={contact.eyebrow} /></p>
            <h2 className="display-46" id="register-title" data-reveal="heading"><InlineText value={contact.heading} /></h2>
            <p className="lead" data-reveal="body"><InlineText value={contact.intro} /></p>
            <EnquiryDialog buttonLabel={contact["button-label"]} title={contact["form-title"]} formContent={c.contactForm} closeLabel={ui["close-label"]} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer bg-mint">
        <div className="container">
          <div className="footer__grid" data-stagger>
            <div>
              <Logo ariaLabel={logoLabel} src={footerLogo} />
              {plain(footer.address) && <p className="fine footer__address"><InlineText value={footer.address} /></p>}
              <p className="fine footer__permit">
                <span><InlineText value={footer["permit-text"]} /></span>
                <span aria-hidden="true">·</span>
                <span><InlineText value={footer["qr-text"]} /></span>
              </p>
            </div>
            <div className="footer__col">
              <p className="label"><InlineText value={footer["explore-heading"]} /></p>
              <ul>
                {list(footer["explore-links"]).map((item, i) => (
                  <li key={i}><a href={safeHref(item.href, "#")}><InlineText value={item.label} inLink /></a></li>
                ))}
              </ul>
            </div>
            <div className="footer__col">
              <p className="label"><InlineText value={footer["contact-heading"]} /></p>
              <ul>
                {contacts.map((d, i) => (
                  <li key={i}><a href={d.href} aria-label={plain(d.label) ? `${plain(d.label)}: ${plain(d.value)}` : undefined}><InlineText value={d.value} inLink /></a></li>
                ))}
              </ul>
            </div>
            <div className="footer__col footer__partners">
              {list(footer.partners).map((p, i) => {
                const logo = safeImageSrc(p.logo, "");
                return (
                  <div key={i}>
                    <p className="label"><InlineText value={p.label} /></p>
                    {logo ? (
                      <Image className="footer__partner-logo" src={logo} alt={plain(p.name)} width={140} height={40} unoptimized={logo.endsWith(".svg")} />
                    ) : (
                      <p className="footer__partner"><InlineText value={p.name} /></p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="footer__base fine">
            <span><InlineText value={footer.copyright} /></span>
            <span>
              <button type="button" className="footer__link" data-manage-cookies><InlineText value={footer["manage-cookies-label"]} inLink /></button> ·{" "}
              <a
                href={privacyHref}
                {...(isExternalHref(privacyHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <InlineText value={footer["privacy-label"]} inLink />
              </a> ·{" "}
              <a href="/terms"><InlineText value={footer["terms-label"]} inLink /></a>
            </span>
          </div>
        </div>
      </footer>

      <Chat {...chatProps(c)} />
      <CookieNotice content={c.cookies} />
      <Motion />
    </>
  );
}

// The chat widget's props, from the Chat Widget and Chat Text sections.
function chatProps(c) {
  const agent = c.chatAgent;
  return {
    agentPhoto: safeImageSrc(agent["agent-photo"], "/images/agent/avatar.webp"),
    agentPhotoSquare: safeImageSrc(agent["agent-photo-square"], "/images/agent/avatar-square.webp"),
    projectName: plain(agent["project-name"]),
    projectShortName: plain(agent["project-short-name"]),
    callNumber: plain(agent["call-number"]).trim(),
    whatsappNumber: plain(agent["whatsapp-number"]).trim(),
    teaser: {
      enabled: String(agent["teaser-enabled"]) === "true",
      delaySeconds: wholeNumber(agent["teaser-delay-seconds"]) ?? 15,
      scrollPercent: wholeNumber(agent["teaser-scroll-percent"]) ?? 40,
    },
    brokerLinks: list(agent["broker-links"])
      .map((link) => ({
        url: safeHref(link.url, ""),
        label: { en: plain(link["label-en"]), ar: plain(link["label-ar"]) },
      }))
      .filter((link) => link.url),
    // Plain text: chat lines are mixed with what the visitor types, so never HTML.
    copy: {
      en: chatTextFromContent(plainTextValues(c.chatTextEn), "en"),
      ar: chatTextFromContent(plainTextValues(c.chatTextAr), "ar"),
    },
  };
}
