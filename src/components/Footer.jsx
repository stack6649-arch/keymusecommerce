// src/components/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
// logo to place in footer (square Keymus file)
import logo from "../assets/images/header/Keylogo7.png";
import chatIcon from "../assets/images/dashboard/chat-DWOAIdKh.png";
import CustomerServiceModal from "./CustomerServiceModal.jsx";

/**
 * Footer adapted to GA Agency layout/visuals.
 *
 * NOTE: This file contains a small, focused layout wrapper around the footer logo
 * that crops & scales the square Keymus logo so it visually matches the smaller
 * rectangular GA Agency mark used in the original footer.
 *
 * If the size still needs tiny adjustments, update LOGO_WRAP_WIDTH / LOGO_WRAP_HEIGHT
 * below to tweak the final visible area (px).
 */

export default function Footer() {
  const [csOpen, setCsOpen] = useState(false);

  const handleOpenCustomerService = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setCsOpen(true);
    try {
      window.dispatchEvent(new CustomEvent("openCustomerService"));
    } catch (err) {}
  };

  const handleCloseCustomerService = () => {
    setCsOpen(false);
  };

  // Adjust these values to fine-tune the visible logo size/shape in the footer.
  // LOGO_WRAP_WIDTH x LOGO_WRAP_HEIGHT define the visible "frame" the square logo
  // will be scaled & cropped into to mimic the rectangular GA mark.
  // Start with these values and tweak by + / - a few px if necessary.
  const LOGO_WRAP_WIDTH = 140; // px - visible width of the logo area
  const LOGO_WRAP_HEIGHT = 44; // px - visible height of the logo area

  // Inline styles only (user requested only Footer.jsx to be changed)
  const footerRootStyle = {
    background: "#ffffff",
    borderTop: "1px solid rgba(0,0,0,0.04)",
  };

  const containerStyle = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "36px 20px 14px",
    boxSizing: "border-box",
  };

  const topRowStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: 40,
    justifyContent: "space-between",
    flexWrap: "wrap",
  };

  const leftColumnStyle = {
    flex: "0 0 220px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
  };

  // The wrapper creates a fixed-size viewport for the logo and hides overflow.
  // The <img> inside is scaled to fill the wrapper height; because the source
  // is square, it will overflow horizontally and be clipped to create a visual
  // rectangular crop similar to the GA logo used in the original footer.
  const logoWrapperStyle = {
    width: LOGO_WRAP_WIDTH,
    height: LOGO_WRAP_HEIGHT,
    overflow: "hidden",
    display: "block",
    boxSizing: "content-box",
    padding: 0,
    margin: 0,
  };

  const logoImgStyle = {
    // scale image so its height exactly matches the wrapper height
    height: "100%",
    width: "auto",
    display: "block",
    objectFit: "cover",
    objectPosition: "50% 60%", // tweak vertical focus if needed (e.g. show more/less bottom)
    lineHeight: 0,
    border: 0,
  };

  const aboutTextStyle = {
    color: "#9aa4b2",
    marginTop: 14,
    lineHeight: 1.6,
    maxWidth: 420,
    fontSize: 13,
  };

  const middleColumnsStyle = {
    display: "flex",
    gap: 60,
    flex: 1,
    justifyContent: "center",
    minWidth: 400,
  };

  const sectionTitleStyle = { color: "#0b63d6", fontWeight: 800, marginBottom: 12 };
  const linkStyle = { color: "#5b6b77", textDecoration: "none" };

  const dividerStyle = { height: 1, background: "rgba(0,0,0,0.04)", margin: "24px 0" };

  const bottomRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  };

  const bottomLeftStyle = { display: "flex", gap: 12, alignItems: "center", color: "#6b7280", fontSize: 13 };
  const bottomCenterStyle = { color: "#9aa4b2", fontSize: 13, textAlign: "center", flex: "0 0 auto" };

  const chatBtnStyle = {
    position: "fixed",
    right: 20,
    bottom: 22,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#0b63d6",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(11, 99, 214, 0.3)",
    zIndex: 9999,
    cursor: "pointer",
    padding: 0,
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  };

  const chatIconStyle = {
    width: 32,
    height: 32,
    objectFit: "contain",
    display: "block",
  };

  return (
    <footer style={footerRootStyle} role="contentinfo">
      <div style={containerStyle}>
        {/* Top content: logo + columns */}
        <div style={topRowStyle}>
          <div style={leftColumnStyle}>
            {/* Logo wrapper -> crops & scales the square logo to a rectangular footprint */}
            <div style={logoWrapperStyle} aria-hidden={false}>
              <img src={logo} alt="Keymus logo" style={logoImgStyle} />
            </div>

            <p style={aboutTextStyle}>
              We are a leading marketing agency that utilizes over 15 years of proprietary data and insights, combined with a team of expert marketers.
            </p>
          </div>

          <div style={middleColumnsStyle}>
            <div>
              <div style={sectionTitleStyle}>COMPANY</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 10 }}>
                  <Link to="/About" style={linkStyle}>About Us</Link>
                </li>
                <li style={{ marginBottom: 10 }}>
                  <Link to="/JoinUs" style={linkStyle}>Join Us</Link>
                </li>
                <li style={{ marginBottom: 10 }}>
                  <Link to="/ContactUs" style={linkStyle}>Contact Us</Link>
                </li>
                <li style={{ marginBottom: 10 }}>
                  <Link to="/VIP" style={linkStyle}>Premium Membership</Link>
                </li>
              </ul>
            </div>

            <div>
              <div style={sectionTitleStyle}>PRODUCTS</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 10 }}><Link to="/shoes" style={linkStyle}>Shoes</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/apparel" style={linkStyle}>Apparel</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/electronics" style={linkStyle}>Electronics</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/accessories" style={linkStyle}>Accessories</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/jewelry" style={linkStyle}>Jewellery</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/watches" style={linkStyle}>Watches</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/furniture" style={linkStyle}>Furnitures</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={dividerStyle} />

        {/* Bottom legal / language row */}
        <div style={bottomRowStyle}>
          <div style={bottomLeftStyle}>
            <div style={{ cursor: "pointer" }}>EN ▾</div>
            <Link to="/PrivatePolicy" style={{ color: "#6b7280", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/TermsAndConditions" style={{ color: "#6b7280", textDecoration: "none" }}>Terms and Conditions</Link>
          </div>

          <div style={bottomCenterStyle}>
            © 2026 KEYMUS ECOMMERCE. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Floating chat button with blue background */}
      <button
        onClick={handleOpenCustomerService}
        aria-label="Contact customer service"
        type="button"
        style={chatBtnStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#0a52b8";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(11, 99, 214, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#0b63d6";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(11, 99, 214, 0.3)";
        }}
      >
        <img src={chatIcon} alt="Customer Service" style={chatIconStyle} />
      </button>

      <CustomerServiceModal open={csOpen} onClose={handleCloseCustomerService} />
    </footer>
  );
}
