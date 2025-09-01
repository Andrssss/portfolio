import React, { useRef, useState, useEffect } from "react";

/* ===== Profile ===== */
import profileImg from "./assets/portfolio/profile/profile.jpg";

/* ===== Auto-load images per project folder ===== */
const neuralImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/neural_net/*.{png,jpg,jpeg}", {
    eager: true,
    import: "default",
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, mod]) => mod);

const websiteImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/website/*.{png,jpg,jpeg}", {
    eager: true,
    import: "default",
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, mod]) => mod);

const javaImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/java_client_server/*.{png,jpg,jpeg}", {
    eager: true,
    import: "default",
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, mod]) => mod);

const pythonImgs = Object.entries(
  import.meta.glob("./assets/portfolio/works/python_autolab/*.{png,jpg,jpeg}", {
    eager: true,
    import: "default",
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, mod]) => mod);
/* ========= Sidebar skills (edit freely) ========= */
const skills = [
  { name: "C++",          stars: 5, note: "~7 years, aktívan" },
  { name: "Python",       stars: 5, note: "~6 years, gyakran" },
  { name: "HTML",         stars: 5, note: "alkalomszerűen" },
  { name: "CSS",          stars: 5, note: "SCSS, alapok" },
  { name: "JS / TS",      stars: 5, note: "React, Node" },
  { name: "PHP",          stars: 3, note: "nem expert" },
  { name: "SQL / noSQL",  stars: 4, note: "MariaDB, Oracle" },
  { name: "Matlab",       stars: 3, note: "szükség esetén" },
  { name: "Java",         stars: 4, note: "tetszett" },
  { name: "LabVIEW",      stars: 3, note: "alapok" },
];

/* ========= Projects ========= */
const projects = [
  {
    title: "Neurális háló finomhangolás",
    description:
      "Előre betanított képfeldolgozó háló feladat-specifikus finomhangolása.",
    images: neuralImgs,
    links: [{ label: "Repo", href: "https://github.com/Gergoberg00/conTest" }],
    tags: ["Python", "DL", "CV"],
  },
  {
    title: "Személyes weboldal",
    description:
      "Hobbi projekt – webfejlesztési technikák gyakorlása és kipróbálása.",
    images: websiteImgs,
    links: [
      { label: "Live", href: "https://bakan7.netlify.app/" },
      { label: "Repo", href: "https://github.com/Andrssss/MyWebsite" },
    ],
    tags: ["HTML", "CSS", "JS"],
  },
  {
    title: "JAVA – okosabb megoldás",
    description:
      "Szerver–kliens kommunikáció szálbiztosan, OOP elvek mentén.",
    images: javaImgs,
    links: [
      { label: "Repo", href: "https://github.com/Andrssss/JAVA_NAGYHF_okosabb_megoldas" },
    ],
    tags: ["Java", "Networking"],
  },
  {
    title: "Python – AutoLab",
    description:
      "Petri-csésze automatizálás: Arduino kommunikáció, GUI és képfeldolgozás.",
    images: pythonImgs,
    links: [{ label: "Repo", href: "https://github.com/Andrssss/AutoLab" }],
    tags: ["Python", "Arduino", "GUI"],
  },
];

