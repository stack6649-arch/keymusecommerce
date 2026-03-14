// src/components/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
// Use GA Agency logo asset as requested
import logo from "../assets/images/header/logo.a8b5034.png";
import chatIcon from "../assets/images/dashboard/chat-DWOAIdKh.png";
import CustomerServiceModal from "./CustomerServiceModal.jsx";

/**
 * Footer adapted to GA Agency layout/visuals:
 * - White large top area, centered columns (Company / Products)
 * - Muted link colors with blue column titles
 * - Bottom legal row centered
 * - Keeps the floating chat button and modal behaviour
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

  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.04)" }} role="contentinfo">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px 14px", boxSizing: "border-box" }}>
        {/* Top content: logo + columns */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 40, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 220px" }}>
            <img src={logo} alt="GA Agency" style={{ height: 44, width: "auto", display: "block" }} />
            <p style={{ color: "#9aa4b2", marginTop: 14, lineHeight: 1.6, maxWidth: 420, fontSize: 13 }}>
              We are a leading marketing agency that utilizes over 10 years of proprietary data and insights, combined with a team of expert marketers.
            </p>
          </div>

          <div style={{ display: "flex", gap: 60, flex: 1, justifyContent: "center", minWidth: 400 }}>
            <div>
              <div style={{ color: "#0b63d6", fontWeight: 800, marginBottom: 12 }}>COMPANY</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 10 }}>
                  <Link to="/About" style={{ color: "#5b6b77", textDecoration: "none" }}>About Us</Link>
                </li>
                <li style={{ marginBottom: 10 }}>
                  <Link to="/JoinUs" style={{ color: "#5b6b77", textDecoration: "none" }}>Join Us</Link>
                </li>
                <li style={{ marginBottom: 10 }}>
                  <Link to="/ContactUs" style={{ color: "#5b6b77", textDecoration: "none" }}>Contact Us</Link>
                </li>
                <li style={{ marginBottom: 10 }}>
                  <Link to="/VIP" style={{ color: "#5b6b77", textDecoration: "none" }}>Premium Membership</Link>
                </li>
              </ul>
            </div>

            <div>
              <div style={{ color: "#0b63d6", fontWeight: 800, marginBottom: 12 }}>PRODUCTS</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 10 }}><Link to="/shoes" style={{ color: "#5b6b77", textDecoration: "none" }}>Shoes</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/apparel" style={{ color: "#5b6b77", textDecoration: "none" }}>Apparel</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/electronics" style={{ color: "#5b6b77", textDecoration: "none" }}>Electronics</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/accessories" style={{ color: "#5b6b77", textDecoration: "none" }}>Accessories</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/jewelry" style={{ color: "#5b6b77", textDecoration: "none" }}>Jewellery</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/watches" style={{ color: "#5b6b77", textDecoration: "none" }}>Watches</Link></li>
                <li style={{ marginBottom: 10 }}><Link to="/furniture" style={{ color: "#5b6b77", textDecoration: "none" }}>Furnitures</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(0,0,0,0.04)", margin: "24px 0" }} />

        {/* Bottom legal / language row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", color: "#6b7280", fontSize: 13 }}>
            <div style={{ cursor: "pointer" }}>EN ▾</div>
            <Link to="/PrivatePolicy" style={{ color: "#6b7280", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/TermsAndConditions" style={{ color: "#6b7280", textDecoration: "none" }}>Terms and Conditions</Link>
          </div>

          <div style={{ color: "#9aa4b2", fontSize: 13, textAlign: "center", flex: "0 0 auto" }}>
            © 2026 GA Agency UK. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Floating chat button with blue background */}
      <button
        onClick={handleOpenCustomerService}
        aria-label="Contact customer service"
        type="button"
        style={{
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
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#0a52b8";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(11, 99, 214, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#0b63d6";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(11, 99, 214, 0.3)";
        }}
      >
        <img 
          src={chatIcon} 
          alt="Customer Service" 
          style={{ 
            width: 32, 
            height: 32,
            objectFit: "contain",
            display: "block"
          }} 
        />
      </button>

      <CustomerServiceModal open={csOpen} onClose={handleCloseCustomerService} />
    </footer>
  );
}