import React, { useRef, useState, useEffect } from "react";
import CvModal from "./CvModal";
import cvPdf from "./assets/cv.pdf";
import "./portfolio.css";

/* ── Profile image ─────────────────────────────────────────────────────── */
import profileImg from "./assets/portfolio/profile/profile.jpg";

/* ── Folder imports (Vite literal globs) ───────────────────────────────── */
const websiteImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/website/*.{png,jpg,jpeg}", { eager: true, import: "default" })
).sort(([a],[b]) => a.localeCompare(b, undefined, { numeric: true })).map(([,m]) => m);

const javaImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/java_client_server/*.{png,jpg,jpeg}", { eager: true, import: "default" })
).sort(([a],[b]) => a.localeCompare(b, undefined, { numeric: true })).map(([,m]) => m);

const neuralImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/neural_net/*.{png,jpg,jpeg}", { eager: true, import: "default" })
).sort(([a],[b]) => a.localeCompare(b, undefined, { numeric: true })).map(([,m]) => m);

const pythonImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/python_autolab/*.{png,jpg,jpeg}", { eager: true, import: "default" })
).sort(([a],[b]) => a.localeCompare(b, undefined, { numeric: true })).map(([,m]) => m);


/* ── Education ─────────────────────────────────────────────────────────── */
const education = [
  {
    degree: "BSc in Computer Engineering",
    school: "Pázmány Péter Catholic University ",
    period: "2022 – 2026.08",
  },
  {
    degree: "Electronics Technician",
    school: "Újpest Bilingual Technical School",
    period: "2019 – 2020",
  },
];


/* ── Sidebar data ──────────────────────────────────────────────────────── */
const skills = [
  { name: "C++", level: 60, note: "≈6 years, currently learning it in advanced level" },
  { name: "Python", level: 60, note: "≈2 years, frequent" },
  { name: "Java", level: 50, note: "love it" },
  { name: "HTML", level: 40, note: "occasional" },
  { name: "CSS", level: 35, note: "basics" },
  { name: "JavaScript / TypeScript", level: 25, note: "deeply engaged" },
  { name: "PHP", level: 5, note: "not an expert" },
  { name: "SQL", level: 50, note: "Love it, used it for website" },
  { name: "MATLAB", level: 20, note: "rarely use it" },
];

/* ── Projects ──────────────────────────────────────────────────────────── */
const projects = [ 
  {
    n: 2,
    title: "React - Personal Website",
    summary: "A hobby project to learn and practice modern web techniques, while also providing a useful resource for classmates and junior students.",
    images: websiteImgs,
    links: [
      { label: "Live", href: "https://bakan7.netlify.app/" },
      { label: "Github Repository", href: "https://github.com/Andrssss/MyWebsite" },
    ],
    tags: ["HTML", "CSS", "JavaScript","React"],
  },
  {
    n: 3,
    title: "Java – Safer Client/Server",
    summary: "Thread-safe client–server communication; clean OOP structure.",
    images: javaImgs,
    links: [{ label: "Github Repository", href: "https://github.com/Andrssss/JAVA_NAGYHF_okosabb_megoldas" }],
    tags: ["Java", "Networking", "Threading", "OOP", "Socket"],
  },
  {
    n: 1,
    title: "Python - Neural Network",
    summary: "This project pushed me to explore different network architectures and understand how to apply them in practice. It was part of a high-stakes competition, which we were in top 5, so as a reward, we didn’t have to take the final exam.",
    images: neuralImgs,
    links: [{ label: "Github Repository", href: "https://github.com/Gergobergo0/conTest" }],
    tags: ["Python", "Deep Learning", "PyTorch","Pandas"],
  }, 
  {
    n: 4,
    title: "Python – AutoLab",
    summary: "Petri-dish automation: Arduino comms, GUI, and image processing.",
    images: pythonImgs,
    links: [{ label: "Github Repository", href: "https://github.com/Andrssss/AutoLab" }],
    tags: ["Python", "Arduino", "PyQt", "OpenCV","pySerial","Threading"],
  },
];

