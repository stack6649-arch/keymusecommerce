import React, { useState } from "react";
import contactImg from "../assets/images/dashboard/contact-us.png";
import CustomerServiceModal from "../components/CustomerServiceModal.jsx";

/**
 * ContactUs.jsx
 *
 * Updated to match the provided screenshots (desktop + mobile) as closely as possible:
 * - Cream page background, large hero image left and a white info card on the right (desktop).
 * - On mobile the card stacks under the hero image.
 * - Big "CONTACT US" heading with blue underline, "Customer Enquiries" block with email, operating hours and
 *   a prominent "Chat With Us" button that opens the customer service modal via a global event.
 * - "Leave a Message" form in a pale-beige card with all required fields, checkbox, and blue "SEND MESSAGE" button.
 * - Fonts, spacing, colors and general layout adjusted to match screenshots.
 *
 * This file is self-contained and does not touch other files.
 */

export default function ContactUs() {
  const [csOpen, setCsOpen] = useState(false);

  const OPEN_BTN_BG = "#1f4de6";
  const PAGE_BG = "#fbf9f5";
  const CARD_BG = "#ffffff";
  const FORM_BG = "#efeae7";
  const TEXT = "#111";

  const handleOpenCustomerService = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setCsOpen(true);
    try {
      window.dispatchEvent(new CustomEvent("openCustomerService"));
    } catch (err) {
      // noop
    }
  };

  const handleCloseCustomerService = () => {
    setCsOpen(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    // form submit handling is intentionally empty — integrate with backend as needed
    try {
      window.dispatchEvent(new CustomEvent("contactFormSubmitted"));
    } catch (err) {}
  };

  return (
    <div style={{ background: PAGE_BG, minHeight: "100vh", color: TEXT, boxSizing: "border-box" }}>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 60px", boxSizing: "border-box" }}>
        <style>{`
          .cu-grid {
            display: grid;
            grid-template-columns: 1fr 420px;
            gap: 28px;
            align-items: start;
          }
          @media (max-width: 920px) {
            .cu-grid { grid-template-columns: 1fr; }
          }

          .cu-hero {
            width: 100%;
            display: block;
            border-radius: 8px;
            overflow: hidden;
          }
          .cu-hero img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
          }

          .cu-info-card {
            background: ${CARD_BG};
            border-radius: 4px;
            padding: 26px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            box-sizing: border-box;
          }

          .cu-heading {
            font-size: 36px;
            font-weight: 900;
            margin: 0 0 12px 0;
            text-transform: uppercase;
            color: ${OPEN_BTN_BG};
          }

          .cu-heading-underline {
            width: 160px;
            height: 6px;
            background: ${OPEN_BTN_BG};
            border-radius: 3px;
            margin-bottom: 18px;
          }

          .cu-section-title {
            font-size: 18px;
            font-weight: 800;
            margin: 8px 0;
            color: ${TEXT};
          }

          .cu-email {
            color: ${TEXT};
            text-decoration: underline;
            font-weight: 700;
            display: inline-block;
            margin: 8px 0 12px 0;
          }

          .cu-hours {
            color: ${OPEN_BTN_BG};
            font-weight: 800;
            margin: 8px 0 8px 0;
          }

          .cu-paragraph {
            color: rgba(0,0,0,0.7);
            font-size: 14px;
            line-height: 1.6;
            margin: 6px 0 12px 0;
          }

          .cu-chat-btn {
            display: inline-block;
            text-align: center;
            background: ${OPEN_BTN_BG};
            color: #fff;
            padding: 12px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 800;
            width: 100%;
            max-width: 240px;
          }

          /* Leave a message */
          .cu-leave-title {
            font-size: 28px;
            font-weight: 900;
            margin: 36px 0 8px 0;
            text-transform: uppercase;
            color: ${TEXT};
          }

          .cu-leave-underline {
            width: 160px;
            height: 6px;
            background: ${OPEN_BTN_BG};
            border-radius: 3px;
            margin-bottom: 16px;
          }

          .cu-form-card {
            background: ${FORM_BG};
            padding: 22px;
            border-radius: 6px;
            box-sizing: border-box;
            max-width: 740px;
          }

          .cu-field {
            margin-bottom: 12px;
          }

          .cu-field label {
            display: block;
            margin-bottom: 8px;
            font-weight: 700;
            color: ${TEXT};
            font-size: 13px;
          }

          .cu-input, .cu-select, .cu-textarea {
            width: 100%;
            padding: 10px 12px;
            border-radius: 4px;
            border: 1px solid rgba(0,0,0,0.12);
            background: #fff;
            box-sizing: border-box;
            font-size: 14px;
            color: ${TEXT};
          }

          .cu-textarea { min-height: 120px; resize: vertical; }

          .cu-phone-row { display: flex; gap: 8px; align-items: center; }

          .cu-checkbox-row { display:flex; gap:8px; align-items:flex-start; margin-top:8px; }

          .cu-send-btn {
            background: ${OPEN_BTN_BG};
            color: #fff;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 800;
            margin-top: 14px;
            display: inline-block;
          }

          /* form smaller on mobile */
          @media (max-width: 920px) {
            .cu-info-card { padding: 18px; }
            .cu-heading { font-size: 28px; }
            .cu-leave-title { font-size: 22px; }
            .cu-form-card { padding: 16px; }
          }
        `}</style>

        {/* Top hero + info */}
        <div className="cu-grid" aria-label="contact-hero-and-info">
          <div className="cu-hero" aria-hidden>
            <img src={contactImg} alt="Contact hero" />
          </div>

          <aside className="cu-info-card" aria-labelledby="contact-us-heading">
            <h1 id="contact-us-heading" className="cu-heading">CONTACT US</h1>
            <div className="cu-heading-underline" />
            <div style={{ marginTop: 6 }}>
              <div className="cu-section-title">Customer Enquiries</div>
              <a className="cu-email" href="mailto:customer-support@keymus-ecommerce-uk.cc">customer-support@keymus-ecommerce-uk.cc</a>

              <div className="cu-hours">10AM to 10PM</div>

              <p className="cu-paragraph">
                Our dedicated team are available to answer all your questions. This is our operating time, if you get in touch outside of these hours,
                we will respond as quickly as possible when operation is back!
              </p>

              <button className="cu-chat-btn" onClick={handleOpenCustomerService} aria-label="Chat with us">
                Chat With Us
              </button>
            </div>
          </aside>
        </div>

        {/* Leave a message */}
        <section aria-labelledby="leave-message-heading">
          <h2 id="leave-message-heading" className="cu-leave-title">LEAVE A MESSAGE</h2>
          <div className="cu-leave-underline" />

          <p style={{ marginTop: 0, marginBottom: 16, color: "rgba(0,0,0,0.7)" }}>
            Complete the form below with your inquiry.
          </p>

          <form className="cu-form-card" onSubmit={handleSend} aria-label="Leave a message form">
            <div className="cu-field">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" placeholder="Enter the subject." className="cu-input" />
            </div>

            <div className="cu-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Enter the message here." className="cu-textarea" />
            </div>

            <div className="cu-field">
              <label htmlFor="fullname">Full Name</label>
              <input id="fullname" name="fullname" placeholder="Enter your full name." className="cu-input" />
            </div>

            <div className="cu-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" placeholder="Enter your email address." className="cu-input" />
            </div>

            <div className="cu-field">
              <label>Phone Number</label>
              <div className="cu-phone-row">
                <select className="cu-select" aria-label="country code" style={{ width: 120 }}>
                  <option value="+44">+44</option>
                  <option value="+1">+1</option>
                  <option value="+852">+852</option>
                  <option value="+65">+65</option>
                  <option value="+86">+86</option>
                </select>
                <input placeholder="Enter your phone number." className="cu-input" style={{ flex: 1 }} />
              </div>
            </div>

            <div className="cu-checkbox-row">
              <input type="checkbox" id="consent" />
              <label htmlFor="consent" style={{ fontSize: 13, color: "rgba(0,0,0,0.8)" }}>
                I acknowledge that by submitting this enquiry, I consent to having my personal collected, used, disclosed and/or processed in accordance with KEYMUS-Ecommerce's privacy policy.
              </label>
            </div>

            <button type="submit" className="cu-send-btn" aria-label="Send message">SEND MESSAGE</button>
          </form>
        </section>
      </main>

      <CustomerServiceModal open={csOpen} onClose={handleCloseCustomerService} />
    </div>
  );
}
