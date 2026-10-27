import Image from "next/image";
import Chat from "@/components/Chat";
import ContactForm from "@/components/ContactForm";
import CookieNotice from "@/components/CookieNotice";
import FloorPlans from "@/components/FloorPlans";
import LocationExplorer from "@/components/Location/LocationExplorer";
import MobileMenu from "@/components/MobileMenu";
import Motion from "@/components/Motion";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Location", href: "#location" },
  { label: "Amenities", href: "#amenities" },
  { label: "Payment Plan", href: "#payment-plan" },
  { label: "Contact", href: "#contact" },
];

const FEATURES = [
  { fig: "459", count: 459, label: "Residences", text: "7 low-rise buildings with a car-free park at the centre" },
  { fig: "2 & 3", label: "Bedroom Homes", text: "Two-bedroom apartments, plus three-bedroom layouts with a maid's room" },
  { fig: "6.4 km", label: "Canal Promenade", text: "Direct access from the community to the canal promenade" },
  { fig: "Eden House", label: "Hospitality", text: "Concierge, resident and guest valet, and an Eden House app with digital key access" },
  { fig: "Q3 2027", label: "Handover", text: "70% of the price is due on handover" },
];

const R = "/images/renders";

// Image strips: a narrow, a wide and a narrow render, as in the design.
const EXTERIOR_STRIP = [
  { src: `${R}/aerial-canal.jpg`, w: 316, alt: "Aerial view of the buildings along the Dubai Water Canal" },
  { src: `${R}/canal-skyline.jpg`, w: 760, alt: "Canal promenade beside the community" },
  { src: `${R}/garden-path.jpg`, w: 316, alt: "Car-free park between the buildings" },
];

const INTERIOR_STRIP = [
  { src: `${R}/marble-corridor.jpg`, w: 316, alt: "Corridor with green marble walls" },
  { src: `${R}/residents-lounge.jpg`, w: 760, alt: "Residents' lounge with seating and a long dining table" },
  { src: `${R}/gym.jpg`, w: 316, alt: "Gym with weights and garden views" },
];

const GALLERY = [
  {
    title: "The Park At The Centre",
    text: "A car-free park sits at the centre of the community, with playgrounds and gardens between the buildings.",
    src: `${R}/park-pavilion.jpg`,
    alt: "Landscaped park with a pavilion beneath a footbridge",
  },
  {
    title: "Wellness Close To Home",
    text: "Gyms, movement studios, saunas and steam rooms, and 5 pools, 2 of them for children.",
    src: `${R}/gym.jpg`,
    alt: "Gym with weights and garden views",
  },
  {
    title: "Looked After On Site",
    text: "An Eden House team on site, with 24-hour security and 24-hour maintenance across the community.",
    src: `${R}/arrival-court.jpg`,
    alt: "Landscaped arrival court between the buildings at dusk",
  },
  {
    title: "Life On The Canal",
    text: "The 6.4 km canal promenade is there for a morning walk or an evening run along the water.",
    src: `${R}/aerial-canal.jpg`,
    alt: "Aerial view of the buildings along the Dubai Water Canal",
  },
];

const SCHEDULE = [
  { fig: "10%", label: "On booking" },
  { fig: "10%", label: "One month later" },
  { fig: "5%", label: "February 2027" },
  { fig: "5%", label: "July 2027" },
  { fig: "70%", label: "On handover" },
];

const CONTACTS = [
  { label: "Telephone", value: "+971 4 423 0167", href: "tel:+97144230167" },
  { label: "UAE Toll Free", value: "800 Refine (800 733463)", href: "tel:800733463" },
  { label: "Email", value: "ehtp@refinedubai.com", href: "mailto:ehtp@refinedubai.com" },
];

const EXPLORE = [
  { label: "About", href: "#about" },
  { label: "Location", href: "#location" },
  { label: "Amenities", href: "#amenities" },
  { label: "Floor Plans", href: "#floor-plans" },
  { label: "Payment Plan", href: "#payment-plan" },
];

// Partner logos are not supplied yet; their names stand in.
const PARTNERS = [
  { label: "Development By", name: "H&H" },
  { label: "Owned By", name: "Global Partners" },
  { label: "Sales Partner", name: "Refine" },
];

// Black logo in the header, white in the footer.
function Logo({ ariaLabel, variant = "black", priority = false }) {
  return (
    <a href="#top" className="logo" aria-label={ariaLabel}>
      <Image
        src={`/logo/eden-house-${variant}.svg`}
        alt=""
        width={638}
        height={458}
        priority={priority}
      />
    </a>
  );
}