/* ── Minimal carousel (auto-height, no cropping) ───────────────────────── */
function Carousel({ images, altPrefix = "Slide" }) {
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const drag = useRef({ x: 0, t: 0, live: false });
  const clamp = (n) => Math.max(0, Math.min(n, images.length - 1));

  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const vp = ref.current;
    const slide = vp?.children?.[i];
    if (!vp || !slide) return;

    // Only move the horizontal scroll position
    vp.scrollTo({ left: slide.offsetLeft, behavior });
  }, [i]);


  const begin = (x) => (drag.current = { x, t: Date.now(), live: true });
  const end   = (x) => {
    if (!drag.current.live) return;
    const dx = x - drag.current.x, dt = Date.now() - drag.current.t, vx = Math.abs(dx) / Math.max(dt, 1);
    if (dx > 48 || (dx > 10 && vx > 0.6)) setI((k) => clamp(k - 1));
    if (dx < -48 || (dx < -10 && vx > 0.6)) setI((k) => clamp(k + 1));
    drag.current.live = false;
  };

  if (!images?.length) return null;

  return (
    <div
      className="neo-cr"
      tabIndex={0}
      onKeyDown={(e)=>{ if(e.key==="ArrowLeft") setI((k)=>clamp(k-1)); if(e.key==="ArrowRight") setI((k)=>clamp(k+1)); }}
    >
      <div
        className="neo-cr_vp"
        ref={ref}
        onMouseDown={(e)=>begin(e.clientX)}
        onMouseUp={(e)=>end(e.clientX)}
        onMouseLeave={(e)=>end(e.clientX)}
        onTouchStart={(e)=>begin(e.touches[0].clientX)}
        onTouchEnd={(e)=>end(e.changedTouches[0].clientX)}
      >
        {images.map((src, idx) => (
          <div className="neo-cr_slide" key={idx} aria-hidden={idx !== i}>
            {/* KEY CHANGE: width 100%, height auto, contain => never cropped */}
            <img src={src} alt={`${altPrefix} ${idx + 1}`} loading="lazy" draggable="false" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="neo-cr_nav left"
            onMouseDown={(e)=>{ e.preventDefault(); }}   // stop focus scroll
            onClick={() => setI(k => clamp(k - 1))}
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 19L8 12l7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="neo-cr_nav right"
            onMouseDown={(e)=>{ e.preventDefault(); }}
            onClick={() => setI(k => clamp(k + 1))}
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Mobile-friendly dots */}
          <div className="neo-cr_dots" role="tablist" aria-label="Slide pagination">
            {images.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Go to slide ${idx + 1}`}
                className={`neo-cr_dot ${i===idx ? 'active' : ''}`}
                onClick={() => setI(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


/* ── Main (one-card per project: image + description together) ─────────── */
export default function Portfolio() {
  const [open, setOpen] = useState(false);

const handleCvOpen = () => {
    const isMobile = typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches;

    if (isMobile) {
      window.open(cvPdf, "_blank", "noopener,noreferrer");
    } else {
      setOpen(true);
    }
  };

  return (
    <section className="neo-wrap">
      <div className="neo-cols">
        {/* LEFT RAIL */}
       <aside className="neo-rail">
          {/* Profile */}
          <div className="neo-card neo-center neo-profileCard">
            <img className="neo-avatar" src={profileImg} alt="Profile" />
            <div>
              <div className="neo-title">Computer Engineering student</div>
              <div className="neo-contact">
                <span>📄 CV – </span>

                {/* Mobile: open in new tab */}
                <a
                  href={cvPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-linkBtn neo-mobileOnly"
                >
                  open
                </a>

                {/* Desktop: open modal */}
                <button
                  onClick={() => setOpen(true)}
                  className="neo-linkBtn neo-desktopOnly"
                >
                  open
                </button>

                <p>📞 +36 70 358 9977</p>
                <p>✉️ bak.andrs@gmail.com</p>
              </div>

            </div>
          </div>



          {/* Education */}
          <div className="neo-card neo-edu">
            <div className="neo-section neo-edu-head">
              <span className="neo-edu-icon" aria-hidden>🎓</span>
              <span>Education</span>
            </div>

            <ul className="neo-edu-list">
            {education.map((e, i) => (
              <li key={i} className="neo-edu-item">
                <div className="neo-edu-degree">{e.degree}</div>
                <div className="neo-edu-period">{e.period}</div>
                <div className="neo-edu-school">{e.school}</div>
              </li>
            ))}
          </ul>
          </div>

          {/* Skills */}
          <div className="neo-card">
            <div className="neo-section">Programming Languages</div>
            <div className="neo-skilllist">
              {skills.map((s) => (
                <div key={s.name} className="neo-skill">
                  <div className="neo-skill-head">
                    <span>{s.name}</span>
                    <span className="neo-skill-note">{s.note}</span>
                  </div>
                  <div className="neo-bar">
                    <span style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>



        {/* RIGHT COLUMN – unified cards */}
        <main className="neo-main">
          {projects.map((p) => (
            <article key={p.n} className="neo-item">
              <div className="neo-dot">{String(p.n).padStart(2, "0")}</div>

              {/* ONE base card: media + body inside */}
              <div className="neo-card neo-article">
                <div className="neo-media">
                  <Carousel images={p.images} altPrefix={p.title} />
                </div>
                <div className="neo-body">
                  <h3 className="neo-h3">{p.title}</h3>
                  <p className="neo-muted">{p.summary}</p>
                  <div className="neo-tags">
                    {p.tags.map((t) => <span key={t} className="neo-tag">{t}</span>)}
                  </div>
                  <div className="neo-links">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="neo-btn">
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>

      <CvModal
      isOpen={open}
      onClose={() => setOpen(false)}
      pdfUrl={cvPdf}
    />
    </section>
  );
}
