import React, { useState, useEffect } from "react";
import { useBalance } from "../context/balanceContext";
import { useTransactions } from "../context/transactionContext";
import "./Dashboards.css";
import CustomerServiceModal from "../components/CustomerServiceModal.jsx";

/*
  Deposit.jsx (Recharge / Topup page)

  - Visual layout updated to match the provided screenshots on both mobile and desktop.
  - Keeps all existing business logic and hooks intact.
  - Key visual changes:
    - Large "TOPUP" heading with subtitle.
    - Prominent Account Balance row with left blue rule and large formatted amount.
    - Two stat cards (Frozen Amount, Balance Due) shown as white cards with subtle shadow.
    - Welcome panel and side contact panel with operating hours + black "Chat With Us" CTA.
    - Responsive layout: stacked on mobile, two-column grid on desktop.
  - No logic or behaviour changes (refreshProfile, transactions, openCustomerService) — only markup/styles adjusted.
*/

const START_BLUE = "#0b62ff"; // tuned to match screenshots

export default function Deposit() {
  const { balance, refreshProfile, userProfile } = useBalance();
  const { deposits = [], loading } = useTransactions();

  const [csOpen, setCsOpen] = useState(false);

  // frozen amount: if you have a source use it; fallback to 0
  const frozenAmount = (userProfile && (userProfile.frozenAmount || userProfile.frozen)) || 0;

  // balance due: using balance from context (as in other pages)
  const balanceDue = Number(balance || 0);

  // Keep ability to refresh profile if parent requests
  useEffect(() => {
    refreshProfile && refreshProfile();
  }, [refreshProfile]);

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

  const formattedBalance = Number(balance || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedFrozen = Number(frozenAmount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedBalanceDue = Number(balanceDue || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflowX: "hidden", background: "#fff" }}>
      <style>{`
        /* Page layout */
        .topup-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 18px 96px;
          box-sizing: border-box;
          color: #111;
        }

        /* Heading */
        .topup-hero {
          margin-bottom: 18px;
        }
        .topup-title {
          font-size: 48px;
          font-weight: 900;
          color: ${START_BLUE};
          margin: 4px 0 6px 0;
          line-height: 1;
        }
        .topup-sub {
          font-size: 13px;
          font-weight: 700;
          color: #111;
          letter-spacing: 0.02em;
        }

        /* Divider under header */
        .topup-divider {
          height: 1px;
          width: 100%;
          background: #efefef;
          margin: 18px 0 22px 0;
        }

        /* Account balance row */
        .balance-section {
          display: flex;
          align-items: center;
          gap: 28px;
          padding: 24px 0;
          border-top: 1px solid #fbfbfb;
          border-bottom: 1px solid #fbfbfb;
          margin-bottom: 28px;
        }
        .balance-label {
          font-size: 12px;
          color: #8b8b8b;
          font-weight: 700;
          text-transform: uppercase;
        }
        .balance-value-row {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .balance-rail {
          width: 6px;
          height: 56px;
          background: ${START_BLUE};
          border-radius: 3px;
        }
        .balance-value {
          font-size: 44px;
          font-weight: 900;
          color: ${START_BLUE};
          line-height: 1;
        }

        /* Stat cards (Frozen / Balance due) */
        .stat-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          margin: 24px 0 36px 0;
        }
        .stat-card {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.06);
          border: 1px solid #f3f4f6;
        }
        .stat-value {
          color: ${START_BLUE};
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .stat-label {
          color: #6b7280;
          font-weight: 700;
          font-size: 12px;
        }

        /* Welcome / Contact area */
        .help-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          margin-top: 10px;
          margin-bottom: 36px;
        }
        .welcome-card {
          background: #fff;
          border-radius: 6px;
          padding: 26px;
          border: 1px solid #eee;
          box-shadow: 0 8px 24px rgba(2,6,23,0.04);
          text-align: center;
        }
        .welcome-title {
          color: ${START_BLUE};
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .welcome-sub {
          color: #666;
          margin-bottom: 6px;
        }

        .contact-card {
          background: #f3ece8;
          border-radius: 6px;
          padding: 18px;
          border: 1px solid #efe8e4;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .contact-hours-title {
          color: #6b6b6b;
          font-weight: 700;
          font-size: 12px;
          margin-bottom: 6px;
        }
        .contact-hours {
          color: ${START_BLUE};
          font-weight: 900;
          font-size: 20px;
          margin-bottom: 8px;
        }
        .contact-desc {
          color: #666;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .chat-btn {
          background: #000;
          color: #fff;
          border: none;
          padding: 12px 40px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        /* Bottom small links row */
        .links-bar {
          margin-top: 18px;
          padding: 16px 0;
          border-top: 1px solid #efefef;
          display: flex;
          justify-content: center;
          gap: 36px;
          color: #666;
          font-size: 13px;
        }

        /* Footer spacer */
        .footer-spacer {
          height: 1px;
        }

        /* Responsive: desktop */
        @media (min-width: 900px) {
          .topup-container { padding-left: 48px; padding-right: 48px; }
          .balance-value { font-size: 56px; }
          .stat-grid { grid-template-columns: 1fr 1fr; }
          .help-grid { grid-template-columns: 1fr 340px; align-items: start; }
          .topup-title { font-size: 56px; }
        }

        /* Mobile adjustments */
        @media (max-width: 520px) {
          .topup-title { font-size: 36px; }
          .balance-value { font-size: 34px; }
          .balance-rail { height: 46px; width: 6px; }
          .contact-card { padding: 14px; }
          .welcome-card { padding: 18px; }
          .stat-value { font-size: 22px; }
        }
      `}</style>

      <div className="topup-container" role="main" aria-labelledby="topup-heading">
        <header className="topup-hero">
          <h1 id="topup-heading" className="topup-title">TOPUP</h1>
          <div className="topup-sub">RECHARGE TO GRAB YOUR ORDERS</div>
        </header>

        <div className="topup-divider" />

        {/* Account Balance */}
        <section className="balance-section" aria-label="Account balance">
          <div style={{ flex: 1 }}>
            <div className="balance-label">Account balance </div>
            <div style={{ height: 12 }} />
            <div className="balance-value-row">
              <div className="balance-rail" aria-hidden="true" />
              <div>
                <div className="balance-value" aria-live="polite">{formattedBalance}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <section className="stat-grid" aria-label="Account statistics">
          <div className="stat-card" role="status" aria-label="Frozen amount">
            <div className="stat-value">{formattedFrozen}</div>
            <div className="stat-label">Frozen amount</div>
          </div>

          <div className="stat-card" role="status" aria-label="Balance due">
            <div className="stat-value">{formattedBalanceDue}</div>
            <div className="stat-label">Balance due </div>
          </div>
        </section>

        {/* Welcome & Contact */}
        <section className="help-grid" aria-label="Help and contact">
          <div className="welcome-card" role="region" aria-label="Welcome">
            <div className="welcome-title">Welcome, { (userProfile && (userProfile.displayName || userProfile.username)) ? (userProfile.displayName || userProfile.username) : "Member" }!</div>
            <div className="welcome-sub">How can we help?</div>
            <div className="welcome-desc" style={{ color: "#666", marginTop: 8 }}>
              Our dedicated team are available to answer all your questions!
            </div>
          </div>

          <aside className="contact-card" role="region" aria-label="Customer service hours">
            <div>
              <div className="contact-hours-title">Monday to Sunday,</div>
              <div className="contact-hours">10AM to 10PM</div>
              <div className="contact-desc">
                Our dedicated team are available to answer all your questions. This is our operating time, if you get in touch outside of these hours, we will respond as quickly as possible when operation is back.
              </div>
            </div>

            <div>
              <button className="chat-btn" onClick={handleOpenCustomerService} aria-label="Chat With Us">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Chat With Us
              </button>
            </div>
          </aside>
        </section>


        <div className="footer-spacer" />

      </div>

      <CustomerServiceModal open={csOpen} onClose={handleCloseCustomerService} />
    </main>
  );
}