function ImageStrip({ items, label }) {
  return (
    <section className="strip" aria-label={label}>
      <div className="strip__row" data-stagger>
        {items.map((item) => (
          <figure key={item.src} className="strip__item" style={{ "--w": item.w }}>
            <Image src={item.src} alt={item.alt} fill sizes={`${Math.round((item.w / 1440) * 100)}vw`} />
          </figure>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="progress" aria-hidden="true" data-progress />

      <header className="header" data-header>
        <div className="container header__inner">
          <Logo ariaLabel="Return to the Eden House The Park hero section" priority />
          <nav className="nav" aria-label="Main">
            <ul className="nav__links label">
              {NAV.map((item) => (
                <li key={item.href}><a href={item.href}>{item.label}</a></li>
              ))}
            </ul>
            <a href="#contact" className="btn btn--fill">Request Callback</a>
            <MobileMenu links={NAV} />
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero: full-bleed render under the header, centred copy, key figures along the bottom */}
        <section className="hero" id="top" data-hero>
          <div className="hero__media" data-hero-img>
            <Image
              src={`${R}/hero-aerial-canal.jpg`}
              alt="Aerial view of the Eden House The Park buildings along the Dubai Water Canal"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hero__shade" aria-hidden="true" />
          <div className="container hero__content">
            <h1 className="hero__title">
              <span className="hero__line"><span data-hero-line>Life, Set Around A Park On The Canal</span></span>
            </h1>
            <p className="hero__body" data-hero-body>Low-Rise Residences On The Dubai Water Canal, Developed By H&amp;H</p>
            <a href="#floor-plans" className="btn hero__cta" data-hero-btn>Get Prices &amp; Floor Plans</a>
          </div>
          <ul className="container hero__stats" data-hero-stats>
            {FEATURES.map((f) => (
              <li key={f.label}>
                <p className="hero__stat-fig">
                  {f.count ? <span data-count={f.count}>{f.fig}</span> : f.fig}
                </p>
                <p className="hero__stat-label">{f.label}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Intro statement */}
        <section className="intro bg-mint">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow">Where The</p>
            <p className="quote" data-quote>
              {"City Gives Way To The Park".split(" ").map((word, i) => (
                <span key={i}>
                  <span className="word">{word}</span>{" "}
                </span>
              ))}
            </p>
            <p className="body intro__body" data-reveal="body">
              Eden House The Park is a community of 459 homes in seven low-rise buildings on the Dubai Water Canal, with two- and three-bedroom apartments on sale.
            </p>
          </div>
        </section>

        {/* Project features */}
        <section className="section features bg-green">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow">Project Features</p>
            <ul className="stats" data-stagger>
              {FEATURES.map((f) => (
                <li className="feature" key={f.label}>
                  <p className="figure feature__fig">
                    {f.count ? <span data-count={f.count}>{f.fig}</span> : f.fig}
                  </p>
                  <p className="label feature__label">{f.label}</p>
                  <p className="body-sm feature__text">{f.text}</p>
                </li>
              ))}
            </ul>
            <a href="#contact" className="btn btn--light">Submit Request</a>
          </div>
        </section>

        <ImageStrip items={EXTERIOR_STRIP} label="The buildings and the canal" />

        {/* Lifestyle gallery */}
        <section className="section gallery" id="amenities">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow">Designed</p>
            <h2 className="h2" data-reveal="heading">Around Everyday Life</h2>
            <ul className="gallery__grid" data-stagger>
              {GALLERY.map((g) => (
                <li className="card" key={g.title}>
                  <div className="card__img">
                    <Image src={g.src} alt={g.alt} fill sizes="(max-width: 1000px) 50vw, 600px" />
                  </div>
                  <h3 className="h3">{g.title}</h3>
                  <p className="body-sm">{g.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ImageStrip items={INTERIOR_STRIP} label="Interiors and amenities" />

        {/* Floor plans: render on the left, details on the right */}
        <section className="plans split-section split-section--reverse" id="floor-plans">
          <div className="split-section__media plans__img">
            <Image
              src={`${R}/bedroom.jpg`}
              alt="Bedroom with an oak-panelled wall and a sculpted rug"
              fill
              sizes="50vw"
            />
          </div>
          <div className="split-section__text plans__text">
            <p className="eyebrow" data-reveal="eyebrow">Floor Plans</p>
            <h2 className="h2" data-reveal="heading">Two And Three-Bedroom Layouts</h2>
            <FloorPlans />
          </div>
        </section>

        {/* Location: copy on the left half, Mapbox map on the right half */}
        <section className="location" id="location">
          <LocationExplorer>
            <p className="eyebrow" data-reveal="eyebrow">Central Dubai,</p>
            <h2 className="h2" data-reveal="heading">Ten Minutes From Burj Khalifa</h2>
            <p className="body" data-reveal="body">
              Eden House The Park sits on the Dubai Water Canal beside Al Safa Park, with Burj Khalifa, DIFC and Jumeirah Beach a short drive away and the 6.4 km canal promenade outside.
            </p>
          </LocationExplorer>
        </section>

        {/* Payment plan */}
        <section className="section payment bg-green" id="payment-plan">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow">Payment</p>
            <h2 className="h2" data-reveal="heading">Plan</h2>
            <p className="body payment__summary" data-reveal="body">30 percent Before Handover and 70 percent On Handover</p>
            <div className="split">
              <div>
                <p className="figure"><span data-count="30">30</span>%</p>
                <p className="label">Before Handover</p>
              </div>
              <div>
                <p className="figure"><span data-count="70">70</span>%</p>
                <p className="label">On Handover</p>
              </div>
            </div>
            <ul className="stats schedule" data-stagger>
              {SCHEDULE.map((s) => (
                <li key={s.label}>
                  <p className="figure">{s.fig}</p>
                  <p className="label">{s.label}</p>
                </li>
              ))}
            </ul>
            <p className="fine">
              10% on booking, 10% one month later, 5% in February 2027 and 5% in July 2027, then 70% on handover. DLD 4% and an AED 5,000 admin fee + VAT apply.
            </p>
            <div className="btn-row">
              <a href="#" className="btn btn--light">Download Brochure</a>
              <a href="#contact" className="btn btn--light">Submit Request</a>
            </div>
          </div>
        </section>

        {/* About the developer */}
        <section className="section about bg-stone" id="about">
          <div className="container about__grid">
            <div>
              <p className="eyebrow" data-reveal="eyebrow">A Park-Led</p>
              <h2 className="h2" data-reveal="heading">About The Developer</h2>
              <a href="#" className="btn btn--line">Download Brochure</a>
            </div>
            <div className="about__body" data-reveal="body">
              <p className="body">
                Eden House The Park is a community of 459 homes in seven low-rise buildings on the Dubai Water Canal, with two- and three-bedroom apartments on sale. The architecture is by dxb lab, the interiors by H&amp;H and the landscape by WAHO, and a car-free park sits at the centre, so the paths between the buildings are for walking, not driving.
              </p>
              <p className="body">
                Eden House is the homegrown residential hospitality brand H&amp;H founded in 2021, independent from hotel operators. H&amp;H has developed in Dubai since 2007, and The Park brings Eden House to a community of seven low-rise buildings, finished in pale terrazzo and curved oak, with views of the canal, the gardens and the skyline.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section contact" id="contact">
          <div className="container contact__grid">
            <div>
              <p className="eyebrow" data-reveal="eyebrow">Reach Out</p>
              <h2 className="h2" data-reveal="heading">Register Your Interest</h2>
              <p className="contact__intro" data-reveal="body">
                Our team can take you through the two- and three-bedroom homes, the floor plans and the payment plan, and arrange a visit to the sales gallery at Eden House The Canal.
              </p>
              <ul className="details">
                {CONTACTS.map((c) => (
                  <li key={c.label}>
                    <p className="label">{c.label}</p>
                    <a href={c.href}>{c.value}</a>
                  </li>
                ))}
              </ul>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer bg-caffe">
        <div className="container">
          <div className="footer__grid" data-stagger>
            <div>
              <Logo ariaLabel="Return to the Eden House The Park hero section" variant="white" />
              <p className="fine footer__address">Office 4701, Floor 47, Ubora Tower, Marasi Drive, Business Bay, Dubai</p>
              <p className="fine footer__permit">
                <span>Trakheesi permit no. [number]</span>
                <span aria-hidden="true">·</span>
                <span>Madmoun QR</span>
              </p>
            </div>
            <div className="footer__col">
              <p className="label">Explore</p>
              <ul>
                {EXPLORE.map((item) => (
                  <li key={item.href}><a href={item.href}>{item.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer__col">
              <p className="label">Contact</p>
              <ul>
                {CONTACTS.map((c) => (
                  <li key={c.label}><a href={c.href}>{c.value}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer__col footer__partners">
              {PARTNERS.map((p) => (
                <div key={p.label}>
                  <p className="label">{p.label}</p>
                  <p className="footer__partner">{p.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="footer__base fine">
            <span>©2026. Refine Project Management. All rights reserved</span>
            <span>
              <a href="#" data-manage-cookies>Manage Cookies</a> · <a href="#">Privacy Policy</a> · <a href="#">Terms &amp; Conditions</a>
            </span>
          </div>
        </div>
      </footer>

      <Chat />
      <CookieNotice />
      <Motion />
    </>
  );
}
