import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../context/transactionContext";
import { useBalance } from "../context/balanceContext";

/*
  TransactionHistory.jsx

  Visual update only (responsive / fonts / colors) to match provided screenshots.
  - Keeps all data, behaviour and words unchanged except:
    * Tab arrangement: three equal-width tabs (Recharge left, Withdrawal middle, Commission right).
    * Tab label: "Commission" instead of "Commission History".
    * "Completed" on recharge records uses the green status style.
    * Order numbers display in UPPERCASE.
    * Withdraw records: "Rejected" = red semi-bold, "Pending" = dark grey.
  - Adjusted layout, typography, colors and responsive rules.
  - Tabs styled as pill-like buttons; content presented inside a white card centered on the page.
  - Table-like header row with a blue underline; responsive stacking on small screens.
*/

const START_BLUE = "#0b62ff";

export default function TransactionHistory() {
  const navigate = useNavigate();
  const { deposits = [], withdrawals = [], commissions = [], loading } = useTransactions();
  const { balance } = useBalance();

  const [tab, setTab] = React.useState("recharge");

  useEffect(() => {
    // ensure page starts at top when opened
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  const fmt = (d) => {
    try {
      if (!d) return "";
      const dd = new Date(d);
      if (isNaN(dd.getTime())) return String(d);
      return dd.toLocaleString();
    } catch (e) {
      return String(d);
    }
  };

  const up = (v) => {
    try {
      return String(v ?? "").toUpperCase();
    } catch (e) {
      return String(v ?? "");
    }
  };

  const rechargeList = deposits.slice().reverse();
  const withdrawList = withdrawals.slice().reverse();
  const commissionList = (commissions || []).slice().reverse();

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden", background: "#f6f6f6" }}>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px 80px", color: "#111" }}>
        <style>{`
          /* Page heading */
          .th-heading {
            font-size: 48px;
            font-weight: 900;
            color: ${START_BLUE};
            margin: 6px 0 10px 0;
            letter-spacing: -0.01em;
          }
          .th-sub {
            font-size: 13px;
            color: #222;
            font-weight: 700;
            margin-bottom: 18px;
          }

          /* Card */
          .th-card {
            background: #fff;
            border-radius: 10px;
            padding: 0;
            box-shadow: 0 12px 36px rgba(6,20,40,0.06);
            overflow: hidden;
            border: 1px solid #eee;
          }

          /* Tabs bar */
          .th-tabs {
            display: flex;
            gap: 0;
            background: #f0f0f0;
            padding: 0;
            border-bottom: 1px solid #e7e7e7;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            align-items: stretch;
          }
          /* Make three tabs share the space evenly on desktop and mobile */
          .th-tab {
            flex: 1 1 0;
            padding: 14px 22px;
            cursor: pointer;
            font-weight: 800;
            font-size: 15px;
            color: #222;
            background: transparent;
            border-right: 1px solid rgba(0,0,0,0.02);
            min-width: 0; /* allow shrinking on small screens */
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .th-tab:last-child {
            border-right: none;
          }
          .th-tab.active {
            background: ${START_BLUE};
            color: white;
          }

          /* Content area */
          .th-content {
            padding: 20px 28px 36px;
          }

          /* Table header */
          .th-table-head {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 12px;
            align-items: end;
            padding: 8px 0 12px;
          }
          .th-head-cell {
            font-weight: 800;
            color: #222;
            font-size: 13px;
            letter-spacing: 0.02em;
          }
          .th-underline {
            height: 3px;
            background: ${START_BLUE};
            margin-top: 10px;
            border-radius: 2px;
          }

          /* Row */
          .th-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 12px;
            align-items: center;
            padding: 18px 0;
            border-bottom: 1px solid rgba(0,0,0,0.04);
            font-size: 14px;
            color: #333;
          }
          .th-status-approved { color: #10b981; font-weight: 700; } /* green */
          .th-amount { color: #0b2b4a; font-weight: 800; }

          /* Withdraw-specific statuses */
          .th-status-rejected { color: #ef4444; font-weight: 600; } /* red semi-bold */
          .th-status-pending { color: #374151; font-weight: 700; } /* dark grey */

          /* Empty state */
          .th-empty {
            padding: 28px 0;
            color: rgba(0,0,0,0.45);
            text-align: center;
          }

          /* Pagination */
          .th-pagination {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 18px;
            align-items: center;
          }
          .th-page-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid #e6e6e6;
            background: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .th-page-btn.current {
            background: #111;
            color: #fff;
            border-color: #111;
          }

          /* Responsive: mobile stack */
          @media (max-width: 820px) {
            .th-table-head, .th-row {
              grid-template-columns: 1fr 1fr;
            }
            .th-head-cell:nth-child(3), .th-head-cell:nth-child(4) { text-align: left; }
            .th-row { padding: 12px 0; }
          }

          /* Responsive: very small */
          @media (max-width: 420px) {
            .th-heading { font-size: 34px; }
            .th-tab { padding: 12px 14px; min-width: 120px; font-size: 14px; }
            .th-content { padding: 16px; }
            .th-row { padding: 10px 0; font-size: 13px; }
          }
        `}</style>

        <h1 className="th-heading">Bonus History</h1>
        <div className="th-sub">Your fund records and transaction history</div>

        <div className="th-card" role="region" aria-label="Transaction history card">
          <div className="th-tabs" role="tablist" aria-label="Transaction tabs">
            <button
              className={`th-tab ${tab === "recharge" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "recharge"}
              onClick={() => setTab("recharge")}
            >
              Recharge
            </button>
            <button
              className={`th-tab ${tab === "withdrawal" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "withdrawal"}
              onClick={() => setTab("withdrawal")}
            >
              Withdrawal
            </button>
            <button
              className={`th-tab ${tab === "commission" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "commission"}
              onClick={() => setTab("commission")}
            >
              Commission
            </button>
            <button
              className={`th-tab ${tab === "commission" ? "active" : ""}`}
              style={{ display: "none" }}
            >
              {/* reserved tab slot if needed (kept hidden to avoid layout changes) */}
            </button>
          </div>

          <div className="th-content">
            {/* Header row */}
            <div className="th-table-head" aria-hidden="true">
              <div className="th-head-cell">CREATE TIME</div>
              <div className="th-head-cell">ORDER NUMBER</div>
              <div className="th-head-cell">AMOUNT</div>
              <div className="th-head-cell">STATUS</div>
            </div>

            <div className="th-underline" />

            {/* Content */}
            {tab === "recharge" && (
              <>
                {rechargeList.length === 0 ? (
                  <div className="th-empty">No recharge records found.</div>
                ) : (
                  rechargeList.map((r, i) => {
                    const statusLower = String(r.status || "").toLowerCase();
                    const statusClass = (statusLower === "completed" || statusLower === "approved") ? "th-status-approved" : `th-status-${statusLower === "approved" ? "approved" : "other"}`;
                    const orderText = up(r.orderNumber ?? r.id ?? r.txnId ?? r.reference ?? "");
                    return (
                      <div key={i} className="th-row" role="article" aria-label={`recharge-${i}`}>
                        <div>{r.createdAt ? fmt(r.createdAt) : r.date ?? ""}</div>
                        <div>{orderText}</div>
                        <div className="th-amount">USD {r.amount ?? r.value ?? ""}</div>
                        <div className={statusClass}>
                          {r.status ?? "Unknown"}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {tab === "withdrawal" && (
              <>
                {withdrawList.length === 0 ? (
                  <div className="th-empty">No withdrawal records found.</div>
                ) : (
                  withdrawList.map((w, i) => {
                    const statusLower = String(w.status || "").toLowerCase();
                    let statusClass = `th-status-${statusLower === "approved" ? "approved" : "other"}`;
                    if (statusLower === "rejected") statusClass = "th-status-rejected";
                    else if (statusLower === "pending") statusClass = "th-status-pending";
                    else if (statusLower === "approved") statusClass = "th-status-approved";
                    const orderText = up(w.orderNumber ?? w.id ?? w.txnId ?? w.reference ?? "");
                    return (
                      <div key={i} className="th-row" role="article" aria-label={`withdraw-${i}`}>
                        <div>{w.createdAt ? fmt(w.createdAt) : w.date ?? ""}</div>
                        <div>{orderText}</div>
                        <div className="th-amount"> {w.amount ?? w.value ?? ""}</div>
                        <div className={statusClass}>
                          {w.status ?? "Unknown"}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {tab === "commission" && (
              <>
                {commissionList.length === 0 ? (
                  <div className="th-empty">No commission records found.</div>
                ) : (
                  commissionList.map((c, i) => {
                    const statusLower = String(c.status || "").toLowerCase();
                    const statusClass = (statusLower === "approved") ? "th-status-approved" : `th-status-${statusLower === "approved" ? "approved" : "other"}`;
                    const orderText = up(c.orderNumber ?? c.id ?? c.reference ?? "");
                    return (
                      <div key={i} className="th-row" role="article" aria-label={`commission-${i}`}>
                        <div>{c.createdAt ? fmt(c.createdAt) : c.date ?? ""}</div>
                        <div>{orderText}</div>
                        <div className="th-amount"> {c.amount ?? c.value ?? ""}</div>
                        <div className={statusClass}>
                          {c.status ?? "Unknown"}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {/* Pagination placeholder (keeps existing UI feel) */}
            <div className="th-pagination" aria-hidden="true">
              <button className="th-page-btn" aria-label="first page">«</button>
              <button className="th-page-btn" aria-label="previous page">‹</button>
              <button className="th-page-btn current" aria-current="page">1</button>
              <button className="th-page-btn" aria-label="next page">›</button>
              <button className="th-page-btn" aria-label="last page">»</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
