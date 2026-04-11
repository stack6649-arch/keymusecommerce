import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskRecords } from "../context/TaskRecordsContext";
import { useBalance } from "../context/balanceContext";
import { useToast } from "../context/ToastContext";
import "./Tasks.css";

import startButtonImg from "../assets/images/start/startbutton.png";

/*
  Tasks.jsx

  Changes in this version:
  - Layout and markup updated so the Tasks page matches the provided designs on both mobile and desktop.
  - Visual sections added/arranged: big ACCESS header + subtitle, balance row with left accent and Recharge button,
    white stat cards, beige stat blocks (DATA / frozen / balance due), and the black CTA "Start grabbing orders →".
  - All previous functionality (API calls, start/submit flows, modals, toasts, etc.) preserved as-is.
  - The "Begin" button label and placement were adjusted to match the design; handler and logic remain unchanged.

  Modal styling changes in this file (per user request):
  - Changed modal title "Task Submission" -> "Order submission".
  - Updated modal font sizes, colors and layout to match the provided screenshot: larger title font, muted grey labels,
    bold numeric/right-side values for Total, commission and order number, larger bright blue submit button with rounded corners.
  - Adjusted created time label, "Order number" label and value fallback logic (uses currentTask.orderNumber if present, otherwise taskCode).
  - Toast now shows only animated bars without text, displays for 1 second, then modal appears.
  - Modal is now fixed sized so it never scrolls; content has been reduced (smaller image, tighter paddings, reduced font sizes)
    so everything fits within the modal on mobile and desktop and the "Proceed to Submit" button is always visible.

  Real-time update change:
  - Added a 1-second polling loop that fetches /api/user-profile and updates localProfile state.
  - UI prefers values from localProfile when present so balance/frozen/commission appear within ~1s without waiting for manual refresh.
*/

const API_BASE = import.meta.env.VITE_API_URL || 'https://keymuse-backend.onrender.com';

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
const START_BLUE = "#0b62ff"; // updated blue to match screenshots
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

