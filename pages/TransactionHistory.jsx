import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../context/transactionContext";
import { useBalance } from "../context/balanceContext";

/*
  TransactionHistory.jsx

  - Displays Recharge / Withdrawal / Commission History tabs and lists.
  - Uses the global header/footer provided by the app Layout; therefore this file
    intentionally does NOT render its own header or footer.
  - Reads data from useTransactions() and shows the records in a simple list.
  - Adds a "Return Home Page >" button under the global header aligned to the right.
  - Keeps the same dark gradient page background and styling consistent with Dashboards.
*/

const START_BLUE = "#1fb6fc";

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

  const rechargeList = deposits.slice().reverse();
  const withdrawList = withdrawals.slice().reverse();
  const commissionList = (commissions || []).slice().reverse();

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        background:
          "linear-gradient(120deg, #071e2f 0%, #1f4287 50%, #278ea5 85%, #21e6c1 100%)",
        color: "#fff",
      }}
    >
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 80px", color: "#fff" }}>
       

        <h1 style={{ color: "#fff", fontSize: 32, margin: 0, fontWeight: 800, marginBottom: 18 }}>Bonus History</h1>

        <div
          style={{
            height: 8,
            background: "linear-gradient(90deg, rgba(31,143,192,1), rgba(33,230,193,1))",
            borderRadius: 4,
            marginBottom: 22,
          }}
        />

        {/* Tabs */}
        <div style={{ maxWidth: 920, marginBottom: 18, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "flex" }}>
            <button
              onClick={() => setTab("recharge")}
              style={{
                flex: 1,
                padding: "12px 14px",
                fontWeight: 700,
                background: tab === "recharge" ? "#fff" : "transparent",
                color: tab === "recharge" ? "#0b2b4a" : "rgba(255,255,255,0.9)",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              Recharge
            </button>
            <button
              onClick={() => setTab("withdrawal")}
              style={{
                flex: 1,
                padding: "12px 14px",
                fontWeight: 700,
                background: tab === "withdrawal" ? "#fff" : "transparent",
                color: tab === "withdrawal" ? "#0b2b4a" : "rgba(255,255,255,0.9)",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              Withdrawal
            </button>
            <button
              onClick={() => setTab("commission")}
              style={{
                flex: 1,
                padding: "12px 14px",
                fontWeight: 700,
                background: tab === "commission" ? "#fff" : "transparent",
                color: tab === "commission" ? "#0b2b4a" : "rgba(255,255,255,0.9)",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              Commission History
            </button>
          </div>
        </div>

        {/* Content */}
        <section
          style={{
            maxWidth: 920,
            minHeight: 220,
            padding: 18,
            borderRadius: 8,
            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
            boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
          }}
        >
          {tab === "recharge" && (
            <>
              {rechargeList.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.7)" }}>No recharge records found.</div>
              ) : (
                rechargeList.map((r, i) => (
                  <div key={i} style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
                      ORDER NUMBER: {r.orderNumber ?? r.id ?? r.txnId ?? r.reference ?? ""}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.9)" }}>
                      AMOUNT: {r.amount ?? r.value ?? ""}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.7)" }}>
                      STATUS: {r.status ?? "Unknown"}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                      CREATE TIME: {r.createdAt ? fmt(r.createdAt) : r.date ?? ""}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {tab === "withdrawal" && (
            <>
              {withdrawList.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.7)" }}>No withdrawal records found.</div>
              ) : (
                withdrawList.map((w, i) => (
                  <div key={i} style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
                      ORDER NUMBER: {w.orderNumber ?? w.id ?? w.txnId ?? w.reference ?? ""}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.9)" }}>
                      AMOUNT: {w.amount ?? w.value ?? ""}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.7)" }}>
                      STATUS: {w.status ?? "Unknown"}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                      CREATE TIME: {w.createdAt ? fmt(w.createdAt) : w.date ?? ""}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {tab === "commission" && (
            <>
              {commissionList.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.7)" }}>No commission records found.</div>
              ) : (
                commissionList.map((c, i) => (
                  <div key={i} style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
                      ORDER NUMBER: {c.orderNumber ?? c.id ?? c.reference ?? ""}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.9)" }}>
                      AMOUNT: {c.amount ?? c.value ?? ""}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.7)" }}>
                      STATUS: {c.status ?? "Unknown"}
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                      CREATE TIME: {c.createdAt ? fmt(c.createdAt) : c.date ?? ""}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}