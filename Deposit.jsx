import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBalance } from "../context/balanceContext";
import { useTransactions } from "../context/transactionContext";

// Set your contact URLs here
const TELEGRAM_URL = "https://t.me/your_customer_service";
const WHATSAPP_URL = "https://wa.me/1234567890"; // replace with your WhatsApp number

const START_BLUE = "#1fb6fc";

export default function Deposit() {
  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { balance, refreshProfile } = useBalance();
  const { deposits, loading } = useTransactions();

  // When Deposit is clicked, show modal
  const handleDeposit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleContact = (platform) => {
    setShowModal(false);
    if (platform === "telegram") {
      window.open(TELEGRAM_URL, "_blank");
    } else if (platform === "whatsapp") {
      window.open(WHATSAPP_URL, "_blank");
    }
  };

  const maxCardWidth = 600;

  // Compose all deposit-like entries (normal deposit + admin_add_balance, etc)
  const allDeposits = deposits.filter(
    deposit =>
      deposit.type === "deposit" ||
      deposit.type === "admin_add_balance" ||
      deposit.type === "admin_add_funds" ||
      deposit.type === "add_balance_admin" ||
      !deposit.type // fallback: if type is missing, assume user deposit
  );

  return (
    <div className="min-h-screen bg-white pb-16" style={{fontFamily: "system-ui, Arial, sans-serif"}}>
      {/* Header */}
      <div style={{
        background: "#464b4e",
        color: "white",
        textAlign: "center",
        fontWeight: 700,
        fontSize: 22,
        padding: "14px 0",
        position: "relative"
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute", left: 18, top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Back"
        >
          <svg width={28} height={28} viewBox="0 0 22 22">
            <polyline
              points="14,5 8,11 14,17"
              fill="none"
              stroke={START_BLUE}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        Deposit
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        borderBottom: "1px solid #eaeaea",
        background: "#fff",
        marginBottom: 0,
        fontSize: 0
      }}>
        <button
          style={{
            flex: 1,
            padding: "20px 0 10px 0",
            fontWeight: 600,
            fontSize: 20,
            color: tab === "deposit" ? "#222" : "#888",
            background: "none",
            border: "none",
            borderBottom: tab === "deposit" ? "3px solid #2196d6" : "3px solid transparent",
            outline: "none",
            cursor: "pointer"
          }}
          onClick={() => setTab("deposit")}
        >Deposit</button>
        <button
          style={{
            flex: 1,
            padding: "20px 0 10px 0",
            fontWeight: 600,
            fontSize: 20,
            color: tab === "history" ? "#222" : "#888",
            background: "none",
            border: "none",
            borderBottom: tab === "history" ? "3px solid #2196d6" : "3px solid transparent",
            outline: "none",
            cursor: "pointer"
          }}
          onClick={() => setTab("history")}
        >History</button>
      </div>

      {/* Deposit Tab */}
      {tab === "deposit" ? (
        <>
          {/* Card */}
          <div
            style={{
              background: "#2196d6",
              borderRadius: 20,
              margin: "28px auto 18px auto",
              maxWidth: maxCardWidth,
              boxShadow: "0 4px 16px 0 rgba(0,0,0,0.07)",
              padding: 0,
              overflow: "hidden",
              minHeight: 120,
              width: "95%",
              display: "flex",
              alignItems: "center"
            }}
          >
            <div style={{padding: 22, width: "100%"}}>
              <div style={{fontWeight: 700, color: "#fff", fontSize: 18, marginBottom: 2}}>
                Account Amount
              </div>
              <div style={{display: "flex", alignItems: "flex-end", gap: 6}}>
                <span style={{fontSize: 38, fontWeight: 700, color: "#fff", letterSpacing: 1}}>
                  {Number(balance).toFixed(2)}
                </span>
                <span style={{fontSize: 18, fontWeight: 600, color: "#fff", paddingBottom: 5}}>GBP</span>
              </div>
            </div>
          </div>

          {/* Deposit Form */}
          <form
            onSubmit={handleDeposit}
            autoComplete="off"
            style={{
              margin: "0 auto",
              marginBottom: 0,
              maxWidth: maxCardWidth,
              width: "95%",
              borderRadius: 13,
              background: "#fff",
              boxShadow: "0 4px 12px 0 rgba(0,0,0,.08)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >
            <div>
              <label style={{display: "block", color: "#222", fontWeight: 700, marginBottom: 8, fontSize: 16}}>
                Deposit Amount
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 7,
                  background: "#eaf2fb",
                  border: "none",
                  fontSize: 18,
                  color: "#222",
                  marginBottom: 0
                }}
                placeholder="Deposit Amount"
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#2196d6",
                color: "#fff",
                fontWeight: 500,
                fontSize: 20,
                borderRadius: 7,
                border: "none",
                padding: "13px 0",
                marginTop: 8,
                transition: "background 0.2s",
                cursor: "pointer"
              }}
            >
              Contact Customer Service
            </button>
            {message && (
              <div style={{textAlign: "center", marginTop: 6, fontSize: 15, color: "#18a93c"}}>{message}</div>
            )}
          </form>
          {/* Modal for selecting platform */}
          {showModal && (
            <div style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.24)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "32px 28px 22px 28px",
                minWidth: 280,
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)",
                textAlign: "center"
              }}>
                <div style={{fontWeight: 700, fontSize: 20, marginBottom: 18}}>
                  Contact Customer Service
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: 18}}>
                  <button
                    onClick={() => handleContact("telegram")}
                    style={{
                      background: "#229ED9",
                      color: "#fff",
                      padding: "12px 0",
                      fontSize: 17,
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 7,
                      cursor: "pointer",
                      marginBottom: 2
                    }}
                  >
                    Telegram
                  </button>
                  <button
                    onClick={() => handleContact("whatsapp")}
                    style={{
                      background: "#25d366",
                      color: "#fff",
                      padding: "12px 0",
                      fontSize: 17,
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 7,
                      cursor: "pointer"
                    }}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "none",
                      color: "#888",
                      border: "none",
                      fontSize: 15,
                      marginTop: 8,
                      cursor: "pointer"
                    }}
                  >Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // History Tab
        <div style={{marginTop: 30, width: "100%", maxWidth: maxCardWidth, marginLeft: "auto", marginRight: "auto"}}>
          {loading ? (
            <p style={{textAlign: "center", fontSize: 16, color: "#888", marginTop: 30}}>Loading...</p>
          ) : allDeposits.length === 0 ? (
            <p style={{textAlign: "center", fontSize: 16, color: "#888", marginTop: 30}}>No deposit records found.</p>
          ) : (
            <div style={{display: "flex", flexDirection: "column", gap: 16}}>
              {allDeposits
                .slice()
                .reverse()
                .map((deposit, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#fff",
                      boxShadow: "0 4px 12px 0 rgba(0,0,0,.07)",
                      borderRadius: 8,
                      padding: "18px 22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{fontWeight: 700, fontSize: 18, color: "#222"}}>
                        +£{deposit.amount}
                      </div>
                      <div style={{fontSize: 14, color: "#888", marginTop: 2}}>
                        {deposit.createdAt
                          ? new Date(deposit.createdAt).toLocaleString()
                          : deposit.date || ""}
                      </div>
                    </div>
                    <div style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: "#2196d6",
                      textTransform: "capitalize"
                    }}>
                      {deposit.status || "Completed"}
                    </div>
                  </div>
                ))}
            </div>
          )}
          {allDeposits.length > 0 && (
            <p style={{textAlign: "center", color: "#888", fontSize: 15, marginTop: 22}}>No more data...</p>
          )}
        </div>
      )}
    </div>
  );
}
