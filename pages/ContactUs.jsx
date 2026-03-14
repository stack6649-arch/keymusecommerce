import React from "react";

/**
 * ContactUs.jsx
 *
 * Updated to:
 * - Use the same gradient as VIP.jsx
 * - Single green gradient divider under the title (like VIP)
 * - Reduced bottom padding so the footer sits closer to content
 * - Adds a thin separator line above the "CUSTOMER ENQUIRIES" heading (as requested)
 * - Keeps the headset icon and "Chat with us" link behavior unchanged
 *
 * This file intentionally does not render header/footer/return controls (they are global).
 */

const VIP_GRADIENT =
  "linear-gradient(120deg, #071e2f 0%, #1f4287 50%, #278ea5 85%, #21e6c1 100%)";

const GREEN_THIN =
  "linear-gradient(90deg, rgba(31,143,192,1), rgba(33,230,193,1))";

const styles = {
  root: {
    background: VIP_GRADIENT,
    color: "#fff",
    overflowX: "hidden",
  },
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "20px 16px 32px", // reduced bottom padding so footer is closer
    boxSizing: "border-box",
  },
  titleRow: {
    borderBottom: "0", // no heavy border; use the single green bar below
    paddingBottom: 12,
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 800,
    margin: 0,
    color: "#fff",
  },

  // single green gradient thin divider (like VIP)
  thinDivider: {
    height: 8,
    background: GREEN_THIN,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 18,
  },

  section: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 900,
    margin: "8px 0 12px 0",
    letterSpacing: 0.6,
  },
  paragraph: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 1.6,
    margin: "8px 0",
    maxWidth: 860,
  },
  boldLine: {
    fontWeight: 800,
    color: "rgba(255,255,255,0.98)",
  },

  enquiriesRow: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  enquiryItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    marginTop: 8,
  },
  chatIconBox: {
    width: 22,
    height: 22,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chatLink: {
    color: "#ff3333",
    fontWeight: 700,
    textDecoration: "none",
    marginLeft: 6,
  },

  // thin subtle separator above the "CUSTOMER ENQUIRIES" section
  enquiriesDivider: {
    height: 1,
    background: "rgba(255,255,255,0.14)",
    border: "none",
    margin: "18px 0",
    borderRadius: 1,
  },
};

export default function ContactUs() {
  const handleOpenCustomerService = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    // Dispatch the global event the app listens for to open the CustomerService modal.
    try {
      window.dispatchEvent(new CustomEvent("openCustomerService"));
    } catch (err) {
      // noop
    }

    // Do NOT navigate — only open the modal.
  };

  return (
    <div style={styles.root}>
      <main style={styles.main} role="main" aria-labelledby="contact-heading">
        <div style={styles.titleRow}>
          <h1 id="contact-heading" style={styles.pageTitle}>
            Contact Us
          </h1>
          {/* Global header shows "Return Home Page"; keep placeholder spacing */}
          <div style={{ width: 160 }} aria-hidden />
        </div>

        {/* Single green gradient divider (replaces the previous two separators) */}
        <div style={styles.thinDivider} />

        <section style={styles.section} aria-labelledby="customer-care-heading">
          <h2 id="customer-care-heading" style={styles.sectionHeading}>
            CUSTOMER CARE
          </h2>

          <p style={styles.paragraph}>Our dedicated team is available to answer all your questions:</p>

          <p style={{ ...styles.paragraph, ...styles.boldLine }}>Everyday, 10:00AM to 10:00PM</p>

          <p style={styles.paragraph}>
            If you get in touch outside of these hours we will aim to respond to you as quickly as possible the next working day.
          </p>
        </section>

        {/* subtle separator above CUSTOMER ENQUIRIES as requested */}
        <hr style={styles.enquiriesDivider} />

        <section
          style={styles.enquiriesRow}
          aria-labelledby="customer-enquiries-heading"
        >
          <h3 id="customer-enquiries-heading" style={styles.sectionHeading}>
            CUSTOMER ENQUIRIES
          </h3>

          <div style={styles.enquiryItem}>
            <span style={styles.chatIconBox} aria-hidden>
              {/* Headset icon SVG (small, matches screenshot) */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 1C6.48 1 2 5.48 2 11v4a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H6a5 5 0 0 1 10 0h-1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1a3 3 0 0 0 3-3v-4c0-5.52-4.48-10-10-10z"
                  fill="#ffffff"
                />
              </svg>
            </span>

            <div>
              <span style={{ color: "rgba(255,255,255,0.92)" }}>
                <strong>Customer Service:</strong>
              </span>
              <a
                href="#chat"
                onClick={handleOpenCustomerService}
                style={styles.chatLink}
              >
                Chat with us
              </a>
            </div>
          </div>
        </section>

        {/* Intentionally no extra spacer here so footer appears closer */}
      </main>
    </div>
  );
}
