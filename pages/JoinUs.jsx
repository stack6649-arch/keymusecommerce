import React from "react";
import join1 from "../assets/images/dashboard/join1.png";
import join2 from "../assets/images/dashboard/join2.png";
import join3 from "../assets/images/dashboard/join3.png";
import join4 from "../assets/images/dashboard/join4.png";

/**
 * JoinUs.jsx
 *
 * Recreates the "Join Us" page as shown in the screenshots:
 * - Uses the global header/footer provided by the app (this file does not include them)
 * - Cream/white page background, a large light-gray content box with border for the copy
 * - Bold headings, emoji/check tick bullets where visible in the screenshot
 * - "OUR VIBRANT CULTURE" section with the four center-aligned icons (join1..join4)
 *
 * If image imports paths differ in your project, update the import paths above.
 */

const styles = {
  pageWrap: {
    background: "#fbf9f5", // cream / off-white as requested
    padding: "18px 16px 80px", // leave space for global footer
    minHeight: "100vh",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#111",
  },

  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "3px solid rgba(0,0,0,0.08)",
    paddingBottom: 12,
    marginBottom: 18,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    paddingTop: 6,
  },

  // large grey content box that holds the main text
  contentBox: {
    background: "#e6e6e6",
    border: "1px solid rgba(0,0,0,0.18)",
    padding: "20px 22px",
    borderRadius: 2,
    color: "#111",
    fontSize: 13,
    lineHeight: 1.45,
  },

  smallHeading: {
    fontWeight: 800,
    marginBottom: 8,
    display: "block",
  },

  paragraph: {
    margin: "6px 0",
    whiteSpace: "pre-wrap",
  },

  // list styles for bulleted areas
  bullets: {
    margin: "10px 0 10px 18px",
    padding: 0,
    listStyle: "none",
  },

  bulletItem: {
    marginBottom: 8,
    display: "flex",
    alignItems: "flex-start",
  },

  tickIcon: {
    display: "inline-block",
    minWidth: 20,
    marginRight: 8,
    color: "#0aa14a", // green tick color
    lineHeight: "1.1",
    fontSize: 16,
  },

  boldText: {
    fontWeight: 800,
  },

  jobTitle: {
    fontWeight: 800,
    marginTop: 12,
    marginBottom: 6,
  },

  jobSubHeading: {
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 6,
  },

  // culture section
  cultureWrap: {
    marginTop: 36,
    paddingTop: 12,
    textAlign: "left",
  },

  cultureHeading: {
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 1,
    marginBottom: 28,
    textTransform: "uppercase",
  },

  cultureList: {
    maxWidth: 760,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr",
    rowGap: 40,
    alignItems: "center",
    justifyItems: "center",
    position: "relative",
  },

  cultureItem: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    padding: "0 28px",
  },

  cultureIcon: {
    width: 64,
    height: 64,
    objectFit: "contain",
    marginBottom: 14,
  },

  cultureCaption: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textAlign: "center",
  },

  verticalDivider: {
    position: "absolute",
    right: 8,
    top: -6,
    bottom: -6,
    width: 1,
    background: "#d6d6d6",
  },
};

