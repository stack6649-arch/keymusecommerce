import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBalance } from "../context/balanceContext";
import { useTransactions } from "../context/transactionContext";
import { useProfile } from "../context/profileContext";

/*
  Withdraw.jsx

  - Preserves all business logic (withdraw API call, status normalization, data fetching).
  - Visual adjustments per request:
    * Page uses the platform gradient and centered container.
    * "Account Balance (GBP)" text is bold.
    * Shows labels above the input boxes: "Withdraw Amount" and "Withdrawal Password".
    * Keeps input placeholders unchanged.
    * Removes blue focus outline/glow on inputs.
    * Removes history UI / white band (history area hidden).
    * Spacing adjusted to match screenshot (larger gaps, neat layout).
*/

const WITHDRAW_STATUSES = {
  reviewing: ["Pending", "Reviewing", "In Review"],
  success: ["Completed", "Success"],
  reject: ["Rejected", "Reject", "Failed"],
};
function normalizeStatus(status) {
  if (!status) return "reviewing";
  if (WITHDRAW_STATUSES.reviewing.some(s => status.toLowerCase().includes(s.toLowerCase()))) return "reviewing";
  if (WITHDRAW_STATUSES.success.some(s => status.toLowerCase().includes(s.toLowerCase()))) return "success";
  if (WITHDRAW_STATUSES.reject.some(s => status.toLowerCase().includes(s.toLowerCase()))) return "reject";
  if (status.toLowerCase().includes("approved")) return "success";
  return "reviewing";
}

const START_BLUE = "#1fb6fc";

export default function Withdraw() {
  const [tab] = useState("withdraw"); // kept for parity; only 'withdraw' used in UI
  const [amount, setAmount] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { balance, refreshProfile } = useBalance();
  const { withdrawals, loading, refresh } = useTransactions();
  const { profile } = useProfile();

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }
    if (!withdrawPassword) {
      setMessage("Please enter your withdrawal password.");
      return;
    }
    const token = localStorage.getItem("authToken");
    const BASE_URL = "https://stacksapp-backend-main.onrender.com";
    const res = await fetch(`${BASE_URL}/api/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
      },
      body: JSON.stringify({ amount, withdrawPassword }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Withdrawal request submitted and is under review.");
      setAmount("");
      setWithdrawPassword("");
      refresh();
      refreshProfile();
    } else {
      setMessage(data.message || "Failed to withdraw.");
    }
  };

  const maxCardWidth = 1100;

  // Filtering logic preserved but history UI is intentionally not shown per request
  const filteredWithdrawals = (withdrawals || []).filter(
    w => normalizeStatus(w.status) === "reviewing"
  );

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        /* Full page gradient to avoid any white band before footer */
        .withdraw-gradient {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(120deg, #071e2f 0%, #1f4287 45%, #278ea5 85%, #21e6c1 100%);
          position: relative;
        }
        .withdraw-gradient::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, rgba(7,30,61,0.92) 60%, rgba(39,142,165,0.80) 100%);
          z-index: 0;
          pointer-events: none;
        }
        .withdraw-centered {
          position: relative;
          z-index: 2;
          max-width: ${maxCardWidth}px;
          margin: 0 auto;
          padding: 36px 18px 80px 18px; /* increased top spacing for neatness */
          box-sizing: border-box;
          color: #fff;
        }
        .withdraw-title {
          font-size: 34px;
          font-weight: 800;
          margin: 0 0 22px 0;
          color: #fff;
        }
        .withdraw-divider {
          height: 8px;
          width: 100%;
          max-width: 1100px;
          background: #1f8fc0;
          border-radius: 6px;
          margin-bottom: 28px;
        }
        .account-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,247,250,0.96));
          border-radius: 10px;
          padding: 26px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(2,6,23,0.12);
          color: #0b2b4a;
          margin-bottom: 36px;
        }
        .account-balance-number {
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
        }
        .account-balance-label {
          font-size: 15px;
          margin-top: 8px;
          color: #0b2b4a;
          font-weight: 800; /* make bold as requested */
        }
        .withdraw-form {
          margin-top: 8px;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }
        .field-label {
          display: block;
          color: #ffffff;
          font-weight: 700;
          margin-bottom: 8px;
          font-size: 14px;
          margin-top: 14px;
        }
        .withdraw-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 7px;
          background: #eaf2fb;
          border: none;
          font-size: 16px;
          color: #222;
          margin-bottom: 6px;
          outline: none;
          box-shadow: none;
        }
        .withdraw-input:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        /* hide webkit number spin buttons */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .withdraw-btn {
          width: 100%;
          background: ${START_BLUE};
          color: #fff;
          font-weight: 700;
          font-size: 18px;
          border-radius: 8px;
          border: none;
          padding: 12px 0;
          cursor: pointer;
          box-shadow: 0 8px 28px ${START_BLUE}22;
          margin-top: 20px;
        }
        .withdraw-notes {
          color: rgba(255,255,255,0.85);
          font-size: 13px;
          margin-top: 18px;
          line-height: 1.6;
        }
        /* Hide any leftover history visuals */
        .withdraw-history { display: none !important; }
        @media (max-width: 520px) {
          .withdraw-centered { padding-left: 12px; padding-right: 12px; }
          .account-card { padding: 18px; }
          .account-balance-number { font-size: 34px; }
        }
      `}</style>

      <div className="withdraw-gradient" aria-hidden="false">
        <div className="withdraw-centered">
          <h1 className="withdraw-title">Withdrawal</h1>
          <div className="withdraw-divider" />

          {/* Account balance card */}
          <div className="account-card" role="region" aria-label="Account balance">
            <div className="account-balance-number">{Number(balance).toFixed(0)}</div>
            <div className="account-balance-label">Account Balance (GBP)</div>
          </div>

          {/* Form area */}
          <div className="withdraw-form" role="form" aria-label="Withdraw form">
            <h2 style={{ color: "#fff", marginBottom: 12, fontWeight: 800 }}>Fill In Your Details</h2>

            <form onSubmit={handleWithdraw} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Label above input as requested; placeholders remain unchanged */}
              <label className="field-label" htmlFor="withdraw-amount">Withdraw Amount</label>
              <input
                id="withdraw-amount"
                className="withdraw-input"
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Withdraw Amount"
                required
              />

              <label className="field-label" htmlFor="withdraw-password">Withdrawal Password</label>
              <input
                id="withdraw-password"
                className="withdraw-input"
                type="password"
                value={withdrawPassword}
                onChange={e => setWithdrawPassword(e.target.value)}
                placeholder="Withdrawal Password"
                required
              />

              <button type="submit" className="withdraw-btn">Withdraw</button>

              {message && (
                <div style={{ color: "#fff", marginTop: 8, textAlign: "center" }} role="status">{message}</div>
              )}
            </form>

            <div className="withdraw-notes" aria-hidden="true">
              <ul style={{ margin: "12px 0 0 18px", padding: 0 }}>
                <li>>>   Please confirm the correct withdrawal address or USDT.</li>
                <li>>>   Ensure adequate funds are available for withdrawal.</li>
                <li>>>   Double-check the withdrawal amount to avoid errors.</li>
                <li>>>   Assess the current market conditions and the impact of withdrawing assets before proceeding.</li>
              </ul>
            </div>
          </div>

          {/* Hidden history area kept for logic integrity but not rendered */}
          <div className="withdraw-history" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
