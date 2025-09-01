import React, { useRef, useState, useEffect } from "react";

/* ── Profile image ─────────────────────────────────────────────────────── */
import profileImg from "./assets/portfolio/profile/profile.jpg";

/* ── Folder imports (Vite literal globs) ───────────────────────────────── */
const neuralImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/neural_net/*.{png,jpg,jpeg}", { eager: true, import: "default" })
).sort(([a],[b]) => a.localeCompare(b, undefined, { numeric: true })).map(([,m]) => m);

const websiteImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/website/*.{png,jpg,jpeg}", { eager: true, import: "default" })
).sort(([a],[b]) => a.localeCompare(b, undefined, { numeric: true })).map(([,m]) => m);

const javaImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/java_client_server/*.{png,jpg,jpeg}", { eager: true, import: "default" })
).sort(([a],[b]) => a.localeCompare(b, undefined, { numeric: true })).map(([,m]) => m);

const pythonImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/python_autolab/*.{png,jpg,jpeg}", { eager: true, import: "default" })
).sort(([a],[b]) => a.localeCompare(b, undefined, { numeric: true })).map(([,m]) => m);

/* ── Sidebar data ──────────────────────────────────────────────────────── */
const skills = [
  { name: "C++", level: 70, note: "≈4 years, active" },
  { name: "Python", level: 75, note: "≈2 years, frequent" },
  { name: "Java", level: 70, note: "love it" },
  { name: "HTML", level: 50, note: "occasional" },
  { name: "CSS", level: 50, note: "basics" },
  { name: "JavaScript / TypeScript", level: 60, note: "heavily learning" },
  { name: "PHP", level: 55, note: "not an expert" },
  { name: "SQL", level: 40, note: "Love it, used it for website" },
  { name: "MATLAB", level: 30, note: "rarely use it" },
];

/* ── Projects ──────────────────────────────────────────────────────────── */
const projects = [
  {
    n: 1,
    title: "Python - Neural Network",
    summary: "This project pushed me to explore different network architectures and understand how to apply them in practice. It was part of a high-stakes competition, which we were in top 5, so as a reward, we didn’t have to take the final exam.",
    images: neuralImgs,
    links: [{ label: "Github Repository", href: "https://github.com/Gergobergo0/conTest" }],
    tags: ["Python", "Deep Learning", "PyTorch","Pandas"],
  },  
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
    tags: ["Java", "Networking"],
  },
  {
    n: 4,
    title: "Python – AutoLab",
    summary: "Petri-dish automation: Arduino comms, GUI, and image processing.",
    images: pythonImgs,
    links: [{ label: "Github Repository", href: "https://github.com/Andrssss/AutoLab" }],
    tags: ["Python", "Arduino", "PyQt", "OpenCV","pySerial"],
  },
];

/* ── Minimal carousel (auto-height, no cropping) ───────────────────────── */
function Carousel({ images, altPrefix = "Slide" }) {
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const drag = useRef({ x: 0, t: 0, live: false });
  const clamp = (n) => Math.max(0, Math.min(n, images.length - 1));

  useEffect(() => {
    ref.current?.children[i]?.scrollIntoView({ behavior: "smooth", inline: "start" });
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
    <button className="neo-cr_nav left"  onClick={() => setI((k) => clamp(k - 1))} aria-label="Previous">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 19L8 12l7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
    <button className="neo-cr_nav right" onClick={() => setI((k) => clamp(k + 1))} aria-label="Next">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </>
)}



    </div>
  );
}