export default function JoinUs() {
  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <div style={styles.titleRow}>
          <h1 style={styles.pageTitle}>Join Us</h1>
          {/* The global app provides "Return Home Page" in header; this is just spacing */}
          <div aria-hidden style={{ width: 160 }} />
        </div>

        <div style={styles.contentBox} role="main" aria-labelledby="joinus-heading">
          <span id="joinus-heading" style={styles.smallHeading}>
            Join Us | Careers at Sequence Commerce
          </span>

          <span style={{ ...styles.smallHeading, marginTop: 8 }}>Who We Are</span>

          <p style={styles.paragraph}>
            <strong>Sequence Commerce</strong> is a leading digital marketing agency
            headquartered in Brampton, Ontario, Canada (108 Summerlea Rd, Brampton, ON
            L6T 4X3). We specialise in data-driven strategy, creative content
            production, and full-funnel brand amplification. Our mission is to help
            businesses stand out in a competitive digital landscape by building
            powerful, measurable campaigns.
          </p>

          <p style={styles.paragraph}>
            At Sequence Commerce, we believe our people are our strongest asset. We
            don't just focus on results—we invest in the growth, creativity, and
            well-being of every team member.
          </p>

          <div style={{ ...styles.smallHeading, marginTop: 10 }}>
            Why Work at Sequence Commerce?
          </div>

          <ul style={styles.bullets}>
            <li style={styles.bulletItem}>
              <span style={styles.tickIcon}>✅</span>
              <div>
                <strong>Cutting-Edge Projects</strong>
                <div style={{ marginTop: 6 }}>
                  Be part of high-impact campaigns across industries like e-commerce,
                  tech, health, and beauty, delivering innovative solutions to global
                  brands.
                </div>
              </div>
            </li>

            <li style={styles.bulletItem}>
              <span style={styles.tickIcon}>✅</span>
              <div>
                <strong>Flexible, Empowering Work Culture</strong>
                <div style={{ marginTop: 6 }}>
                  We embrace hybrid work, value autonomy, and prioritise outcomes over
                  hours clocked.
                </div>
              </div>
            </li>

            <li style={styles.bulletItem}>
              <span style={styles.tickIcon}>✅</span>
              <div>
                <strong>Growth &amp; Development</strong>
                <div style={{ marginTop: 6 }}>
                  From marketers to analysts and creatives, we offer continuous
                  learning opportunities through in-house training, industry events,
                  and cross-functional collaborations.
                </div>
              </div>
            </li>

            <li style={styles.bulletItem}>
              <span style={styles.tickIcon}>✅</span>
              <div>
                <strong>Global Perspective</strong>
                <div style={{ marginTop: 6 }}>
                  Work with international clients and creative professionals, and
                  expand your global marketing toolkit.
                </div>
              </div>
            </li>
          </ul>

          <div style={{ marginTop: 6 }}>
            <div style={styles.smallHeading}>Open Positions</div>

            <div style={styles.jobTitle}>
              <span role="img" aria-hidden>
                💼
              </span>{" "}
              <span style={{ marginLeft: 6 }}>Digital Marketing Executive</span>
            </div>

            <div style={styles.jobSubHeading}>Responsibilities:</div>
            <ul style={styles.bullets}>
              <li style={{ marginBottom: 6 }}>Plan and execute SEO/SEM, social media, email, and display campaigns</li>
              <li style={{ marginBottom: 6 }}>Analyse performance data to optimise ad efficiency and conversion paths</li>
              <li style={{ marginBottom: 6 }}>Collaborate on brand and content strategies</li>
            </ul>

            <div style={styles.jobSubHeading}>Requirements:</div>
            <ul style={styles.bullets}>
              <li style={{ marginBottom: 6 }}>1+ year experience in digital marketing or equivalent training</li>
              <li style={{ marginBottom: 6 }}>Familiarity with tools like Google Ads, Meta Ads Manager, GA4, Mailchimp</li>
              <li style={{ marginBottom: 6 }}>Strong communication skills and a team-oriented mindset</li>
            </ul>

            <div style={styles.jobTitle}>
              <span role="img" aria-hidden>
                ✍️
              </span>{" "}
              <span style={{ marginLeft: 6 }}>Content Creator</span>
            </div>

            <div style={styles.jobSubHeading}>Responsibilities:</div>
            <ul style={styles.bullets}>
              <li style={{ marginBottom: 6 }}>Write original content for social media, websites, and advertising</li>
              <li style={{ marginBottom: 6 }}>Assist with video scripts, branding copy, and creative brainstorming</li>
              <li style={{ marginBottom: 6 }}>Monitor performance metrics and propose content improvements</li>
            </ul>

            <div style={styles.jobSubHeading}>Requirements:</div>
            <ul style={styles.bullets}>
              <li style={{ marginBottom: 6 }}>Excellent written skills in English</li>
              <li style={{ marginBottom: 6 }}>Awareness of short-form content trends (Instagram, TikTok, YouTube Shorts)</li>
              <li style={{ marginBottom: 6 }}>A good sense of aesthetics and digital storytelling</li>
            </ul>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={styles.smallHeading}>Be Part of the Digital Marketing Revolution</div>
            <p style={styles.paragraph}>
              At Sequence Commerce, we don't just run ads—we build meaningful brand
              experiences. Join us and help redefine what marketing means in the
              digital age.
            </p>
          </div>
        </div>

        {/* OUR VIBRANT CULTURE */}
        <div style={styles.cultureWrap}>
          <div style={styles.cultureHeading}>OUR VIBRANT CULTURE</div>

          <div style={styles.cultureList} aria-hidden={false}>
            <div style={styles.cultureItem}>
              <img src={join1} alt="family spirit" style={styles.cultureIcon} />
              <div style={styles.cultureCaption}>FAMILY SPIRIT IS DRIVEN BY HUMILITY</div>
              <div style={styles.verticalDivider} />
            </div>

            <div style={styles.cultureItem}>
              <img src={join2} alt="entrepreneurship" style={styles.cultureIcon} />
              <div style={styles.cultureCaption}>ENTREPRENEURSHIP IS DRIVEN BY CURIOSITY</div>
              <div style={styles.verticalDivider} />
            </div>

            <div style={styles.cultureItem}>
              <img src={join3} alt="panache" style={styles.cultureIcon} />
              <div style={styles.cultureCaption}>PANACHE IS DRIVEN BY PASSION</div>
              <div style={styles.verticalDivider} />
            </div>

            <div style={styles.cultureItem}>
              <img src={join4} alt="sustainability" style={styles.cultureIcon} />
              <div style={styles.cultureCaption}>SUSTAINABILITY IS DRIVEN BY POSITIVE IMPACT</div>
              <div style={styles.verticalDivider} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}