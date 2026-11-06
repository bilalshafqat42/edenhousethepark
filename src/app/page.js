import Image from "next/image";
import Chat from "@/components/Chat";
import ContactForm from "@/components/ContactForm";
import CookieNotice from "@/components/CookieNotice";
import FloorPlans from "@/components/FloorPlans";
import InlineText from "@/components/InlineText";
import LocationExplorer from "@/components/Location/LocationExplorer";
import MobileMenu from "@/components/MobileMenu";
import Motion from "@/components/Motion";
import { chatTextFromContent } from "@/content/sections/chatText";
import { readSections } from "@/lib/page-content";
import { hasInlineMarkup, plainTextValues, splitInlineWords, toPlainText } from "@/lib/inline-text";
import { isExternalHref, safeHref, safeImageSrc, wholeNumber } from "@/lib/safe-url";

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

const DEFAULT_LOGOS = { black: "/logo/eden-house-black.svg", white: "/logo/eden-house-white.svg" };

// Black logo in the header, white in the footer.
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

// The intro quote, one span per word for the scroll reveal (Motion.js).
function QuoteWords({ value }) {
  if (!hasInlineMarkup(value)) {
    return String(value ?? "").split(" ").map((word, i) => (
      <span key={i}>
        <span className="word">{word}</span>{" "}
      </span>
    ));
  }
  return splitInlineWords(value)
    .filter((token) => token.type === "word")
    .map((token, i) => (
      <span key={i}>
        <span className="word" dangerouslySetInnerHTML={{ __html: token.html }} />{" "}
      </span>
    ));
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
    "navigation", "appearance", "hero", "intro", "features", "imageStrips", "gallery", "floorPlans",
    "location", "payment", "brochure", "about", "contact", "contactForm", "footer", "cookies",
    "chatAgent", "chatTextEn", "chatTextAr",
  ]);
  const { navigation: nav, hero, intro, features, gallery, payment, about, contact, footer } = c;

  const navLinks = list(nav.links).map((item) => ({ label: item.label, href: safeHref(item.href, "#") }));
  const headerLogo = safeImageSrc(c.appearance["logo-header"], DEFAULT_LOGOS.black);
  const footerLogo = safeImageSrc(c.appearance["logo-footer"], DEFAULT_LOGOS.white);
  const logoLabel = plain(nav["logo-aria-label"]);
  const featureItems = list(features.items);
  const strip = (items) =>
    list(items)
      .map((item) => ({ src: safeImageSrc(item.image, ""), alt: plain(item.alt), w: wholeNumber(item.width) || 316 }))
      .filter((item) => item.src);
  const brochureHref = safeHref(c.brochure.url, "#contact");
  const contacts = list(contact.details).map((item) => ({ ...item, href: safeHref(item.href, "#contact") }));

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
        {/* Hero: full-bleed render under the header, centred copy, key figures along the bottom */}
        <section className="hero" id="top" data-hero>
          <div className="hero__media" data-hero-img>
            <Image
              src={safeImageSrc(hero.image, "/images/renders/hero-aerial-canal.jpg")}
              alt={plain(hero["image-alt"])}
              fill
              priority
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
          <ul className="container hero__stats" data-hero-stats>
            {featureItems.map((f, i) => (
              <li key={i}>
                <p className="hero__stat-fig">
                  <CountFigure figure={f.figure} count={f.count} />
                </p>
                <p className="hero__stat-label"><InlineText value={f.label} /></p>
              </li>
            ))}
          </ul>
        </section>

        {/* Intro statement */}
        <section className="intro bg-mint">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow"><InlineText value={intro.eyebrow} /></p>
            <p className="quote" data-quote>
              <QuoteWords value={intro.quote} />
            </p>
            <p className="body intro__body" data-reveal="body">
              <InlineText value={intro.body} />
            </p>
          </div>
        </section>

        {/* Project features */}
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

        <ImageStrip items={strip(c.imageStrips["exterior-items"])} label={plain(c.imageStrips["exterior-label"])} />

        {/* Lifestyle gallery */}
        <section className="section gallery" id="amenities">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow"><InlineText value={gallery.eyebrow} /></p>
            <h2 className="h2" data-reveal="heading"><InlineText value={gallery.heading} /></h2>
            <ul className="gallery__grid" data-stagger>
              {list(gallery.items).map((g, i) => (
                <li className="card" key={i}>
                  <div className="card__img">
                    <Image src={safeImageSrc(g.image, "/images/renders/park-pavilion.jpg")} alt={plain(g.alt)} fill sizes="(max-width: 1000px) 50vw, 600px" />
                  </div>
                  <h3 className="h3"><InlineText value={g.title} /></h3>
                  <p className="body-sm"><InlineText value={g.text} /></p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ImageStrip items={strip(c.imageStrips["interior-items"])} label={plain(c.imageStrips["interior-label"])} />

        {/* Floor plans: render on the left, details on the right */}
        <section className="plans split-section split-section--reverse" id="floor-plans">
          <div className="split-section__media plans__img">
            <Image
              src={safeImageSrc(c.floorPlans.image, "/images/renders/bedroom.jpg")}
              alt={plain(c.floorPlans["image-alt"])}
              fill
              sizes="50vw"
            />
          </div>
          <div className="split-section__text plans__text">
            <p className="eyebrow" data-reveal="eyebrow"><InlineText value={c.floorPlans.eyebrow} /></p>
            <h2 className="h2" data-reveal="heading"><InlineText value={c.floorPlans.heading} /></h2>
            <FloorPlans
              plans={list(c.floorPlans.plans)}
              tabsLabel={plain(c.floorPlans["tabs-aria-label"])}
              ctaLabel={c.floorPlans["cta-label"]}
              ctaHref={safeHref(c.floorPlans["cta-href"], "#contact")}
            />
          </div>
        </section>

        {/* Location: copy on the left half, Mapbox map on the right half */}
        <section className="location" id="location">
          <LocationExplorer content={c.location}>
            <p className="eyebrow" data-reveal="eyebrow"><InlineText value={c.location.eyebrow} /></p>
            <h2 className="h2" data-reveal="heading"><InlineText value={c.location.heading} /></h2>
            <p className="body" data-reveal="body">
              <InlineText value={c.location.body} />
            </p>
          </LocationExplorer>
        </section>

        {/* Payment plan */}
        <section className="section payment bg-green" id="payment-plan">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow"><InlineText value={payment.eyebrow} /></p>
            <h2 className="h2" data-reveal="heading"><InlineText value={payment.heading} /></h2>
            <p className="body payment__summary" data-reveal="body"><InlineText value={payment.summary} /></p>
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
              <BrochureLink href={brochureHref} className="btn btn--light" label={payment["brochure-label"]} />
              <a href={safeHref(payment["cta-href"], "#contact")} className="btn btn--light"><InlineText value={payment["cta-label"]} inLink /></a>
            </div>
          </div>
        </section>

        {/* About the developer */}
        <section className="section about bg-stone" id="about">
          <div className="container about__grid">
            <div>
              <p className="eyebrow" data-reveal="eyebrow"><InlineText value={about.eyebrow} /></p>
              <h2 className="h2" data-reveal="heading"><InlineText value={about.heading} /></h2>
              <BrochureLink href={brochureHref} className="btn btn--line" label={about["brochure-label"]} />
            </div>
            <div className="about__body" data-reveal="body">
              {list(about.paragraphs).map((p, i) => (
                <p className="body" key={i}>
                  <InlineText value={p.text} />
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section contact" id="contact">
          <div className="container contact__grid">
            <div>
              <p className="eyebrow" data-reveal="eyebrow"><InlineText value={contact.eyebrow} /></p>
              <h2 className="h2" data-reveal="heading"><InlineText value={contact.heading} /></h2>
              <p className="contact__intro" data-reveal="body">
                <InlineText value={contact.intro} />
              </p>
              <ul className="details">
                {contacts.map((d, i) => (
                  <li key={i}>
                    <p className="label"><InlineText value={d.label} /></p>
                    <a href={d.href}><InlineText value={d.value} inLink /></a>
                  </li>
                ))}
              </ul>
            </div>
            <ContactForm content={c.contactForm} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer bg-caffe">
        <div className="container">
          <div className="footer__grid" data-stagger>
            <div>
              <Logo ariaLabel={logoLabel} src={footerLogo} />
              <p className="fine footer__address"><InlineText value={footer.address} /></p>
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
                  <li key={i}><a href={d.href}><InlineText value={d.value} inLink /></a></li>
                ))}
              </ul>
            </div>
            <div className="footer__col footer__partners">
              {list(footer.partners).map((p, i) => (
                <div key={i}>
                  <p className="label"><InlineText value={p.label} /></p>
                  <p className="footer__partner"><InlineText value={p.name} /></p>
                </div>
              ))}
            </div>
          </div>
          <div className="footer__base fine">
            <span><InlineText value={footer.copyright} /></span>
            <span>
              <a href="#" data-manage-cookies><InlineText value={footer["manage-cookies-label"]} inLink /></a> ·{" "}
              <a
                href={footer["privacy-href"] || "/privacy"}
                {...(/^https?:/i.test(footer["privacy-href"] || "") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