/* ========= Carousel (no deps) ========= */
function Carousel({ images, altPrefix = "Slide" }) {
  const [idx, setIdx] = useState(0);
  const viewportRef = useRef(null);
  const start = useRef({ x: 0, t: 0, active: false });
  const clamp = (n) => Math.max(0, Math.min(n, images.length - 1));

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.children[idx]?.scrollIntoView({ behavior: "smooth", inline: "start" });
  }, [idx]);

  const startDrag = (x) => (start.current = { x, t: Date.now(), active: true });
  const endDrag = (x) => {
    if (!start.current.active) return;
    const dx = x - start.current.x;
    const dt = Date.now() - start.current.t;
    const vx = Math.abs(dx) / Math.max(dt, 1);
    const thresh = 60;
    if (dx > thresh || (dx > 12 && vx > 0.7)) setIdx((i) => clamp(i - 1));
    else if (dx < -thresh || (dx < -12 && vx > 0.7)) setIdx((i) => clamp(i + 1));
    start.current.active = false;
  };

  if (!images?.length) return null;

  return (
    <div className="carousel" tabIndex={0} onKeyDown={(e)=> {
      if (e.key === "ArrowLeft") setIdx((i)=>clamp(i-1));
      if (e.key === "ArrowRight") setIdx((i)=>clamp(i+1));
    }}>
      <div
        className="carousel__viewport"
        ref={viewportRef}
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseUp={(e) => endDrag(e.clientX)}
        onMouseLeave={(e) => endDrag(e.clientX)}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
      >
        {images.map((src, i) => (
          <div className="carousel__slide" key={i} aria-hidden={i !== idx}>
            <img src={src} alt={`${altPrefix} ${i + 1}`} loading="lazy" draggable="false" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button className="carousel__nav left"  onClick={() => setIdx((i)=>clamp(i-1))}>‹</button>
          <button className="carousel__nav right" onClick={() => setIdx((i)=>clamp(i+1))}>›</button>
          <div className="carousel__dots">
            {images.map((_, i) => (
              <button key={i} className={`dot ${i===idx?'active':''}`} onClick={() => setIdx(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ========= Main ========= */
export default function Portfolio() {
  return (
    <section className="portfolio">
      {/* Two-column canvas */}
      <div className="grid">
        {/* LEFT: sticky sidebar */}
        <aside className="sidebar">
          <div className="card">
            <img className="avatar" src={profileImg} alt="Profile" />
            <h1>Portfolio</h1>
            <p className="muted">Villamosmérnök – beágyazott rendszerek, Python, Java, web.</p>
          </div>

          <div className="card">
            <h2>Programming languages</h2>
            <div className="skills">
              {skills.map((s) => (
                <div className="skill" key={s.name}>
                  <div className="row">
                    <span className="name">{s.name}</span>
                    <span className="stars" aria-label={`${s.stars} / 5`}>
                      {"★★★★★☆☆☆☆☆".slice(5 - s.stars, 10 - s.stars)}
                      {"★".repeat(s.stars)}
                    </span>
                  </div>
                  <div className="bar">
                    <span style={{ width: `${(s.stars / 5) * 100}%` }} />
                  </div>
                  {s.note && <div className="note">{s.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT: stacked projects */}
        <main className="projects">
          {projects.map((p, i) => (
            <article className="project" key={i}>
              <Carousel images={p.images} altPrefix={p.title} />
              <div className="project__body">
                <h3>{p.title}</h3>
                <p className="muted">{p.description}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
                <div className="links">
                  {p.links.map((l) => (
                    <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>

      {/* Scoped styles */}
      <style>{`
        :root{
          --bg:#0d0f14;
          --panel:#131720;
          --panel2:#111521;
          --text:#f5f7fb;
          --muted:#c9cce1;
          --line:rgba(255,255,255,.07);
          --accent:#7da2ff;
        }
        .portfolio{max-width:1200px;margin:0 auto;padding:24px 16px 80px;color:var(--text);}
        .grid{display:grid;grid-template-columns:320px 1fr;gap:24px;}
        @media(max-width:980px){.grid{grid-template-columns:1fr;}}
        .sidebar{position:sticky;top:16px;height:fit-content;display:grid;gap:16px;}
        .card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:16px;padding:16px;box-shadow:0 16px 40px rgba(0,0,0,.35);}
        .avatar{width:120px;height:120px;border-radius:999px;object-fit:cover;border:2px solid var(--line);display:block;margin:4px auto 10px;}
        h1{margin:0 0 6px;text-align:center;font-size:28px;}
        h2{margin:0 0 10px;font-size:18px;}
        .muted{color:var(--muted);}
        .skills{display:grid;gap:12px;}
        .skill .row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
        .skill .name{font-weight:600;}
        .skill .stars{font-variant-numeric:tabular-nums;opacity:.8;}
        .skill .bar{height:6px;background:#1a2030;border-radius:999px;overflow:hidden;border:1px solid var(--line);}
        .skill .bar > span{display:block;height:100%;background:linear-gradient(90deg,var(--accent),#51d1ff);}
        .skill .note{font-size:12px;color:var(--muted);margin-top:4px;}

        .projects{display:grid;gap:28px;}
        .project{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 18px 42px rgba(0,0,0,.35);}
        .project__body{padding:16px 18px 18px;}
        .project__body h3{margin:0 0 6px;font-size:22px;}
        .tags{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 12px;}
        .tag{font-size:12px;padding:6px 10px;border-radius:999px;background:#1b2234;border:1px solid var(--line);}
        .links{display:flex;gap:10px;}
        .btn{padding:8px 12px;border-radius:10px;border:1px solid var(--line);background:#1a2132;color:var(--text);text-decoration:none;}
        .btn:hover{background:#242c42;}

        /* Carousel */
        .carousel{position:relative;outline:none;}
        .carousel__viewport{
          width:100%;
          max-height:560px;
          aspect-ratio:16/9;
          background:#0f1322;
          overflow-x:auto;overflow-y:hidden;
          display:grid;grid-auto-flow:column;grid-auto-columns:100%;
          scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;
        }
        .carousel__slide{scroll-snap-align:start;}
        .carousel__slide img{width:100%;height:100%;object-fit:cover;display:block;}
        .carousel__nav{
          position:absolute;top:50%;transform:translateY(-50%);
          width:42px;height:42px;border-radius:999px;border:1px solid var(--line);
          background:rgba(20,24,36,.9);color:var(--text);cursor:pointer;font-size:22px;
          box-shadow:0 10px 25px rgba(0,0,0,.45);
        }
        .carousel__nav.left{left:10px;}
        .carousel__nav.right{right:10px;}
        .carousel__dots{position:absolute;left:0;right:0;bottom:10px;display:flex;gap:8px;justify-content:center;}
        .dot{width:10px;height:10px;border-radius:999px;border:1px solid var(--line);background:#1a2132;opacity:.85;cursor:pointer;}
        .dot.active{background:#eaf0ff;border-color:transparent;}
      `}</style>
    </section>
  );
}