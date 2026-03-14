// (full file — removed hard-coded COMBO_TRIGGER_INDEX and the pre-check using it)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskRecords } from "../context/TaskRecordsContext";
import { useBalance } from "../context/balanceContext";
import { useToast } from "../context/ToastContext";
import "./Tasks.css";

import startButtonImg from "../assets/images/start/startbutton.png";

/*
  Tasks.jsx

  Changes in this version:
  - Removed the hard-coded COMBO_TRIGGER_INDEX and the local pre-check that tried to predict combos.
    The client now relies on the server's decision (result.isCombo) after calling /api/start-task.
  - The rest of the code is preserved; only the pre-start predictive check was removed so client/server
    do not disagree about when combos should be issued.
*/

const API_BASE = import.meta.env.VITE_API_URL || 'https://stacksapp-backend-main.onrender.com';

const CLOUDINARY_BASE = "https://res.cloudinary.com/dhubpqnss/image/upload/v1748650920/products/";
const imageStart = 42;
const imageEnd = 442;
const totalImages = imageEnd - imageStart + 1;
const imageList = Array.from(
  { length: totalImages },
  (_, i) => `${CLOUDINARY_BASE}product1_${i + imageStart}.jpg`
);

const getRandomProducts = () => {
  const shuffled = [...imageList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 9);
};

const vipConfig = {
  1: { taskLimit: 40 },
  2: { taskLimit: 45 },
  3: { taskLimit: 50 },
  4: { taskLimit: 55 },
};

const HEADER_HEIGHT = 64;
const START_BLUE = "#1fb6fc";
const BLACK_BG = "#071e3d";

function Spinner({ size = 36, color = "#bbb", style = {} }) {
  return (
    <div
      style={{
        border: `3px solid #ececec`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
        width: size,
        height: size,
        animation: "spin 0.9s linear infinite",
        ...style,
      }}
    />
  );
}

function FadeOverlay({ show, children }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 11000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255,255,255,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "all",
      }}
    >
      {children}
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function OptimizingToast({ show }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "-60px",
        transform: "translateX(-50%)",
        background: "rgba(60,60,60,0.72)",
        color: "#fff",
        borderRadius: 13,
        padding: "7px 28px 7px 15px",
        fontWeight: 600,
        fontSize: 17,
        boxShadow: "0 2px 10px #0002",
        display: show ? "flex" : "none",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <Spinner size={22} color="#b2b2b2" style={{ marginRight: 10 }} />
      Optimizing...
    </div>
  );
}

function GreyToast({ show, message }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "22%",
        transform: "translateX(-50%)",
        background: "#eee",
        color: "#666",
        borderRadius: 10,
        padding: "10px 28px",
        fontWeight: 500,
        fontSize: 15.5,
        boxShadow: "0 2px 12px #0001",
        zIndex: 99999,
        minWidth: 210,
        maxWidth: "80vw",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          border: "3px solid #e0e0e0",
          borderTop: "3px solid #bbb",
          borderRadius: "50%",
          marginRight: 13,
          display: "inline-block",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span>{message}</span>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}

