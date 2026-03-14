import React from "react";
import certificateImg from "../assets/images/dashboard/certificate.png";

/**
 * Certificate.jsx
 *
 * Same as the previous version but with the decorative outer/inner frame removed.
 * The certificate image is displayed centered and responsive with no borders or frames.
 *
 * Does not render a local header/footer/return button (those are provided globally).
 */

const VIP_GRADIENT =
  "linear-gradient(120deg, #071e2f 0%, #1f4287 50%, #278ea5 85%, #21e6c1 100%)";

const GREEN_THIN =
  "linear-gradient(90deg, rgba(31,143,192,1), rgba(33,230,193,1))";

const styles = {
  root: {
    minHeight: "100vh",
    background: VIP_GRADIENT,
    color: "#fff",
    overflowX: "hidden",
  },
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "28px 16px 80px", // leave space for global footer
    boxSizing: "border-box",
  },
  titleRow: {
    paddingBottom: 8,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    color: "#fff",
  },

  // Thin green divider (like VIP)
  thinDivider: {
    height: 8,
    background: GREEN_THIN,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 22,
  },

  // Certificate container (no decorative frame)
  certificateContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  // Certificate image: responsive and centered, NO BORDER
  certificateImg: {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "contain",
    border: "none",
    maxWidth: 900, // keeps image from becoming overly large on very wide screens
  },

  // Optional caption area below the certificate (kept minimal / unobtrusive)
  caption: {
    marginTop: 12,
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
  },
};

export default function Certificate() {
  return (
    <div style={styles.root}>
      <main style={styles.main} role="main" aria-labelledby="certificate-heading">
        <div style={styles.titleRow}>
          <h1 id="certificate-heading" style={styles.pageTitle}>
            Certificate
          </h1>
        </div>

        <div style={styles.thinDivider} />

        <div style={styles.certificateContainer}>
          <img
            src={certificateImg}
            alt="Certificate"
            style={styles.certificateImg}
            draggable={false}
          />
        </div>

        <div style={styles.caption} aria-hidden>
          {/* kept intentionally minimal; remove or update if you don't want a caption */}
        </div>
      </main>
    </div>
  );
}