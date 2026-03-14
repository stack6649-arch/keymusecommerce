import React, { useState, useEffect } from "react";
import { useBalance } from "../context/balanceContext";
import { useTransactions } from "../context/transactionContext";
import "./Dashboards.css";

/*
  Deposit.jsx (Recharge page)

  - Uses the platform gradient and centered container so header/footer are provided
    by the global Layout (this file does NOT render local header/footer or bottom nav).
  - Removed tabs / history / local navbars as requested — page is a simple Recharge view
    with three statistic cards (Account Balance, Frozen Amount, Balance Due) and the
    help / deposit remarks shown below, matching the screenshot layout.
  - All business logic / hooks remain intact (balance, deposits, refresh, etc.).
  - Visual styling is inline / uses shared dashboard CSS to match other pages.
*/

const START_BLUE = "#1fb6fc";

export default function Deposit() {
  const { balance, refreshProfile, userProfile } = useBalance();
  const { deposits = [], loading } = useTransactions();

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
    try {
      window.dispatchEvent(new CustomEvent("openCustomerService"));
    } catch (err) {
      // noop
    }
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        .recharge-gradient {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(120deg, #071e2f 0%, #1f4287 45%, #278ea5 85%, #21e6c1 100%);
          position: relative;
        }
        .recharge-gradient::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, rgba(7,30,61,0.92) 60%, rgba(39,142,165,0.80) 100%);
          z-index: 0;
          pointer-events: none;
        }
        .recharge-centered {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 16px 140px 16px;
          box-sizing: border-box;
          color: #fff;
        }
        .recharge-title {
          font-size: 34px;
          font-weight: 800;
          margin: 0 0 12px 0;
          color: #fff;
        }
        .recharge-divider {
          height: 8px;
          width: 100%;
          max-width: 1100px;
          background: #1f8fc0;
          border-radius: 6px;
          margin-bottom: 18px;
        }

        .recharge-hero {
          background: rgba(255,255,255,0.97);
          border-radius: 10px;
          padding: 22px;
          text-align: center;
          color: #0b2b4a;
          box-shadow: 0 8px 30px rgba(2,6,23,0.08);
          margin-bottom: 26px;
        }

        .stat-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.97), rgba(245,247,250,0.97));
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          color: #0b2b4a;
          box-shadow: 0 6px 18px rgba(2,6,23,0.06);
        }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 900;
          color: ${START_BLUE};
        }

        .welcome-section {
          margin-top: 18px;
          color: rgba(255,255,255,0.95);
        }
        .welcome-section h3 {
          margin: 0 0 8px 0;
          font-weight: 800;
          color: #fff;
        }
        .welcome-section p { margin: 8px 0; color: rgba(255,255,255,0.88); }
        .chat-link { color: #ff4d4d; font-weight: 700; cursor: pointer; }

        .deposit-remarks {
          margin-top: 22px;
          color: rgba(255,255,255,0.86);
          font-size: 13px;
          line-height: 1.45;
        }

        @media (min-width: 720px) {
          .stat-cards { grid-template-columns: repeat(1, 1fr); }
        }

        @media (max-width: 520px) {
          .recharge-centered { padding-left: 12px; padding-right: 12px; }
        }
      `}</style>

      <div className="recharge-gradient" aria-hidden="false">
        <div className="recharge-centered">
          <h1 className="recharge-title">Recharge</h1>
          <div className="recharge-divider" />

          <div className="recharge-hero" role="region" aria-label="Hero">
            <div style={{ fontWeight: 700, fontSize: 20, color: "#0b2b4a" }}>Recharge</div>
          </div>

          <div className="stat-cards" aria-live="polite">
            <div className="stat-card" role="status" aria-label="Account Balance">
              <div className="stat-label">Account Balance (GBP)</div>
              <div className="stat-value">{Number(balance || 0).toFixed(0)}</div>
            </div>

            <div className="stat-card" role="status" aria-label="Frozen Amount">
              <div className="stat-label">Frozen Amount (GBP)</div>
              <div className="stat-value">{Number(frozenAmount || 0).toFixed(0)}</div>
            </div>

            <div className="stat-card" role="status" aria-label="Balance Due">
              <div className="stat-label">Balance Due (GBP)</div>
              <div className="stat-value">{Number(balanceDue || 0).toFixed(6)}</div>
            </div>
          </div>

          <div className="welcome-section">
            <h3>Welcome to Sequence</h3>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "8px 0 12px 0" }} />
            <div>
              <p style={{ marginBottom: 8, fontWeight: 700 }}>How can we help?</p>
              <p>Our dedicated team is available to answer all your questions.</p>
              <p>Everyday, 10:00 to 21:59.</p>
              <p>If you get in touch outside of these hours we will aim to respond to you as quickly as possible the next working day.</p>
              <p><strong>Customer Service:</strong> <a href="#chat" onClick={handleOpenCustomerService} className="chat-link">Chat with us</a></p>
            </div>

            <div className="deposit-remarks">
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Recharge remark:</div>
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                <li>1.Receiving account: Account Funds</li>
                <li>2.The deposit will be credited and available for trading once you receive confirmation from customer support.</li>
                <li>3.Please make sure your selected coins and network are correct before sending any funds to the deposit address provided by customer support. Sending funds over an incorrect network or in different coins will result in the loss of your assets, which cannot be retrieved.</li>
                <li>4.Please contact our customer service to request the latest deposit address.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