/* ── Main (one-card per project: image + description together) ─────────── */
export default function Portfolio() {
  return (
    <section className="neo-wrap">
      <div className="neo-cols">
        {/* LEFT RAIL */}
        <aside className="neo-rail">
          <div className="neo-card neo-center">
            <img className="neo-avatar" src={profileImg} alt="Profile" />
            <div className="neo-title">Computer Engineering student</div>
          </div>

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

      {/* ── Styles ───────────────────────────────────────────────────────── */}
      <style>{`
          :root{
            --bg:#fafbfc; --ink:#11151a; --muted:#5d6674;
            --line:#e6e9ef; --line-strong:#d8dde6; --card:#ffffff;
            --accent:#0f8bff; --radius:12px; --shadow:0 6px 24px rgba(0, 0, 0, 0.26);
            --sans: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", sans-serif;
          }
          *{box-sizing:border-box}
          body{background:var(--bg)}
          .neo-wrap{max-width:1160px;margin:0 auto;padding:28px 16px 90px;color:var(--ink);font:15px/1.5 var(--sans)}
          .neo-cols{display:grid;grid-template-columns:300px 1fr;gap:24px}
          @media (max-width:980px){.neo-cols{grid-template-columns:1fr}}

          .neo-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
          .neo-center{text-align:center;padding:18px}
          .neo-title{margin-top:8px;color:var(--muted)}
          .neo-avatar {
            width:180px;
            height:180px;
            object-fit:cover;
            border-radius:12px; /* slightly softer */
            border:1px solid var(--line-strong);
            transition: transform .25s ease, box-shadow .25s ease;
          }
          .neo-section{padding:14px 16px 6px;font-weight:700;letter-spacing:.2px;border-bottom:1px solid var(--line)}

          .neo-rail{position:sticky;top:16px;height:fit-content;display:grid;gap:16px}
          .neo-skilllist{padding:12px 16px 16px;display:grid;gap:14px}
          .neo-skill-head{display:flex;justify-content:space-between;gap:10px}
          .neo-skill-note{color:var(--muted);font-size:12px}
          .neo-bar{height:6px;border:1px solid var(--line);border-radius:999px;background:#f1f4fa;overflow:hidden;margin-top:6px}
          .neo-bar>span{display:block;height:100%;background:linear-gradient(90deg,var(--accent),#78c6ff)}

          .neo-main{position:relative;display:grid;gap:150px}
          .neo-main::before{content:"";position:absolute;left:22px;top:0;bottom:0;width:2px;background:var(--line)}
          .neo-item{display:grid;grid-template-columns:50px 1fr;gap:16px;align-items:start}
          .neo-dot{grid-column:1;font:12px/1 ui-monospace;color:#fff;background:#222b38;border:1px solid var(--line-strong);border-radius:999px;padding:5px 8px;text-align:center;position:sticky;top:12px}

          /* unified project card */
          .neo-article{grid-column:2; overflow:hidden}
          .neo-body{padding:16px 18px; border-top:1px solid var(--line)}
          .neo-h3{margin:0 0 8px; font-size:20px}
          .neo-muted{color:var(--muted)}
          .neo-tags{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 12px}
          .neo-tag{padding:4px 8px;border:1px solid var(--line);border-radius:999px;background:#f3f7ff;color:#0b3b82;font-weight:600;font-size:12px}
          .neo-links{display:flex;gap:8px}
          .neo-btn{padding:7px 12px;border:1px solid var(--line);border-radius:8px;background:#f3f7ff;color:#0b3b82;text-decoration:none;font-weight:600}
          .neo-btn:hover{background:#e8f1ff}

          /* ── CAROUSEL (auto-height) ───────────────────────────────────────────── */
          .neo-cr{position:relative; outline:none}
          .neo-cr_vp{
            /* KEY CHANGE: auto height based on images */
            width:100%;
            display:grid; grid-auto-flow:column; grid-auto-columns:100%;
            overflow-x:auto; overflow-y:hidden;
            scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;
            border-bottom:1px solid var(--line);
            scrollbar-width:none;
          }
          .neo-cr_vp::-webkit-scrollbar{display:none}
          .neo-cr_slide{scroll-snap-align:start}
          .neo-cr_slide img{
            /* KEY CHANGE: never crop; grow height naturally */
            width:100%;
            height:auto;
            object-fit:contain;
            display:block;
          }

          /* nav buttons */
          /* nav buttons */
          .neo-cr_nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px; height: 44px; padding: 0; border: 0;
            display: flex; align-items: center; justify-content: center;

            /* 🔵 gradient background */
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            border-radius: 8px;
            color: #fff;   /* white arrow for contrast */

            opacity: 0;
            transition: opacity .15s, transform .08s;
            z-index: 3;
          }


          .neo-cr:hover .neo-cr_nav,
          .neo-cr_nav:focus-visible { opacity: .95; }

          /* left/right placement */
          .neo-cr_nav.left  { left: 4px; }
          .neo-cr_nav.right { right: 4px; }

          /* arrow style */
          .neo-cr_nav svg {
            width: 22px; height: 22px;
            stroke: currentColor; fill: none; stroke-width: 2;
            filter: drop-shadow(0 0 4px rgba(0,0,0,.55));
          }

          /* hover nudge */
          .neo-cr_nav:hover { transform: translateY(-50%) scale(1.04); }

          /* dots */
          .neo-cr_dots{position:absolute; left:0; right:0; bottom:8px; display:flex; justify-content:center; gap:6px}
          .neo-cr_dot{width:8px; height:8px; border-radius:50%; border:1px solid var(--line); background:#e8edf7; cursor:pointer}
          .neo-cr_dot.active{background:#0b3b82; border-color:#0b3b82}
      `}</style>
    </section>
  );
}
