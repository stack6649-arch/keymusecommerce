import React from "react";
// imports from the same folder used by the Terms page — rename your files locally as needed
import founderHero from "../assets/images/dashboard/contact-us.png";
import buildingImg from "../assets/images/dashboard/about-large.png";
import teamImg from "../assets/images/dashboard/about-small.png";

/**
 * About.jsx
 *
 * - Arranged to match the screenshots on desktop and mobile:
 *   - Large uppercase page heading with blue underline, left-aligned inside the content column.
 *   - Small blue section title ("Our Founder's Story") and body copy under the heading.
 *   - Large building image left, smaller team image to the right with "ABOUT US" heading and blue rule.
 *   - Centered "OUR MISSION" section with underline and descriptive copy below.
 * - Images are imported from ../assets/images/dashboard/.
 * - This file only updates layout and styles here; it does not touch or remove anything else.
 */

export default function About() {
  return (
    <div className="ga-about-page">
      <style>{`
        /* Page container */
        .ga-about-page {
          background: #ffffff;
          color: #111;
          min-height: 100%;
          box-sizing: border-box;
          padding: 36px 20px;
          display: flex;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .ga-about-container {
          width: 100%;
          max-width: 1100px;
          box-sizing: border-box;
          margin: 0 auto;
        }

        /* Header row: hero image left + titles/content right */
        .ga-header-row {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .ga-hero-figure {
          flex: 0 0 360px;
          min-width: 220px;
        }

        .ga-hero-figure img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 8px;
          object-fit: cover;
        }

        .ga-header-content {
          flex: 1 1 420px;
          min-width: 260px;
        }

        /* Page title */
        .ga-page-title {
          font-size: 40px;
          font-weight: 900;
          margin: 0 0 10px 0;
          color: #111;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .ga-title-underline {
          height: 6px;
          width: 220px;
          background: #1f4de6;
          border-radius: 3px;
          margin-top: 8px;
        }

        .ga-small-section-title {
          color: #1f4de6;
          font-size: 20px;
          font-weight: 800;
          margin: 18px 0 12px 0;
        }

        .ga-paragraph {
          color: #111;
          font-size: 15px;
          line-height: 1.75;
          margin-bottom: 14px;
        }

        /* ABOUT US row */
        .ga-about-row {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          margin-top: 28px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .ga-about-left {
          flex: 0 0 560px;
          max-width: 100%;
        }
        .ga-about-left img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 6px;
          object-fit: cover;
        }

        .ga-about-right {
          flex: 1 1 320px;
          min-width: 260px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ga-about-heading {
          font-size: 22px;
          font-weight: 900;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .ga-about-rule {
          height: 4px;
          width: 120px;
          background: #1f4de6;
          margin-top: 6px;
          border-radius: 2px;
        }

        .ga-about-right img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 6px;
          object-fit: cover;
        }

        /* Mission section (centered) */
        .ga-mission {
          text-align: center;
          padding-top: 32px;
          padding-bottom: 36px;
        }

        .ga-mission-title {
          font-size: 34px;
          font-weight: 900;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          color: #111;
        }

        .ga-mission-underline {
          height: 6px;
          width: 220px;
          background: #1f4de6;
          margin: 12px auto 18px auto;
          border-radius: 3px;
        }

        .ga-mission-subtitle {
          font-size: 16px;
          font-weight: 700;
          color: #111;
          max-width: 820px;
          margin: 0 auto 18px auto;
          line-height: 1.7;
        }

        .ga-mission-paragraph {
          max-width: 860px;
          margin: 0 auto;
          color: #111;
          font-size: 14px;
          line-height: 1.8;
          text-align: left;
        }

        .ga-mission-paragraph p { margin-bottom: 14px; }

        /* Footer spacing so page breathing matches screenshots */
        .ga-footer-space { height: 32px; }

        /* Responsive: stack on small screens to match mobile screenshots */
        @media (max-width: 900px) {
          .ga-page-title { font-size: 28px; }
          .ga-hero-figure { flex: 1 1 100%; }
          .ga-header-content { flex: 1 1 100%; }
          .ga-about-row { flex-direction: column; }
          .ga-about-left { flex: 1 1 100%; }
          .ga-about-right { flex: 1 1 100%; }
          .ga-mission-title { font-size: 24px; }
          .ga-title-underline { width: 140px; }
          .ga-mission-underline { width: 140px; }
        }
      `}</style>

      <div className="ga-about-container">
        {/* Header */}
        <div className="ga-header-row">
          <figure className="ga-hero-figure" aria-hidden>
            <img src={founderHero} alt="Founder's hero" />
          </figure>

          <div className="ga-header-content">
            <h1 className="ga-page-title">OUR FOUNDER'S STORY</h1>
            <div className="ga-title-underline" />

            <div className="ga-small-section-title">Our Founder's Story</div>

            <div className="ga-paragraph">
              KEYMUS-Ecommerce was founded by experienced e-commerce merchants and startup entrepreneurs who set out to build the tools they once wished they had.
            </div>

            <div className="ga-paragraph">
              From the very beginning, the platform achieved product — market fit, attracting a large and passionate community of Shopify brands eager to save time and increase revenue. Backed by Shopify and leading investors, KEYMUS-Ecommerce is on a mission to democratize cutting-edge AI and automation — empowering small and medium-sized e-commerce businesses to turn their data into profitability.
            </div>

            <div className="ga-small-section-title">Our Mission</div>
            <div className="ga-paragraph">
              Democratizing advanced technologies for the everyday entrepreneur.
            </div>
            <div className="ga-paragraph">
              We believe the world has gone through three major work revolutions in the past 20 years, creating an unprecedented volume of entrepreneurial opportunities. These changes have created economic mobility for millions around the world. This includes The Creator Economy, The Gig Economy and the E-commerce boom.
            </div>
            <div className="ga-paragraph">
              We believe that democratizing advanced technologies such as automation, AI, and data visualization will empower millions of entrepreneurs with an edge historically reserved for the Fortune 500.
            </div>
           <div className="ga-paragraph">
              We believe this will have an unmatched positive impact on the world and we are on a mission to unlock the human force of creativity.
            </div>
          </div>
        </div>

        {/* ABOUT US area */}
        <div className="ga-about-row">
          <div className="ga-about-left">
            <img src={buildingImg} alt="Building visual" />
          </div>

          <aside className="ga-about-right" aria-labelledby="about-us-heading">
            <div>
              <h3 id="about-us-heading" className="ga-about-heading">ABOUT US</h3>
              <div className="ga-about-rule" />
            </div>

            <div>
              <img src={teamImg} alt="Team visual" />
            </div>
          </aside>
        </div>

        {/* OUR MISSION centered */}
        <section className="ga-mission" aria-labelledby="our-mission-heading">
          <h2 id="our-mission-heading" className="ga-mission-title">OUR MISSION</h2>
          <div className="ga-mission-underline" />
          <div className="ga-mission-subtitle">Democratizing advanced technologies for the everyday entrepreneur.</div>

          <div className="ga-mission-paragraph">
            <p>
              We believe the world has gone through three major work revolutions in the past 20 years, creating an unprecedented volume of entrepreneurial opportunities. These changes have created economic mobility for millions around the world. This includes The Creator Economy, The Gig Economy and the E-commerce boom.
            </p>
            <p>
              We believe that democratizing advanced technologies such as automation, AI, and data visualization will empower millions of entrepreneurs with an edge historically reserved for the Fortune 500.
            </p>
            <p style={{ marginBottom: 0 }}>
              We believe this will have an unmatched positive impact on the world and we are on a mission to unlock the human force of creativity.
            </p>
          </div>
        </section>

        <div className="ga-footer-space" />
      </div>
    </div>
  );
}