function AnimatedBarsToast({ show }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "24px",
            background: "#000",
            borderRadius: "3px",
            animation: `barBounce 0.8s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes barBounce {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
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
  // Format: DD/MM/YYYY, hh:mm:ss am/pm
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const seconds = d.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hourStr = hours.toString().padStart(2, "0");
  return `${day}/${month}/${year}, ${hourStr}:${minutes}:${seconds} ${ampm}`;
}

export default function Tasks() {
  // preserved state/logic
  const [productGrid, setProductGrid] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [showOptimizingToast, setShowOptimizingToast] = useState(false);
  const [submitState, setSubmitState] = useState("");
  const [fadeSpinner, setFadeSpinner] = useState(false);
  const [greyToast, setGreyToast] = useState({ show: false, message: "" });

  // Local authoritative profile returned by polling (/api/user-profile)
  const [localProfile, setLocalProfile] = useState(null);

  // NEW: Track frozen amount shown in UI while an order is pending submission.
  // Only used to display the deducted amount locally in the UI (frontend-only).
  const [frozenAmount, setFrozenAmount] = useState(0);

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
    userProfile,
    applyStartDeduction,
    applySubmitRefund
  } = useBalance();

  const { showToast } = useToast();

  const [localCommissionToday, setLocalCommissionToday] = useState(commissionToday);
  useEffect(() => setLocalCommissionToday(commissionToday), [commissionToday]);

  // Polling control
  const pollingRef = useRef({ fetching: false, alive: true });

  // Helper: parse numeric price values safely from product objects
  const parsePrice = (val) => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    // remove common non-numeric characters (commas, currency symbols)
    const cleaned = String(val).replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // Helper: compute frozen amount for a task (supports either single product or array of products)
  // This is used only on the frontend to display the deducted amount when a task starts.
  const computeFrozenFromTask = (task) => {
    if (!task) return 0;
    // common shape: task.product { price: ... }
    const p = task.product;
    if (p) {
      // if product is an array (products) or object
      if (Array.isArray(p)) {
        return p.reduce((s, it) => s + parsePrice(it.price), 0);
      }
      return parsePrice(p.price);
    }
    // alternative: task.products (plural)
    const ps = task.products || task.items || null;
    if (Array.isArray(ps) && ps.length > 0) {
      return ps.reduce((s, it) => s + parsePrice(it.price), 0);
    }
    // fallback: maybe task.totalPrice
    if (task.totalPrice != null) return parsePrice(task.totalPrice);
    return 0;
  };

  // Current authoritative profile to use in UI (prefer polled localProfile, fallback to context userProfile)
  const currentProfile = localProfile || userProfile || null;

  useEffect(() => {
    // initial context refresh (existing)
    refreshProfile && refreshProfile();

    // load immediate profile once on mount and set frozen
    loadProfileOnce();

    // Start polling every 1 second for profile updates
    pollingRef.current.alive = true;
    const id = setInterval(async () => {
      if (!pollingRef.current.alive) return;
      if (pollingRef.current.fetching) return; // avoid overlapping requests
      pollingRef.current.fetching = true;
      try {
        await pollProfile();
      } finally {
        pollingRef.current.fetching = false;
      }
    }, 1000);

    return () => {
      pollingRef.current.alive = false;
      clearInterval(id);
    };
  }, []);

  // Set up product grid rotation
  useEffect(() => setProductGrid(getRandomProducts()), []);
  useEffect(() => {
    const interval = setInterval(() => setProductGrid(getRandomProducts()), 7000);
    return () => clearInterval(interval);
  }, []);

  function getCurrentTaskCountThisSet() {
    const profileForCount = currentProfile;
    if (!records || !profileForCount) return 0;
    const currentSet = profileForCount.currentSet ?? 1;
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
    (currentProfile && currentProfile.maxTasks) ||
    vipConfig[Number(vipLevel)]?.taskLimit ||
    40;

  const todaysTasks = getCurrentTaskCountThisSet();

  const showGreyToast = (message, duration = 1600) => {
    setGreyToast({ show: true, message });
    setTimeout(() => setGreyToast({ show: false, message: "" }), duration);
  };

  async function pollProfile() {
    try {
      const headers = { "Content-Type": "application/json" };
      try {
        const token = localStorage.getItem("token");
        if (token) headers["x-auth-token"] = token;
      } catch (e) {
        // ignore localStorage errors
      }
      const resp = await fetch(`${API_BASE}/api/user-profile`, {
        method: "GET",
        headers,
      });
      const j = await resp.json();
      if (j && j.success && j.user) {
        // Only update state if values changed to reduce rerenders (simple compare)
        setLocalProfile(prev => {
          const prevJson = prev ? JSON.stringify({
            balance: prev.balance,
            frozenAmount: prev.frozenAmount,
            commissionToday: prev.commissionToday,
            currentSet: prev.currentSet,
            maxTasks: prev.maxTasks,
            vipLevel: prev.vipLevel
          }) : null;
          const next = j.user;
          const nextJson = JSON.stringify({
            balance: next.balance,
            frozenAmount: next.frozenAmount,
            commissionToday: next.commissionToday,
            currentSet: next.currentSet,
            maxTasks: next.maxTasks,
            vipLevel: next.vipLevel
          });
          if (prevJson !== nextJson) {
            // update local frozenAmount for immediate display
            if (typeof next.frozenAmount !== "undefined") {
              setFrozenAmount(Number(next.frozenAmount || 0));
            }
            return next;
          }
          return prev;
        });
      }
    } catch (e) {
      // ignore polling errors; we'll retry next tick
    }
  }

  // initial one-time load (used on mount)
  async function loadProfileOnce() {
    try {
      const headers = { "Content-Type": "application/json" };
      try {
        const token = localStorage.getItem("token");
        if (token) headers["x-auth-token"] = token;
      } catch (e) {
        // ignore
      }
      const resp = await fetch(`${API_BASE}/api/user-profile`, { method: "GET", headers });
      const j = await resp.json();
      if (j && j.success && j.user) {
        setLocalProfile(j.user);
        if (typeof j.user.frozenAmount !== "undefined") {
          setFrozenAmount(Number(j.user.frozenAmount || 0));
        }
      }
    } catch (e) {
      // ignore
    }
  }

  const handleStartTask = async () => {
    if (hasPendingTask() || hasPendingComboTask()) {
      showGreyToast("Please submit the previous rating before you proceed.");
      return;
    }

    if (todaysTasks >= maxTasks) {
      showGreyToast("Task set complete. Please contact customer service for reset.");
      return;
    }

    setOptimizing(true);
    setShowOptimizingToast(true);

    const imageForTask = productGrid[4];

    // Hide toast after 1 second, then show modal
    setTimeout(() => {
      setShowOptimizingToast(false);
    }, 1000);

    try {
      const headers = { "Content-Type": "application/json" };
      let bodyPayload = {};
      try {
        const token = localStorage.getItem("token");
        if (token) {
          headers["x-auth-token"] = token;
          bodyPayload = {};
        } else if (process.env.NODE_ENV !== "production") {
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
      setShowOptimizingToast(false);

      if (!resp.ok) {
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

        // IMPORTANT (frontend-only): compute and display the deducted amount in Frozen Balance.
        // Also apply optimistic deduction to the global balance so other pages reflect the deduction immediately.
        try {
          const frozen = computeFrozenFromTask(backendTask);
          // update page-local display
          setFrozenAmount(frozen);
          // apply optimistic deduction globally (so dashboards and top bars update instantly)
          try { applyStartDeduction && applyStartDeduction(frozen); } catch (e) {}
        } catch (e) {
          setFrozenAmount(0);
        }

        // Additionally, fetch the persisted frozenAmount from /api/user-profile so UI shows server value (survives refresh)
        loadProfileOnce();

        return;
      }

      showGreyToast(result.message || "Failed to start task. Please try again later.");
    } catch (err) {
      setOptimizing(false);
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

      // Clear the frontend frozen amount because the backend refunds on submit
      setFrozenAmount(0);

      // Apply optimistic refund to global balance and commission (if we can derive them)
      try {
        const refund = Number(result.task?.product?.price) || 0;
        const commission = Number(result.task?.product?.commission) || 0;
        try { applySubmitRefund && applySubmitRefund({ refundAmount: refund, commissionAmount: commission }); } catch (e) {}
      } catch (e) {
        // ignore if shape unknown
      }

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
    // Use orderNumber if available (some backends include it), otherwise fall back to taskCode.
    const orderNumber = currentTask.orderNumber ?? currentTask.taskCode ?? "";
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-2" style={{fontFamily:"Arial, Helvetica, sans-serif"}}>
        <div
          className="w-full bg-white rounded-3xl shadow-2xl"
          style={{
            minWidth: 320,
            maxWidth: 520,
            borderRadius: 20,
            border: "none",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            paddingBottom: 0,
            background: "#ffffff",
            overflow: "hidden",
            // Fixed sizing: make modal a fixed height that fits within viewport and does NOT scroll.
            width: "calc(100% - 32px)",
            height: "78vh",            // fixed viewport-relative height (reduced)
            maxHeight: 780,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with title - no close button */}
          <div style={{
            padding: "18px 18px 12px 18px",
            borderBottom: "1px solid #f0f0f0",
            flex: "0 0 auto"
          }}>
            <div style={{
              fontWeight: 900,
              fontSize: 24,
              color: "#111111",
              letterSpacing: "-0.01em"
            }}>
              Order submission
            </div>
          </div>

          {/* Content area - no internal scrolling, sizes reduced so everything fits */}
          <div style={{
            // ensure this area fits the fixed modal height; no internal scroll
            flex: "1 1 auto",
            overflow: "hidden",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}>
            {/* Product image */}
            <div style={{
              padding: "6px 8px 0 8px",
              flex: "0 0 auto"
            }}>
              <img
                src={product.image}
                alt="Product"
                style={{
                  width: "100%",
                  height: "220px",         // increased image height so it uses more of the modal vertical space
                  borderRadius: 12,
                  objectFit: "cover",
                  display: "block",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
                }}
              />
            </div>

            {/* Product info & details (compact) */}
            <div style={{
              padding: "8px 8px",
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflow: "hidden"
            }}>
              <div style={{
                display: "inline-block",
                background: "#E8DAFF",
                color: "#7C3AED",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 700,
                marginTop: 8, /* moved down slightly so the image can take more vertical space above */
                marginBottom: 6,
                flex: "0 0 auto"
              }}>
                Brand
              </div>

              {/* Product name (reduced lines / size) */}
              <div style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#111111",
                marginBottom: 6,
                lineHeight: "1.15",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {product.name}
              </div>

              {/* Quantity */}
              <div style={{
                fontSize: 13,
                color: "#8a8a8a",
                marginBottom: 6,
                fontWeight: 500
              }}>
                Quantity: 1
              </div>

              {/* Compact details grid - two columns */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginTop: 6,
                alignItems: "center"
              }}>
                <div style={{ fontSize: 13, color: "#8a8a8a", fontWeight: 600 }}>Create Time</div>
                <div style={{ fontSize: 13, color: "#111", fontWeight: 700, textAlign: "right" }}>
                  {formatDate(product.createdAt || currentTask.createdAt)}
                </div>

                <div style={{ fontSize: 13, color: "#8a8a8a", fontWeight: 600 }}>Order Number</div>
                <div style={{ fontSize: 13, color: "#111", fontWeight: 700, textAlign: "right", fontFamily: "monospace" }}>
                  {orderNumber}
                </div>

                <div style={{ fontSize: 13, color: "#8a8a8a", fontWeight: 600 }}>Status</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    background: "#FCD34D",
                    color: "#1F2937",
                    borderRadius: 10,
                    padding: "4px 8px",
                    fontSize: 12,
                    fontWeight: 800,
                    display: "inline-block"
                  }}>
                    PENDING
                  </div>
                </div>

                <div style={{ fontSize: 13, color: "#8a8a8a", fontWeight: 600 }}>Total amount</div>
                <div style={{ fontSize: 15, color: "#111", fontWeight: 900, textAlign: "right" }}>{product.price}</div>

                <div style={{ fontSize: 13, color: "#8a8a8a", fontWeight: 600 }}>Commission</div>
                <div style={{ fontSize: 14, color: "#10B981", fontWeight: 900, textAlign: "right" }}>{product.commission ?? "0.00"}</div>
              </div>
            </div>
          </div>

          {/* Footer with Submit button (always visible, no scrolling) */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid #eee",
            background: "#fff",
            flex: "0 0 auto",
          }}>
            <button
              onClick={submitState === "" ? handleSubmitTask : undefined}
              disabled={submitState !== ""}
              style={{
                width: "100%",
                background: "#000000",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "12px",
                fontSize: "17px",
                fontWeight: 800,
                cursor: submitState === "" ? "pointer" : "not-allowed",
                transition: "opacity 0.2s",
                opacity: submitState === "" ? 1 : 0.7
              }}
            >
              {submitState === "submitting" ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Spinner size={18} style={{ marginRight: 10 }} color="#fff" />
                  Submitting...
                </span>
              ) : submitState === "submitted" ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Spinner size={18} style={{ marginRight: 10 }} color="#fff" />
                  Submitted!
                </span>
              ) : (
                "Proceed to Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use polled/local values if available; fall back to context values.
  const displayBalance = (currentProfile && typeof currentProfile.balance !== "undefined") ? Number(currentProfile.balance) : Number(balance || 0);
  const displayFrozen = (currentProfile && typeof currentProfile.frozenAmount !== "undefined") ? Number(currentProfile.frozenAmount) : Number(frozenAmount || 0);
  const displayCommissionToday = (currentProfile && typeof currentProfile.commissionToday !== "undefined") ? Number(currentProfile.commissionToday) : Number(localCommissionToday || 0);
  const displayMaxTasks = (currentProfile && typeof currentProfile.maxTasks !== "undefined") ? currentProfile.maxTasks : maxTasks;

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* Important styles for this page (no hiding of global header/footer) */}
      <style>{`
        /* Keep a consistent spin animation for components that use it */
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Small responsive adjustments to ensure the fixed modal content fits on smaller phones */
        @media (max-width: 420px) {
          .tasks-modal-image { height: 120px !important; }
        }
      `}</style>

      {/* Top gradient header area */}
      <div className="tasks-hero-area" aria-hidden="false">
        <div className="tasks-hero-inner">
          <header className="tasks-hero-header">
            <div className="tasks-hero-title">ACCESS</div>
            <div className="tasks-hero-sub">EXPLORE YOUR ACCOUNT AND GRAB YOUR ORDERS</div>
          </header>

          {/* Balance row: left accent + amount; right side Recharge button */}
          <div className="tasks-balance-row">
            <div className="tasks-balance-left">
              <div className="tasks-balance-accent" />
              <div className="tasks-balance-value">{displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="tasks-balance-label">CURRENT_BALANCE</div>
            </div>
            <div className="tasks-balance-action">
              <button
                onClick={() => navigate("/deposit")}
                className="tasks-recharge-btn"
              >
                Recharge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content card area */}
      <div className="tasks-centered-section">
        <div className="tasks-card">
          {/* Top two white stat cards */}
          <div className="tasks-stats-grid">
            <div className="stat-card white">
              <div className="stat-value">{displayCommissionToday.toFixed(2)}</div>
              <div className="stat-label">TODAY'S EARNINGS </div>
            </div>

            <div className="stat-card white">
              <div className="stat-value">{Number(displayFrozen).toFixed(2)}</div>
              <div className="stat-label">FROZEN BALANCE </div>
            </div>
          </div>

          {/* Beige/tan row with DATA / frozen / balance due */}
          <div className="tasks-beige-grid">
            <div className="beige-card">
              <div className="beige-value">{todaysTasks} / {displayMaxTasks}</div>
              <div className="beige-label">DATA</div>
            </div>
            <div className="beige-card">
              <div className="beige-value">{Number(displayFrozen).toFixed(2)}</div>
              <div className="beige-label">FROZEN BALANCE </div>
            </div>
            <div className="beige-card">
              <div className="beige-value">{Number(displayBalance).toFixed(2)}</div>
              <div className="beige-label">BALANCE DUE</div>
            </div>
          </div>

          {/* Black CTA — matches screenshot; uses existing start handler */}
          <div style={{ marginTop: 24, marginBottom: 18 }}>
            <button
              className="tasks-start-cta"
              onClick={handleStartTask}
              disabled={optimizing}
              aria-disabled={optimizing}
            >
              Start grabbing orders →
            </button>
          </div>

          {/* Informational list below CTA */}
          <div style={{ color: "#6b6b6b", fontSize: 14, lineHeight: 1.5 }}>
            <ol style={{ paddingLeft: 18 }}>
              <li style={{ marginBottom: 6 }}>Please proceed with initiating the withdrawal process upon completion of all your daily orders.</li>
              <li>Our system algorithm ensures that the distribution of all products is conducted in a completely randomized manner, offering an equitable and unbiased process.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Modal (updated design) */}
      {showModal && renderTaskModal()}

      {/* Fade overlay */}
      <FadeOverlay show={fadeSpinner}>
        <Spinner size={44} color={START_BLUE} />
      </FadeOverlay>

      {/* Animated bars toast */}
      <AnimatedBarsToast show={showOptimizingToast} />

      {/* Grey toast */}
      <GreyToast show={greyToast.show} message={greyToast.message} />

    </div>
  );
}
