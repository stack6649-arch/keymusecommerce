// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/header/logo_black.png";
import chatIcon from "../assets/images/header/chat.png";

export default function Footer() {
  // Only layout / size inline styles here. Do NOT change images, icons or color rules.
  const footerStyle = {
    paddingTop: "1rem",
    paddingBottom: "0.25rem",
  };

  const footerMainStyle = {
    maxWidth: 1100,
    margin: "0 auto",
    position: "relative",
    paddingBottom: 0,
  };

  const logoRowStyle = {
    textAlign: "left",
    marginBottom: "0.15rem",
  };

  const aboutStyle = {
    margin: "0 0 0.75rem 0",
    maxWidth: "900px",
    lineHeight: 1.5,
  };

  const linksRowStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "4rem",
    flexWrap: "nowrap",
    marginBottom: "0.5rem",
    position: "relative",
    width: "100%",
  };

  const companyColumnStyle = {
    minWidth: 220,
    flex: "0 0 200px",
    textAlign: "left",
  };

  const informationColumnStyle = {
    position: "absolute",
    right: 0,
    top: 0,
    width: 220,
    textAlign: "right",
  };

  const linkStyle = {
    display: "block",
    fontSize: "0.9rem",
    textDecoration: "none",
    marginBottom: "0.5rem",
  };

  // Chat button (fixed) - keep visuals from CSS, only adjust position/size here.
  const fixedChatBtnStyle = {
    position: "fixed",
    right: 8,
    bottom: 60, // sits above footer copyright line as requested
    width: 60,
    height: 60,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  };

  const chatImgStyle = {
    width: 40,
    height: 40,
  };

  // COPYRIGHT: make it a single small line, left, no wrapping.
  const copyrightRowStyle = {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    gap: "20px",
    marginTop: "0.25rem",
    paddingTop: "2rem",
    whiteSpace: "nowrap", // prevent wrapping to multiple lines
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "14px", // very small as requested
    lineHeight: 1,
  };

  const footerLogoSmallStyle = {
    width: 50,
    height: "auto",
    marginRight: 0,
    verticalAlign: "middle",
    flexShrink: 0,
  };

  const copyrightTextStyle = {
    fontWeight: 800, // make it very bold as requested
    display: "inline-block",
    verticalAlign: "middle",
  };

  return (
    <footer className="footer" role="contentinfo" style={footerStyle}>
      <div className="footer-main" style={footerMainStyle}>
        <div className="footer-logo-row" style={logoRowStyle}>
          <img src={logo} alt="Sequence Logo" className="footer-logo" />
        </div>

        <div className="footer-about" style={aboutStyle}>
          We are a leading marketing agency that utilizes over 10 years of proprietary
          data and insights, combined with a team of 70+ expert marketers. <br />
          Join over 4,000 marketers who receive weekly digital marketing tips tailored
          for industries like electronics, household goods, and many more.
        </div>

        <div
          className="footer-links-row"
          style={linksRowStyle}
          aria-label="Footer links"
        >
          {/* COMPANY - stays left */}
          <div style={companyColumnStyle}>
            <div className="footer-section-title">COMPANY</div>

            <Link to="/About" style={linkStyle}>
              About Us
            </Link>

            <Link to="/Register" style={linkStyle}>
              Join Us
            </Link>

            <Link to="/Contact" style={linkStyle}>
              Contact Us
            </Link>

            <Link to="/VIP" style={linkStyle}>
              Premium Membership
            </Link>

            <Link to="/Certificate" style={linkStyle}>
              Company Certificate
            </Link>
          </div>

          {/* INFORMATION - pinned to right inside the footer container */}
          <div style={informationColumnStyle} aria-label="Information links">
            <div className="footer-section-title">INFORMATION</div>

            <Link to="/PrivatePolicy" style={linkStyle}>
              Privacy Policy
            </Link>

            <Link to="/TermsAndConditions" style={linkStyle}>
              Terms and Conditions
            </Link>

            <Link to="/FAQ" style={linkStyle}>
              FAQs
            </Link>

            <Link to="/Events" style={linkStyle}>
              Latest Events
            </Link>
          </div>
        </div>

        <div className="footer-copyright-row" style={copyrightRowStyle}>
          <img
            src={logo}
            alt="Sequence Logo small"
            className="footer-logo-small"
            style={footerLogoSmallStyle}
          />
          <span style={{ ...copyrightTextStyle, display: "inline-block", verticalAlign: "middle" }}>
            &copy; 2025 - Sequence Commerce
          </span>
        </div>
      </div>

      {/* Single fixed floating chat button (visuals preserved by external CSS).
          Inline style only controls position/size so it stays above the copyright line. */}
      <a
        href="mailto:support@sequence.com"
        className="footer-chat-btn"
        title="Customer Service"
        aria-label="Contact customer service"
        style={fixedChatBtnStyle}
      >
        <img src={chatIcon} alt="Chat Icon" style={chatImgStyle} />
      </a>
    </footer>
  );
}