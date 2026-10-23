import Chat from "@/components/Chat";
import ContactForm from "@/components/ContactForm";
import CookieNotice from "@/components/CookieNotice";
import FeatureSlider from "@/components/FeatureSlider";
import FloorPlans from "@/components/FloorPlans";
import LocationChips from "@/components/LocationChips";
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

const TIMES = [
  { place: "Al Safa Park", time: "3 Min" },
  { place: "City Walk", time: "8 Min" },
  { place: "Dubai Mall", time: "10 Min" },
  { place: "DIFC", time: "16 Min" },
  { place: "DXB", time: "18 Min" },
];

const GALLERY = [
  {
    title: "The Park At The Centre",
    text: "A car-free park sits at the centre of the community, with playgrounds and gardens between the buildings.",
    alt: "Children's playground in the park",
    bg: "var(--green-50)",
  },
  {
    title: "Wellness Close To Home",
    text: "Gyms, movement studios, saunas and steam rooms, and 5 pools, 2 of them for children.",
    alt: "Movement studio with garden views",
    bg: "var(--green-75)",
  },
  {
    title: "Looked After On Site",
    text: "An Eden House team on site, with 24-hour security and 24-hour maintenance across the community.",
    alt: "Eden House reception lobby",
    bg: "var(--stone-50)",
  },
  {
    title: "Life On The Canal",
    text: "The 6.4 km canal promenade is there for a morning walk or an evening run along the water.",
    alt: "Canal promenade at sunset",
    bg: "var(--green-50)",
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

function Logo({ ariaLabel }) {
  return (
    <a href="#top" className="logo" aria-label={ariaLabel}>
      <span className="logo__name">Eden House</span>
      <span className="logo__sub label">The Park</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="progress" aria-hidden="true" data-progress />

      <header className="header" data-header>
        <div className="container header__inner">
          <Logo ariaLabel="Return to the Eden House The Park hero section" />
          <nav className="nav" aria-label="Main">
            <ul className="nav__links label">
              {NAV.map((item) => (
                <li key={item.href}><a href={item.href}>{item.label}</a></li>
              ))}
            </ul>
            <a href="#contact" className="btn btn--fill">Request Callback</a>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="hero" id="top" data-hero>
          <div className="container hero__grid">
            <div>
              <p className="eyebrow" data-hero-eyebrow>A Greener</p>
              <h1 className="h1">
                <span className="hero__line"><span data-hero-line>Life, Set Around</span></span>{" "}
                <span className="hero__line"><span data-hero-line>A Park On The</span></span>{" "}
                <span className="hero__line"><span data-hero-line>Canal</span></span>
              </h1>
              <p className="body hero__body" data-hero-body>Low-Rise Residences On The Dubai Water Canal, Developed By H&amp;H</p>
              <div className="hero__actions" data-hero-btn>
                <a href="#about" className="btn btn--fill">Explore More</a>
                <a href="#about" className="label hero__scroll">Scroll Down</a>
              </div>
            </div>
            <div
              className="slot hero__img"
              role="img"
              aria-label="Low-rise buildings of Eden House The Park among gardens on the Dubai Water Canal"
              style={{ backgroundColor: "var(--green-50)" }}
              data-hero-img
            />
          </div>
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
            <FeatureSlider />
            <a href="#contact" className="btn btn--light">Submit Request</a>
          </div>
        </section>

        {/* About */}
        <section className="section about" id="about">
          <div className="container">
            <h2 className="sr-only">Eden House The Park project</h2>
            <div className="about__grid">
              <div>
                <p className="eyebrow" data-reveal="eyebrow">A Park-Led</p>
                <h3 className="h2" data-reveal="heading">Community On The Canal</h3>
                <a href="#" className="btn btn--line">Download Brochure</a>
              </div>
              <div>
                <div className="about__body" data-reveal="body">
                  <p className="body">
                    Eden House The Park is a community of 459 homes in seven low-rise buildings on the Dubai Water Canal, with two- and three-bedroom apartments on sale. The architecture is by dxb lab, the interiors by H&amp;H and the landscape by WAHO, and a car-free park sits at the centre, so the paths between the buildings are for walking, not driving.
                  </p>
                  <p className="body">
                    Eden House is the homegrown residential hospitality brand H&amp;H founded in 2021, independent from hotel operators. H&amp;H has developed in Dubai since 2007, and The Park brings Eden House to a community of seven low-rise buildings, finished in pale terrazzo and curved oak, with views of the canal, the gardens and the skyline.
                  </p>
                </div>
                <div className="about__pics" data-stagger>
                  <div className="slot" role="img" aria-label="Oak-panelled interior opening onto a private balcony" style={{ backgroundColor: "var(--stone-50)" }} />
                  <div className="slot" role="img" aria-label="Gardens framing a view of the canal" style={{ backgroundColor: "var(--green-75)" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="section location" id="location">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow">Central Dubai,</p>
            <h2 className="h2" data-reveal="heading">Ten Minutes From Burj Khalifa</h2>
            <div className="location__grid">
              {/* Mapbox GL JS mounts here later. Do not hard-code coordinates. */}
              <div
                id="map"
                className="map"
                role="region"
                aria-label="Map showing Eden House The Park and nearby destinations"
              />
              <div className="location__copy">
                <p className="body" data-reveal="body">
                  Eden House The Park sits on the Dubai Water Canal beside Al Safa Park, with Burj Khalifa, DIFC and Jumeirah Beach a short drive away and the 6.4 km canal promenade outside.
                </p>
                <LocationChips />
                <ul className="times" data-stagger>
                  {TIMES.map((t) => (
                    <li key={t.place}>
                      <span>{t.place}</span>
                      <span className="figure">{t.time}</span>
                    </li>
                  ))}
                </ul>
                {/* No-ops until Mapbox is mounted in #map */}
                <div className="btn-row location__actions">
                  <button type="button" className="btn btn--line" data-map-reset>Reset View</button>
                  <button type="button" className="btn btn--line" data-map-directions>See Directions</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full width image */}
        <div
          className="slot wide"
          role="img"
          aria-label="Residents walking through the car-free park at Eden House The Park"
          style={{ backgroundColor: "var(--green-75)" }}
        />

        {/* Lifestyle gallery */}
        <section className="section gallery" id="amenities">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow">Designed</p>
            <h2 className="h2" data-reveal="heading">Around Everyday Life</h2>
            <ul className="gallery__grid" data-stagger>
              {GALLERY.map((g) => (
                <li className="card" key={g.title}>
                  <div className="slot" role="img" aria-label={g.alt} style={{ backgroundColor: g.bg }} />
                  <h3 className="h3">{g.title}</h3>
                  <p className="body-sm">{g.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Floor plans */}
        <section className="section plans bg-mint" id="floor-plans">
          <div className="container">
            <p className="eyebrow" data-reveal="eyebrow">Floor Plans</p>
            <h2 className="h2" data-reveal="heading">Two And Three-Bedroom Layouts</h2>
            <FloorPlans />
          </div>
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

        {/* Contact */}
        <section className="section contact" id="contact">
          <div className="container contact__grid">
            <div>
              <p className="eyebrow" data-reveal="eyebrow">Reach Out</p>
              <h2 className="h2" data-reveal="heading">To Us</h2>
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
              <Logo ariaLabel="Return to the Eden House The Park hero section" />
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
            <div className="footer__col">
              <p className="label">Developer</p>
              <p className="footer__hh">H&amp;H</p>
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
