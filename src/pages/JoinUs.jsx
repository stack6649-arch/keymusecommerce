import React from "react";
import join1 from "../assets/images/dashboard/join1.png";
import join2 from "../assets/images/dashboard/join2.png";
import join3 from "../assets/images/dashboard/join3.png";
import join4 from "../assets/images/dashboard/join4.png";
// keep the original hero asset import but reference it as joinHero so join2.png is not reused for the hero
import joinHero from "../assets/images/dashboard/joinus1.988bf9b.png";

/**
 * JoinUs.jsx
 *
 * Updated so the hero image is imported separately as `joinHero` and the second culture image
 * is imported as `join2.png` (no longer sharing the same file). Everything else in this file
 * is preserved.
 *
 * This file intentionally modifies only imports and the hero image reference.
 */

const JOBS = [
  {
    id: 1,
    title: "Office & Admin Executive",
    meta: ["Full-time", "Entry-level"],
    description:
      "Report to the Head of HR and dotted line to Head of Finance, the Office & Admin Executive would be responsible for supporting the administrative function in accordance with company standards. This role requires a high level of professionalism, discretion, and confidentiality.",
    bullets: [
      "Support of part time management including attendance tracking, payroll calculation and agreement collection.",
    ],
  },
  { id: 2, title: "Business Development Manager", meta: ["Full-time", "Mid-level"] },
  { id: 3, title: "Front End Developer", meta: ["Full-time", "Entry-level"] },
  { id: 4, title: "Event & Sales Assistant", meta: ["Full-time", "Entry-level"] },
  { id: 5, title: "Assistant Accountant", meta: ["Full-time", "Entry-level"] },
  { id: 6, title: "Stock & Operations Specialist (Frontline) - Inventory Management", meta: ["Full-time", "Entry-level"] },
];

