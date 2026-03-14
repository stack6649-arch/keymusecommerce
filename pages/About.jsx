import React from "react";
import aboutHero from "../assets/images/dashboard/AboutUs1.png"; // hero (small)
import aboutMap from "../assets/images/dashboard/AboutUs2.jpg"; // map (large)

/**
 * About.jsx
 *
 * Updated to display the hero image and the map as a single continuous page:
 * - No frames, no borders, no white gaps between images.
 * - Images are rendered edge-to-edge (100% width) and responsive.
 * - The descriptive text sits immediately beneath the map with minimal spacing
 *   so the page reads as a single continuous document.
 *
 * This component intentionally does not render global header/footer/return-home controls.
 */

const styles = {
  root: {
    // Use the existing VIP gradient behind the content for consistency with other pages
    background: "linear-gradient(120deg, #071e2f 0%, #1f4287 50%, #278ea5 85%, #21e6c1 100%)",
    color: "#fff",
    overflowX: "hidden",
  },
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 16px 24px",
    boxSizing: "border-box",
  },

  // Title row (keeps the same spacing as other pages but doesn't render a return button)
  titleRow: {
    paddingTop: 18,
    paddingBottom: 12,
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    margin: 0,
    color: "#fff",
  },

  // Container for the continuous images area
  continuousImages: {
    width: "100%",
    display: "block",
    margin: 0,
    padding: 0,
    background: "transparent",
  },

  // Images should fill the width of the container and sit flush to each other
  image: {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    margin: 0,
    padding: 0,
    border: "none",
    // Prevent layout shift by setting maxHeight for large images (keeps page neat)
    maxHeight: "none",
  },

  // Minimal spacer between the map and the text so they are not visually separated
  textBlock: {
    marginTop: 8,
    color: "#fff",
    fontSize: 15,
    lineHeight: 1.7,
    // Use a semi-opaque background that sits on top of the page gradient but NOT as a framed box
    background: "transparent",
    padding: "12px 4px 28px 4px",
  },
  textTitle: {
    fontWeight: 800,
    marginBottom: 8,
    color: "#fff",
    fontSize: 18,
  },
};

export default function About() {
  return (
    <div style={styles.root}>
      <main style={styles.main} role="main" aria-labelledby="about-heading">
        <div style={styles.titleRow}>
          <h1 id="about-heading" style={styles.title}>
            
          </h1>
        </div>

        {/* Continuous images: hero then map, no borders and no gaps */}
        <div style={styles.continuousImages} aria-hidden={false}>
          <img
            src={aboutHero}
            alt="About hero"
            style={{ ...styles.image, objectFit: "cover", height: "clamp(120px, 16vw, 220px)" }}
            draggable={false}
          />

          <img
            src={aboutMap}
            alt="World infographic map"
            style={{ ...styles.image, objectFit: "contain" }}
            draggable={false}
          />
        </div>

        {/* Text immediately below the map, minimal spacing so the page reads continuously */}
        <div style={styles.textBlock} aria-live="polite">
          <div style={styles.textTitle}>Global Expertise, Local Insight</div>

          <div>
            Our expertise in managing international digital campaigns is unmatched. We
            serve a diverse clientele targeting global markets, ensuring their message
            resonates seamlessly across borders. Our proficiency extends to managing
            PPC accounts across various search engines, effectively covering all major
            languages spoken worldwide.
          </div>

          <div style={{ height: 8 }} />

          <div>
            Our team is a vibrant blend of native speakers, including English, French,
            German, Italian, Mandarin, Portuguese, and Afrikaans. Each member brings a
            unique combination of local, regional, and international media planning
            experience. This rich fusion of cultural insights and linguistic expertise
            empowers us to design campaigns that are not only globally strategic but
            also deeply relevant to local audiences.
          </div>
        </div>
      </main>
    </div>
  );
}