export default function Tasks() {
  // preserved state/logic
  const [productGrid, setProductGrid] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [showOptimizingOverlay, setShowOptimizingOverlay] = useState(false);
  const [showOptimizingToast, setShowOptimizingToast] = useState(false);
  const [submitState, setSubmitState] = useState("");
  const [fadeSpinner, setFadeSpinner] = useState(false);
  const [greyToast, setGreyToast] = useState({ show: false, message: "" });

  const navigate = useNavigate();
  const {
    addTaskRecord,
    submitTaskRecord,
    hasPendingTask,
    hasPendingComboTask,
    records,
  } = useTaskRecords();

  const {
    balance,
    commissionToday,
    vipLevel,
    refreshProfile,
    userProfile
  } = useBalance();

  const { showToast } = useToast();

  const [localCommissionToday, setLocalCommissionToday] = useState(commissionToday);
  useEffect(() => setLocalCommissionToday(commissionToday), [commissionToday]);

  useEffect(() => {
    refreshProfile && refreshProfile();
  }, []);

  useEffect(() => setProductGrid(getRandomProducts()), []);
  useEffect(() => {
    const interval = setInterval(() => setProductGrid(getRandomProducts()), 7000);
    return () => clearInterval(interval);
  }, []);

  function getCurrentTaskCountThisSet() {
    if (!records || !userProfile) return 0;
    const currentSet = userProfile.currentSet ?? 1;
    let comboTaskCodes = new Set();
    let count = 0;
    records.forEach(r => {
      if (
        r.status === "Completed" &&
        (r.set === currentSet || r.set === undefined)
      ) {
        if (r.isCombo) {
          if (r.taskCode && !comboTaskCodes.has(r.taskCode)) {
            count += 1;
            comboTaskCodes.add(r.taskCode);
          }
        } else {
          count += 1;
        }
      }
    });
    let pendingComboCodes = new Set();
    let hasPendingCombo = false;
    records.forEach(r => {
      if (
        r.status === "Pending" &&
        (r.set === currentSet || r.set === undefined)
      ) {
        if (r.isCombo) {
          if (r.taskCode && !pendingComboCodes.has(r.taskCode)) {
            hasPendingCombo = true;
            pendingComboCodes.add(r.taskCode);
          }
        } else {
          count += 1;
        }
      }
    });
    if (hasPendingCombo) count += 1;
    return count;
  }

  const maxTasks =
    (userProfile && userProfile.maxTasks) ||
    vipConfig[Number(vipLevel)]?.taskLimit ||
    40;

  const todaysTasks = getCurrentTaskCountThisSet();

  const showGreyToast = (message, duration = 1600) => {
    setGreyToast({ show: true, message });
    setTimeout(() => setGreyToast({ show: false, message: "" }), duration);
  };

  const handleStartTask = async () => {
    if (hasPendingTask() || hasPendingComboTask()) {
      showGreyToast("Please submit the previous rating before you proceed.");
      return;
    }

    if (todaysTasks >= maxTasks) {
      showGreyToast("Task set complete. Please contact customer service for reset.");
      return;
    }

    // NOTE: Removed local pre-check that predicted combo triggers. We now rely on server response
    // which is authoritative (server returns result.isCombo when a combo was created).

    setOptimizing(true);
    setShowOptimizingOverlay(true);
    setShowOptimizingToast(true);

    const imageForTask = productGrid[4];

    // hide the little optimizing toast after a short time but keep overlay until response
    setTimeout(() => setShowOptimizingToast(false), 1150);

    try {
      // build headers: prefer real token; do NOT send custom dev header (avoid CORS preflight)
      const headers = { "Content-Type": "application/json" };
      let bodyPayload = {};
      try {
        const token = localStorage.getItem("token");
        if (token) {
          headers["x-auth-token"] = token;
          bodyPayload = {};
        } else if (process.env.NODE_ENV !== "production") {
          // prefer username from profile if available
          const devUsername = (userProfile && userProfile.username) || localStorage.getItem("devUsername");
          if (devUsername) {
            bodyPayload = { devUsername };
          }
        }
      } catch (e) {
        // ignore localStorage errors
      }

      const resp = await fetch(`${API_BASE}/api/start-task`, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyPayload),
      });

      const result = await resp.json();

      // ensure UI flags reset
      setOptimizing(false);
      setShowOptimizingOverlay(false);
      setShowOptimizingToast(false);

      if (!resp.ok) {
        // server returned non-2xx
        showGreyToast(result.message || "Failed to start task. Try again.");
        return;
      }

      // server signals a combo task was created
      if (result && result.isCombo) {
        showGreyToast("Please submit the previous rating before you proceed.", 1800);
        setTimeout(() => {
          navigate("/deposit");
        }, 1800);
        return;
      }

      if (result && result.task) {
        const backendTask = result.task;
        if (!backendTask.product) backendTask.product = {};
        if (!backendTask.product.image) backendTask.product.image = imageForTask;
        setCurrentTask(backendTask);
        setShowModal(true);
        setSubmitState("");
        // refresh profile proactively so balance/commission are current when task starts
        try {
          refreshProfile && refreshProfile();
        } catch (e) {
          // noop
        }
        return;
      }

      showGreyToast(result.message || "Failed to start task. Please try again later.");
    } catch (err) {
      setOptimizing(false);
      setShowOptimizingOverlay(false);
      setShowOptimizingToast(false);
      showGreyToast("API error: " + (err && err.message ? err.message : String(err)));
    }
  };

  const handleSubmitTask = async () => {
    // Start submitting
    setSubmitState("submitting");

    const start = Date.now();
    try {
      // Perform submission API call
      const result = await submitTaskRecord(currentTask.taskCode);

      if (!result || !result.success) {
        setSubmitState("");
        showGreyToast((result && result.message) || "Failed to submit task");
        return;
      }

      // Mark submitted in UI immediately
      setSubmitState("submitted");

      // Try to refresh profile but do not block longer than allowed.
      // We'll race refreshProfile() against a timeout so the whole submission flow completes within 3s.
      const MAX_TOTAL_MS = 3000;
      const MAX_REFRESH_MS = 1800; // allow up to this for profile refresh

      const refreshFn = () => {
        try {
          return refreshProfile ? refreshProfile() : Promise.resolve();
        } catch (e) {
          return Promise.resolve();
        }
      };

      // Await either refreshProfile or the refresh timeout (whichever comes first)
      await Promise.race([
        (async () => {
          const maybe = refreshFn();
          if (maybe && typeof maybe.then === "function") {
            // await the refresh but ensure it doesn't exceed MAX_REFRESH_MS
            return Promise.race([maybe, new Promise((res) => setTimeout(res, MAX_REFRESH_MS))]);
          }
          return maybe;
        })(),
        new Promise((res) => setTimeout(res, MAX_REFRESH_MS)),
      ]);

      // Ensure we don't exceed MAX_TOTAL_MS from the start: compute elapsed and finish within allowed window.
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MAX_TOTAL_MS - elapsed);

      // We will do a short wait to allow the user to perceive the "Submitted" state, but we won't exceed the total.
      // Keep this small (<= 600ms) so overall flow remains snappy.
      const SHORT_PAUSE = Math.min(600, remaining);
      if (SHORT_PAUSE > 0) {
        await new Promise((res) => setTimeout(res, SHORT_PAUSE));
      }

      // Close modal and clear current task so user returns to tasks list
      setShowModal(false);
      setCurrentTask(null);
      setSubmitState("");
      setFadeSpinner(true);

      // hide fade spinner quickly and navigate back to tasks so user can start another task
      setTimeout(() => {
        setFadeSpinner(false);
        // navigate to tasks (same page) to ensure the UI resets as intended
        try {
          navigate("/tasks");
        } catch (e) {
          // noop
        }
      }, 250);
    } catch (err) {
      setSubmitState("");
      showGreyToast("Submission error: " + (err && err.message ? err.message : String(err)));
    }
  };

  function renderTaskModal() {
    if (!currentTask) return null;
    const product = currentTask.product || {};
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-2" style={{fontFamily:"Arial,sans-serif"}}>
        <div
          className="w-full max-w-lg bg-white rounded-[18px] shadow-xl"
          style={{
            minWidth: 320,
            maxWidth: 460,
            borderRadius: 18,
            border: "none",
            boxShadow: "0 10px 40px #0002, 0 0 1px #0001",
            paddingBottom: 20
          }}
        >
          <div className="flex justify-between items-center mb-0 px-6 pt-6 pb-1">
            <div
              style={{
                fontWeight: 700,
                fontSize: 24,
                color: "#232323",
                letterSpacing: "0.01em"
              }}
            >
              Task Submission
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 text-2xl px-2 py-1 rounded hover:bg-gray-100"
              style={{ lineHeight: 1, background: "none", border: "none" }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="flex flex-row items-center px-6" style={{marginTop:6, marginBottom:10}}>
            <img
              src={product.image}
              alt="Product"
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                objectFit: "cover",
                marginRight: 14,
                boxShadow: "0 2px 10px #0001"
              }}
            />
            <div style={{flex:1, minWidth:0}}>
              <div style={{
                fontWeight: 700,
                fontSize: 21.5,
                color: "#222",
                marginBottom: 2,
                letterSpacing: 0.01,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.15"
              }}>
                {product.name}
              </div>
              <div style={{
                fontWeight: 400,
                fontSize: 19,
                color: "#222",
                marginBottom: 1,
                lineHeight: "1.12"
              }}>
                <span style={{ color: BLACK_BG, fontWeight: 700 }}>GBP</span>{" "}
                <span style={{ color: START_BLUE, fontWeight: 700 }}>{product.price}</span>
              </div>
              <div style={{
                margin: "2px 0 0 0",
                display: "flex",
                alignItems: "center"
              }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="21" height="21" viewBox="0 0 32 32" fill="#FFD700" style={{ marginRight: i < 4 ? 1 : 0 }}>
                    <polygon points="16,2 20,12 31,12.5 22,19 25,29 16,23.5 7,29 10,19 1,12.5 12,12" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid #ededed",
            margin: "3px 0 0 0"
          }} />

          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "14px 8px 8px 8px"
          }}>
            <div style={{
              flex: 1,
              textAlign: "center"
            }}>
              <div style={{
                fontWeight: 700,
                fontSize: 17,
                color: "#6a6b72",
                marginBottom: 3
              }}>Total Amount</div>
              <div style={{
                color: START_BLUE,
                fontWeight: 700,
                fontSize: 21.5,
                letterSpacing: ".01em"
              }}>
                <span style={{ color: BLACK_BG, fontWeight: 700 }}>GBP</span> {product.price}
              </div>
            </div>
            <div style={{
              flex: 1,
              textAlign: "center"
            }}>
              <div style={{
                fontWeight: 700,
                fontSize: 17,
                color: "#6a6b72",
                marginBottom: 3
              }}>Commission</div>
              <div style={{
                color: START_BLUE,
                fontWeight: 700,
                fontSize: 21.5,
                letterSpacing: ".01em"
              }}>
                <span style={{ color: BLACK_BG, fontWeight: 700 }}>GBP</span> {product.commission}
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid #ededed",
            margin: "0 0 0 0"
          }} />

          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "13px 28px 0 28px",
            fontSize: 14.5,
            fontWeight: 500,
            color: "#222",
            letterSpacing: "0.01em"
          }}>
            <div>Created At</div>
            <div style={{ fontWeight: 700 }}>
              {formatDate(product.createdAt || currentTask.createdAt)}
            </div>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 28px 0 28px",
            fontSize: 14.5,
            fontWeight: 500,
            color: "#222",
            letterSpacing: "0.01em"
          }}>
            <div>Task Code</div>
            <div style={{
              fontWeight: 700,
              color: START_BLUE,
              fontFamily: "monospace",
              fontSize: 15.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "63vw",
              textTransform: "uppercase"
            }}>
              {currentTask.taskCode}
            </div>
          </div>

          <div style={{ padding: "0 28px 0 28px", marginTop: 18 }}>
            <button
              onClick={submitState === "" ? handleSubmitTask : undefined}
              disabled={submitState !== ""}
              className="mt-2 w-full py-2 text-white rounded-full font-semibold text-lg"
              style={{
                background: START_BLUE,
                opacity: 1,
                transition: "opacity 0.2s",
                boxShadow: `0 1px 8px ${START_BLUE}22`,
                borderRadius: "18px",
                fontSize: "1.18rem",
                marginTop: 2
              }}
            >
              {submitState === "submitting" ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Spinner size={24} style={{ marginRight: 9 }} color={START_BLUE} />
                  Submitting...
                </span>
              ) : submitState === "submitted" ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Spinner size={24} style={{ marginRight: 9 }} color={START_BLUE} />
                  Submitted!
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* Important styles for this page (no hiding of global header/footer) */}
      <style>{`
        /* Gradient background that covers the full tasks content (including support block) */
        .tasks-gradient-bg {
          width: 100%;
          min-height: 480px;
          background: linear-gradient(120deg, #071e2f 0%, #1f4287 45%, #278ea5 85%, #21e6c1 100%);
          position: relative;
          display: block;
          color: #fff;
        }
        .tasks-gradient-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, rgba(7,30,61,0.92) 60%, rgba(39,142,165,0.80) 100%);
          z-index: 0;
          pointer-events: none;
        }
        .tasks-centered-section {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 16px 48px 16px;
          box-sizing: border-box;
        }
        .tasks-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,251,252,0.98));
          border-radius: 10px;
          padding: 28px 18px;
          box-shadow: 0 8px 30px rgba(2,6,23,0.12);
          color: #111;
        }
        .tasks-stats { text-align: center; color: #fff; }
        .tasks-stats .big { font-size: 30px; font-weight: 800; color: #fff; }
        .tasks-stats .label { font-size: 12px; color: rgba(255,255,255,0.85); margin-bottom: 18px; }
        .tasks-begin-btn {
          display: inline-block;
          background: ${START_BLUE};
          color: #fff;
          padding: 12px 36px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 18px;
          box-shadow: 0 8px 28px ${START_BLUE}22;
          border: none;
          cursor: pointer;
        }

        /* Full-width progress track and fill:
           Track is now uniform green across the full width (fill set to 100%)
        */
        .tasks-progress-track {
          width: 100%;
          height: 8px;
          /* use the same gradient so the whole line is green */
          background: linear-gradient(90deg, #1f8fc0 0%, #21e6c1 100%);
          border-radius: 6px;
          overflow: hidden;
          margin-top: 12px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .tasks-progress-fill {
          height: 100%;
          width: 100%; /* full width so line is entirely green */
          background: linear-gradient(90deg, #1f8fc0 0%, #21e6c1 100%);
          border-radius: 6px;
          box-shadow: none;
        }

        /* Make recharge text very bold black */
        .tasks-recharge-btn {
          background: #fff !important;
          color: #000 !important;
          font-weight: 900 !important;
        }

        @media (max-width: 520px) {
          .tasks-centered-section { padding-left: 12px; padding-right: 12px; }
        }
      `}</style>

      {/* Gradient area */}
      <div className="tasks-gradient-bg" aria-hidden="false">
        <div className="tasks-centered-section">
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 34, margin: 0, fontWeight: 800 }}>Access</h1>

            {/* Full-width track that crosses the page, with an inner fill set to 100% */}
            <div className="tasks-progress-track" aria-hidden="true">
              <div className="tasks-progress-fill" />
            </div>
          </div>

          <div className="tasks-card" style={{ marginBottom: 28 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: "#314155", marginBottom: 6 }}>Account Balance</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#111", marginBottom: 8 }}>
                {Number(balance).toFixed(2)}
                <span style={{ fontSize: 14, fontWeight: 700, color: "#222", marginLeft: 8 }}>(GBP)</span>
              </div>
              <div>
                <button
                  onClick={() => navigate("/deposit")}
                  className="tasks-recharge-btn"
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 6px 18px rgba(16,84,122,0.08)",
                    cursor: "pointer"
                  }}
                >
                  Recharge
                </button>
              </div>
            </div>
          </div>

          <div className="tasks-stats" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{todaysTasks} / {maxTasks}</div>
            <div className="label">DATA</div>

            <div className="big" style={{ marginBottom: 6 }}>{Number(localCommissionToday).toFixed(5)}</div>
            <div className="label">TODAY'S EARNINGS (GBP)</div>

            <div className="big" style={{ marginBottom: 6 }}>{Number(balance).toFixed(6)}</div>
            <div className="label">BALANCE DUE (GBP)</div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <button className="tasks-begin-btn" onClick={handleStartTask} disabled={optimizing}>
              Begin
            </button>
          </div>

          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.5 }}>
            <ol style={{ paddingLeft: 16 }}>
              <li>Please proceed with initiating the withdrawal process upon completion of all your daily orders.</li>
              <li>Our system algorithm ensures the distribution of all products is conducted in a completely randomized manner, offering an equitable and unbiased process.</li>
            </ol>
          </div>

          {/* Support / info kept inside gradient so background doesn't switch to white */}
          <div style={{ marginTop: 36, color: "rgba(255,255,255,0.95)" }}>
            <h3 style={{ color: "#fff", marginBottom: 6, fontWeight: 700 }}>Welcome to Sequence</h3>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 12 }} />
            <div style={{ color: "rgba(255,255,255,0.88)" }}>
              <p style={{ marginBottom: 8, fontWeight: 700 }}>How can we help?</p>
              <p style={{ marginBottom: 6 }}>Our dedicated team is available to answer all your questions.</p>
              <p style={{ marginBottom: 6 }}>Everyday, 10:00 to 21:59.</p>
              <p style={{ marginBottom: 6 }}>If you get in touch outside of these hours we will aim to respond to you as quickly as possible the next working day.</p>
              <p>
                <strong>Customer Service:</strong>{" "}
                <a
                  href="#chat"
                  onClick={(e) => {
                    if (e && typeof e.preventDefault === "function") e.preventDefault();
                    try {
                      window.dispatchEvent(new CustomEvent("openCustomerService"));
                    } catch (err) {}
                  }}
                  style={{ color: "#ff4d4d", cursor: "pointer" }}
                >
                  Chat with us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal (unchanged) */}
      {showModal && renderTaskModal()}

      {/* Fade overlay */}
      <FadeOverlay show={fadeSpinner}>
        <Spinner size={44} color={START_BLUE} />
      </FadeOverlay>

      {/* Grey toast */}
      <GreyToast show={greyToast.show} message={greyToast.message} />

      {/* Optimizing toast */}
      {showOptimizingOverlay && (
        <div style={{
          position: "fixed", left: 0, right: 0, top: HEADER_HEIGHT + 8, display: "flex", justifyContent: "center", zIndex: 1200, pointerEvents: "none"
        }}>
          <OptimizingToast show={showOptimizingToast} />
        </div>
      )}

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