export default function JoinUs() {
  return (
    <div className="ga-join-page">
      <style>{`
        :root {
          --blue: #1f4de6;
          --dark: #111;
          --muted: #efefef;
          --box-gray: #f5f5f5;
        }

        .ga-join-page {
          background: #fbf9f5;
          min-height: 100vh;
          box-sizing: border-box;
          padding: 18px 16px 80px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: var(--dark);
        }

        .ga-join-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Two-column layout: left main content, right sidebar with join & culture items */
        .ga-top-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }

        /* On small screens stack */
        @media (max-width: 900px) {
          .ga-top-grid {
            grid-template-columns: 1fr;
          }
        }

        .ga-main {
          /* left column main content */
        }

        .ga-sidebar {
          /* right column: Join CTA + culture stacked */
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .ga-page-title {
          font-size: 32px;
          font-weight: 900;
          margin: 6px 0 6px 0;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .ga-underline {
          width: 160px;
          height: 6px;
          background: var(--blue);
          border-radius: 3px;
          margin-bottom: 18px;
        }

        /* semi-bold body text as requested */
        .ga-paragraph {
          font-size: 15px;
          color: var(--dark);
          line-height: 1.7;
          margin-bottom: 14px;
          font-weight: 600; /* semi-bold for body copy */
        }

        /* hero image large */
        .ga-hero-wrapper {
          margin-top: 8px;
        }
        .ga-hero-image {
          width: 100%;
          height: auto;
          border-radius: 6px;
          display: block;
          object-fit: cover;
        }

        /* JOIN US label (in sidebar) */
        .ga-join-cta {
          color: var(--blue);
          font-weight: 900;
          font-size: 20px;
          text-transform: uppercase;
          align-self: flex-start;
        }

        /* OUR VIBRANT CULTURE heading in sidebar */
        .ga-culture-heading {
          font-size: 18px;
          font-weight: 900;
          text-transform: uppercase;
          margin: 6px 0 0 0;
        }

        .ga-culture-rule {
          height: 4px;
          width: 120px;
          background: var(--blue);
          border-radius: 3px;
          margin: 6px 0 12px 0;
        }

        /* stacked blue boxes in sidebar (desktop) */
        .ga-culture-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ga-culture-item {
          background: var(--blue);
          color: #fff;
          padding: 14px 12px;
          font-weight: 700;
          border-radius: 3px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .ga-culture-item img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          flex-shrink: 0;
        }

        /* Current openings area (full width under grid) */
        .ga-openings {
          margin-top: 36px;
        }

        .ga-openings-title {
          font-size: 28px;
          font-weight: 900;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .ga-openings-rule {
          width: 220px;
          height: 6px;
          background: var(--blue);
          border-radius: 3px;
          margin-bottom: 18px;
        }

        .ga-jobs-list { margin-top: 12px; }

        .ga-job-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 4px;
          padding: 18px;
          margin-bottom: 14px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: start;
        }

        .ga-job-meta{
          font-size: 13px;
          color: #666;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .ga-apply-btn {
          background: var(--blue);
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 800;
        }

        .ga-job-desc {
          margin-top: 10px;
          font-size: 14px;
          color: #333;
          line-height: 1.6;
          font-weight: 600; /* semi-bold body inside job card */
        }

        .ga-job-bullets {
          margin-top: 10px;
          margin-left: 18px;
        }

        .ga-job-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 12px 16px;
          margin-bottom: 10px;
          border-radius: 3px;
        }

        .ga-job-row-left {
          display:flex;
          flex-direction: column;
        }

        .ga-job-number {
          font-weight: 900;
          margin-right: 10px;
        }

        .ga-job-title {
          font-weight: 800;
          font-size: 15px;
          margin-bottom: 6px;
        }

        .ga-job-tags {
          color: #777;
          font-size: 13px;
        }

        /* ensure semi-bold for most textual elements */
        .ga-page-title, .ga-page-title, h2, h3, h4 { font-weight: 800; }

      `}</style>

      <div className="ga-join-container">
        {/* Top grid: main content + sidebar */}
        <div className="ga-top-grid">
          <main className="ga-main" role="main">
            <h2 className="ga-page-title">WHAT WE DO</h2>
            <div className="ga-underline" />

            <p className="ga-paragraph">
              Founded in 2015 by Guido Arnplini, bringing a pioneer members-only flash sales concept from France to Hong Kong by hosting regular flash sales in-store and online.
            </p>

            <p className="ga-paragraph">
              KEYMUS-Ecommerce, the driving force behind global digital excellence, covering every aspect of online customer acquisition and website performance.
            </p>

            <p className="ga-paragraph">
              All of that with a local approach to each market where our strategies are rooted in data-driven insights and adaptable to the dynamic nature of user behaviour.
            </p>

            <p className="ga-paragraph">
              Sustainability is a core value of KEYMUS-Ecommerce, since the beginning. We aimed to minimize waste and saved 1.8 million items and counting from landfill. We, formed a team of KEYMUS-Ecommerce, continue to take efforts in social responsibility, such as minimizing carbon footprint, supporting community services, and charity sales etc.
            </p>

            <div className="ga-hero-wrapper">
              {/* large hero image (now uses joinHero so join2.png is free for the culture icon) */}
              <img src={joinHero} alt="Join hero" className="ga-hero-image" />
            </div>
          </main>

          <aside className="ga-sidebar" aria-labelledby="join-cta">
            <div id="join-cta" className="ga-join-cta">JOIN US</div>

            <div>
              <div className="ga-culture-heading">OUR VIBRANT CULTURE</div>
              <div className="ga-culture-rule" />
              <div className="ga-culture-list" role="list">
                <div className="ga-culture-item" role="listitem">
                  <img src={join1} alt="culture 1" />
                  <div>Family spirit is driven by humility</div>
                </div>

                <div className="ga-culture-item" role="listitem">
                  {/* second culture item now uses join2.png (separate import) */}
                  <img src={join2} alt="culture 2" />
                  <div>Entrepreneurship is driven by curiosity</div>
                </div>

                <div className="ga-culture-item" role="listitem">
                  <img src={join3} alt="culture 3" />
                  <div>Panache is driven by passion</div>
                </div>

                <div className="ga-culture-item" role="listitem">
                  <img src={join4} alt="culture 4" />
                  <div>Sustainability is driven by positive impact</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Current openings - full width below */}
        <section className="ga-openings" aria-labelledby="openings-heading">
          <h3 id="openings-heading" className="ga-openings-title">CURRENT OPENINGS</h3>
          <div className="ga-openings-rule" />
          <div style={{ color: "var(--blue)", fontWeight: 700, marginBottom: 8 }}>6 jobs found</div>

          <div className="ga-jobs-list">
            {/* first job expanded */}
            {JOBS.slice(0, 1).map((job) => (
              <article key={job.id} className="ga-job-card" aria-labelledby={`job-${job.id}-title`}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div id={`job-${job.id}-title`} style={{ fontWeight: 900, fontSize: 16 }}>
                      01. {job.title}
                    </div>
                    <div className="ga-job-meta">
                      {job.meta.map((m, i) => (
                        <span key={i} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <circle cx="12" cy="12" r="10" stroke="#ddd" strokeWidth="1" />
                          </svg>
                          <span>{m}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="ga-job-desc">
                    <strong>Job Description</strong>
                    <div style={{ marginTop: 8 }}>{job.description}</div>

                    {job.bullets && job.bullets.length > 0 && (
                      <ul className="ga-job-bullets">
                        {job.bullets.map((b, idx) => (
                          <li key={idx} style={{ marginBottom: 6, fontSize: 14, color: "#333", fontWeight: 600 }}>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
                  <button className="ga-apply-btn" aria-label="Apply now for Office & Admin Executive">APPLY NOW</button>
                </div>
              </article>
            ))}

            {/* remaining compact job rows */}
            {JOBS.slice(1).map((job) => (
              <div key={job.id} className="ga-job-row" role="article" aria-labelledby={`compact-${job.id}`}>
                <div className="ga-job-row-left">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="ga-job-number">{String(job.id).padStart(2, "0")}.</div>
                    <div>
                      <div id={`compact-${job.id}`} className="ga-job-title">{job.title}</div>
                      <div className="ga-job-tags">{job.meta.join(" • ")}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button className="ga-apply-btn" aria-label={`Apply now for ${job.title}`}>APPLY NOW</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
