import React, { useRef, useState, useEffect } from "react";
import CvModal from "./CvModal";
import cvPdf from "./assets/cv.pdf";
import "./portfolio.css";

/* ── Profile image ─────────────────────────────────────────────────────── */
import profileImg from "./assets/portfolio/profile/profile.jpg";

/* ── Folder imports (Vite literal globs) ───────────────────────────────── */
const internshipImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/internship_job_board/*.{png,jpg,jpeg}", { eager: true, import: "default" })
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


/* ── Experience ────────────────────────────────────────────────────────── */
const experience = [
  {
    role: "Test Automation Engineer",
    company: "OTP Bank Nyrt.",
    period: "2025 – 2026",
    duration: "11 months",
    bullets: [
      "Tested a core banking system, learning banking business processes and transaction logic along the way.",
      "Developed and maintained Python/Pytest-based test automation solutions.",
      "Tested Kafka- and REST API-based systems.",
      "Performed SQL-based data validation and optimized query runtime.",
      "Used GitHub Copilot to build tests, helper scripts, and database queries.",
      "Worked in an Agile (Scrum) environment.",
      "Used MS Azure, JIRA, Confluence, and Postman.",
    ],
  },
];

/* ── Education ─────────────────────────────────────────────────────────── */
const education = [
  {
    degree: "BSc in Computer Engineering",
    school: "Pázmány Péter Catholic University",
    period: "2022 – 2026",
  },
  {
    degree: "Electronics Technician",
    school: "Újpest Bilingual Technical School",
    period: "2019 – 2020",
  },
];

/* ── Sidebar data ──────────────────────────────────────────────────────── */
const skills = [
  { name: "Python", level: 60, note: "≈2 years, frequent" },
  { name: "SQL", level: 50, note: "solid, use it daily" },
  { name: "Java", level: 40, note: "love it" },
  { name: "C++", level: 30, note: "≈6 years" },
  { name: "HTML", level: 25, note: "occasional" },
  { name: "CSS", level: 20, note: "basics" },
  { name: "MATLAB", level: 20, note: "rarely use it" },
  { name: "JavaScript / TypeScript", level: 10, note: "more like a hobby" },
  { name: "PHP", level: 5, note: "not an expert" },
];

function barSegments(level, width = 10) {
  return Math.max(0, Math.min(width, Math.round((level / 100) * width)));
}

/* ── Projects ──────────────────────────────────────────────────────────── */
const projects = [
  {
    n: 1,
    title: "React – IT Internship & Career Job Board",
    summary: "What started as a small favor for fellow students has grown into something bigger: an hourly-updated aggregator that pulls IT internship and job listings from dozens of sources, including LinkedIn, Hungarian student job boards, and company career pages scraped directly with an AI agent. It deduplicates everything and is now growing into a full career platform, not just for one university's students.",
    images: internshipImgs,
    links: [
      { label: "Live", href: "https://intern-jobs-ppke.netlify.app/" },
    ],
    tags: ["react", "javascript", "vite", "css"],
  },
  {
    n: 2,
    title: "Java – Safer Client/Server",
    summary: "Thread-safe client–server communication; clean OOP structure.",
    images: javaImgs,
    links: [{ label: "Github Repository", href: "https://github.com/Andrssss/JAVA_NAGYHF_okosabb_megoldas" }],
    tags: ["java", "networking", "threading", "oop", "socket"],
  },
  {
    n: 3,
    title: "Python - Neural Network",
    summary: "This project pushed me to explore different network architectures and understand how to apply them in practice. It was part of a high-stakes competition, which we were in top 5, so as a reward, we didn’t have to take the final exam.",
    images: neuralImgs,
    links: [{ label: "Github Repository", href: "https://github.com/Gergobergo0/conTest" }],
    tags: ["python", "deep-learning", "pytorch", "pandas"],
  },
  {
    n: 4,
    title: "Python – AutoLab",
    summary: "Petri-dish automation: Arduino comms, GUI, and image processing.",
    images: pythonImgs,
    links: [{ label: "Github Repository", href: "https://github.com/Andrssss/AutoLab" }],
    tags: ["python", "arduino", "pyqt", "opencv", "pyserial", "threading"],
  },
];

/* ── Terminal window chrome ──────────────────────────────────────────────── */
function TerminalWindow({ title, className = "", hideBar = false, children }) {
  return (
    <div className={`term-card ${className}`.trim()}>
      {!hideBar && (
        <div className="term-bar">
          <span className="term-titlebar-text">{title}</span>
        </div>
      )}
      <div className="term-body">{children}</div>
    </div>
  );
}

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
            <img src={src} alt={`${altPrefix} ${idx + 1}`} loading="lazy" draggable="false" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="neo-cr_nav left"
            onMouseDown={(e)=>{ e.preventDefault(); }}
            onClick={() => setI(k => clamp(k - 1))}
            aria-label="Previous"
          >
            <span aria-hidden>&lt;</span>
          </button>
          <button
            type="button"
            className="neo-cr_nav right"
            onMouseDown={(e)=>{ e.preventDefault(); }}
            onClick={() => setI(k => clamp(k + 1))}
            aria-label="Next"
          >
            <span aria-hidden>&gt;</span>
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


