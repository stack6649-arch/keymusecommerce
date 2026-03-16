import React, { useEffect, useState } from "react";
import csImage from "../assets/images/Cs.jpg";

export default function CustomerServiceModal({ open, onClose }) {
  const [links, setLinks] = useState({
    telegram: "",
    whatsapp: "",
    customerServiceUrl: "",
  });

  useEffect(() => {
    if (!open) return;
    fetch("https://stacksapp-backend-main.onrender.com/service-links.json?ts=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        setLinks({
          telegram: data.telegram1 || data.telegram2 || "",
          whatsapp: data.whatsapp || "",
          customerServiceUrl: data.customerService || "",
        });
      })
      .catch(() => {
        setLinks({ telegram: "", whatsapp: "", customerServiceUrl: "" });
      });
  }, [open]);

  if (!open) return null;

  const arrowIcon = (
    <svg width="20" height="20" viewBox="0 0 18 18" style={{ marginLeft: "auto" }} aria-hidden>
      <path
        d="M6 4l4 5-4 5"
        stroke="#0b63d6"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );

  const avatar = (
    <img
      src={csImage}
      alt="service"
      data-i18n-alt="service"
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        marginRight: 14,
        objectFit: "cover",
        background: "transparent",
        border: "2px solid #0b63d6",
        boxShadow: "0 2px 8px rgba(11, 99, 214, 0.15)",
      }}
    />
  );

  return (
    <>
      {/* Light overlay backdrop - very subtle */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1199,
          background: "rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          backdropFilter: "blur(1px)",
        }}
        onClick={onClose}
        role="presentation"
      />

      {/* Modal box */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafb 50%, #f0f4f8 100%)",
            borderRadius: 20,
            boxShadow: "0 4px 12px rgba(11, 99, 214, 0.08), 0 0 1px rgba(11, 99, 214, 0.1)",
            minWidth: 360,
            maxWidth: 520,
            width: "100%",
            padding: 0,
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            border: "1px solid rgba(11, 99, 214, 0.15)",
            color: "#071e2f",
            overflow: "hidden",
            pointerEvents: "auto",
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {/* Header with gradient */}
          <div
            style={{
              background: "linear-gradient(135deg, #0b63d6 0%, #0a52b8 100%)",
              padding: "24px 22px 16px 22px",
              color: "#ffffff",
              borderBottom: "1px solid rgba(11, 99, 214, 0.2)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 0.5 }}>
              Contact Us
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4, opacity: 0.9 }}>
              Connect with our support team
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "8px 0" }}>
            {/* 1st: Customer Service */}
            <button
              onClick={() => {
                // If backend provides a direct customer service URL, open that.
                if (links.customerServiceUrl) {
                  window.open(links.customerServiceUrl, "_blank");
                  onClose();
                  return;
                }

                // Fallback: use in-app sequence chat behaviour (requires logged-in user)
                const username = localStorage.getItem("user");

                if (!username) {
                  alert("Username not found — user must be logged in.");
                  return;
                }

                const chatUrl = `https://sequence-chat.onrender.com/?user=${encodeURIComponent(username)}`;
                window.open(chatUrl, "_blank");
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "16px 22px",
                cursor: "pointer",
                opacity: 1,
                fontSize: 15,
                fontWeight: 600,
                color: "#071e2f",
                outline: "none",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(11, 99, 214, 0.08)";
                e.currentTarget.style.paddingLeft = "26px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.paddingLeft = "22px";
              }}
            >
              {avatar}
              <span style={{ flex: "0 1 auto" }} data-i18n="Customer Service">Customer Service</span>
              {arrowIcon}
            </button>

            {/* 2nd: Whatsapp */}
            <button
              onClick={() => {
                if (links.whatsapp) {
                  window.open(links.whatsapp, "_blank");
                  onClose();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "16px 22px",
                cursor: links.whatsapp ? "pointer" : "not-allowed",
                opacity: links.whatsapp ? 1 : 0.5,
                fontSize: 15,
                fontWeight: 600,
                color: "#071e2f",
                borderBottom: "1px solid rgba(11, 99, 214, 0.08)",
                outline: "none",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (links.whatsapp) {
                  e.currentTarget.style.background = "rgba(11, 99, 214, 0.08)";
                  e.currentTarget.style.paddingLeft = "26px";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.paddingLeft = "22px";
              }}
              disabled={!links.whatsapp}
            >
              {avatar}
              <span style={{ flex: "0 1 auto" }} data-i18n="Whatsapp">Whatsapp</span>
              {arrowIcon}
            </button>

            {/* 3rd: Telegram */}
            <button
              onClick={() => {
                if (links.telegram) {
                  window.open(links.telegram, "_blank");
                  onClose();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "16px 22px",
                cursor: links.telegram ? "pointer" : "not-allowed",
                opacity: links.telegram ? 1 : 0.5,
                fontSize: 15,
                fontWeight: 600,
                color: "#071e2f",
                outline: "none",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (links.telegram) {
                  e.currentTarget.style.background = "rgba(11, 99, 214, 0.08)";
                  e.currentTarget.style.paddingLeft = "26px";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.paddingLeft = "22px";
              }}
              disabled={!links.telegram}
            >
              {avatar}
              <span style={{ flex: "0 1 auto" }} data-i18n="Telegram">Telegram</span>
              {arrowIcon}
            </button>
          </div>

          {/* Footer with Cancel button */}
          <div
            style={{
              textAlign: "center",
              padding: "16px 22px",
              borderTop: "1px solid rgba(11, 99, 214, 0.12)",
              background: "linear-gradient(180deg, rgba(11, 99, 214, 0.04), rgba(247, 245, 236, 0.5))",
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "2px solid #0b63d6",
                color: "#0b63d6",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                textDecoration: "none",
                letterSpacing: 0.3,
                outline: "none",
                transition: "all 0.2s ease",
                padding: "10px 28px",
                borderRadius: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0b63d6";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(11, 99, 214, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#0b63d6";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span data-i18n="Cancel">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
