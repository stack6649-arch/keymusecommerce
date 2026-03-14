import React from "react";

// Event images (kept in dashboard images folder)
import event1 from "../assets/images/dashboard/event1.jpg";
import event2 from "../assets/images/dashboard/event2.jpg";
import event3 from "../assets/images/dashboard/event3.jpg";

/**
 * Events.jsx
 *
 * - Displays the event images as one continuous page (no frames, no gaps).
 * - Removes the "Return Home Page" link (the app provides a global return button).
 * - Keeps the cream page background from the previous design.
 * - Images are rendered edge-to-edge within the content column with no padding
 *   between them so they appear as a single long page.
 *
 * If you want the images to be merged into a single file on the server, that
 * would be an alternative; this component simply displays them with no visual
 * separation so they appear continuous in the browser.
 */

const styles = {
  page: {
    background: "#fbf9f5", // light cream background
    minHeight: "100vh",
    paddingBottom: 60, // room for global footer
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "18px 16px",
    boxSizing: "border-box",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: "#111",
    margin: 0,
  },

  // The images wrapper removes any gap/padding/border between the images
  imagesWrap: {
    width: "100%",
    display: "block",
    margin: 0,
    padding: 0,
    background: "transparent",
  },

  // Each image fills the content width and sits flush with neighbors
  image: {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    margin: 0,
    padding: 0,
    border: "none",
  },
};

export default function Events() {
  const eventImages = [event1, event2, event3];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>Latest Events</h1>
        </div>

        <div style={styles.imagesWrap} aria-hidden={false}>
          {eventImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Event poster ${idx + 1}`}
              style={styles.image}
              // prevent draggable default which can show ghost image gaps on some browsers
              draggable={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}