/* ── Main ─────────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [open, setOpen] = useState(false);
  const [openProjects, setOpenProjects] = useState({});

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
    <section className="term-wrap">
      <div className="term-shellbar">
        <span className="term-shellbar-user">andras@portfolio</span>
        <span>:</span>
        <span className="term-shellbar-path">~$</span>
        <span className="term-shellbar-cmd">&nbsp;./run_portfolio.sh</span>
        <span className="term-cursor" aria-hidden>▍</span>
      </div>

      <div className="term-page">
        {/* LEFT RAIL */}
        <aside className="term-rail">
          <TerminalWindow title="andras@portfolio: ~/profile">
            <div className="term-pad">
              <div className="term-whoami">
                <img className="term-avatar" src={profileImg} alt="Profile" />
                <div>
                  <div className="term-name">Bakó András</div>
                  <div className="term-role">Computer Engineer</div>
                </div>
              </div>
              <div className="term-out">
                tel:&nbsp;&nbsp;+36 70 358 9977<br />
                mail: bak.andrs@gmail.com
              </div>
              <div className="term-links term-cv-btn">
                <button type="button" onClick={handleCvOpen} className="term-btn">
                  [ View CV ]
                </button>
                <a href="https://www.linkedin.com/in/andras-bako123/" target="_blank" rel="noreferrer" className="term-btn">
                  [ LinkedIn ]
                </a>
              </div>
            </div>
          </TerminalWindow>

          <TerminalWindow title="andras@portfolio: ~/education">
            <div className="term-pad">
              {education.map((e, i) => (
                <div key={i} className="term-edu-item">
                  <div className="term-edu-date">[{e.period}]</div>
                  <div className="term-edu-degree">{e.degree}</div>
                  <div className="term-edu-school">{e.school}</div>
                </div>
              ))}
            </div>
          </TerminalWindow>

          <TerminalWindow title="andras@portfolio: ~/skills">
            <div className="term-pad">
              {skills.map((s) => {
                const filled = barSegments(s.level);
                return (
                  <div key={s.name} className="term-skill">
                    <div className="term-skill-head">
                      <span>{s.name}</span>
                      <span className="term-skill-note">{s.note}</span>
                    </div>
                    <div className="term-skill-bar">
                      <span className="term-skill-track">
                        {Array.from({ length: 10 }, (_, i) => (
                          <span key={i} className={`term-skill-seg${i < filled ? " filled" : ""}`} />
                        ))}
                      </span>
                      <span className="pct">{s.level}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TerminalWindow>
        </aside>

        {/* RIGHT COLUMN */}
        <main className="term-main">
          <div className="term-projects-label">
            <span className="term-prompt">$</span> ls ~/work_experience/
          </div>

          <TerminalWindow title="andras@portfolio: ~/work_experience" className="term-card--pinned">
            <div className="term-pad">
              {experience.map((e, i) => (
                <div key={i} className="term-exp-item">
                  <div className="term-exp-top">
                    <div>
                      <span className="term-exp-role">{e.role}</span>{" "}
                      <span className="term-exp-company">@ {e.company}</span>
                    </div>
                    <div className="term-exp-period">
                      {e.period}
                      {e.duration && <span className="term-exp-duration"> · {e.duration}</span>}
                    </div>
                  </div>
                  <ul className="term-exp-bullets">
                    {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </TerminalWindow>

          <div className="term-projects-label">
            <span className="term-prompt">$</span> ls ~/projects/
          </div>

          {projects.map((p) => {
            const isOpen = !!openProjects[p.n];
            return (
              <TerminalWindow
                key={p.n}
                className="term-card--project"
                hideBar
              >
                <button
                  type="button"
                  className="term-project-toggle"
                  aria-expanded={isOpen}
                  onClick={() => setOpenProjects((prev) => ({ ...prev, [p.n]: !prev[p.n] }))}
                >
                  <span className="term-project-num">{String(p.n).padStart(2, "0")}</span>
                  <span className="term-project-toggle-title">{p.title}</span>
                  <span className="term-project-chevron">{isOpen ? "[ − ]" : "[ + ]"}</span>
                </button>

                {isOpen && (
                  <div className="term-project-content">
                    {p.images.length > 0 && (
                      <div className="term-project-media">
                        <Carousel images={p.images} altPrefix={p.title} />
                      </div>
                    )}
                    <div className="term-pad">
                      <p className="term-project-summary">{p.summary}</p>
                      <div className="term-tags">
                        {p.tags.map((t) => <span key={t} className="term-tag">--{t}</span>)}
                      </div>
                      <div className="term-links">
                        {p.links.map((l) => (
                          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="term-btn">
                            [ {l.label} ]
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TerminalWindow>
            );
          })}
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
