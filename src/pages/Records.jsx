import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTaskRecords } from "../context/TaskRecordsContext";
import { useBalance } from "../context/balanceContext";
import "./Records.css";

import homeIcon from "../assets/images/tabBar/homeh.png";
import startingIcon from "../assets/images/tabBar/icon30.png";
import recordsIcon from "../assets/images/tabBar/records.png";

/*
  Records.jsx - optimized for instant UX

  Key changes:
  - Keep original logic, polling and submission flows unchanged.
  - Adapted markup and class names for the new Records.css to match the screenshots exactly:
    - card layout with left image, center title/quantity and right metadata + CTA
    - brand pill, status pills, totals and CTA button (Proceed to Submit)
  - Visual changes are only styling/markup to match screens. Business logic unchanged.
  - Ensure created time and a real order/task number are always shown (falling back to other fields when necessary).

  New behavior requested & implemented:
  - When there is a combo group (records sharing comboGroupId) and that combo contains at least one Pending item,
    the group is shown under the Pending tab. The top product in the combo (oldest by createdAt) is treated as the
    submit candidate: it always appears above its combo-mates, shows the yellow "PENDING" pill and will render the
    submit button (when canSubmit is true). All other products in that combo are shown immediately below the top item
    and display the red "FROZEN" pill (no submit button). Other view behavior remains unchanged.
*/

const tabs = ["All", "Pending", "Completed"];

const START_BLUE = "#1fb6fc";
const BLACK_BG = "#071e3d";

function SpinnerOverlay({ show }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 11000,
        background: "rgba(245,247,251,0.38)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          border: "6px solid #ddd",
          borderTop: `6px solid ${START_BLUE}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }}
      />
      <style>
        {`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
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

/* Helper to convert product names to Title Case */
function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w[0] ? w[0].toUpperCase() + w.slice(1) : w)
    .join(" ");
}

const Records = () => {
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();
  const { records, submitTaskRecord, fetchTaskRecords, addTaskRecord, hasPendingTask } = useTaskRecords();
  const { balance, commissionToday, refreshProfile } = useBalance();

  // displayRecords is local state used for immediate rendering.
  // It is seeded from context.records or from localStorage cache "taskRecords".
  const [displayRecords, setDisplayRecords] = useState(() => {
    try {
      const cached = localStorage.getItem("taskRecords");
      if (cached) return JSON.parse(cached);
    } catch (e) { /* ignore */ }
    // fallback to context records (may be empty initially)
    return records || [];
  });

  // spinner is short-lived (max 2000ms) to avoid long blocking UI
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitting, setSubmitting] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [greyToast, setGreyToast] = useState({ show: false, message: "" });

  const recordsRef = useRef(displayRecords);
  useEffect(() => {
    recordsRef.current = displayRecords;
  }, [displayRecords]);

  // Keep context.records in sync with local displayRecords when context updates.
  useEffect(() => {
    if (Array.isArray(records) && records.length > 0) {
      setDisplayRecords(records);
      try { localStorage.setItem("taskRecords", JSON.stringify(records)); } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Visibility/focus refresh: light background refresh when tab regains focus
  useEffect(() => {
    const onFocus = () => {
      if (fetchTaskRecords) fetchTaskRecords().catch(() => {});
    };
    const onVisibility = () => {
      if (!document.hidden && fetchTaskRecords) fetchTaskRecords().catch(() => {});
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial short background refresh: visible spinner capped at 2000ms.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // If we already have cached data to show, avoid showing a long spinner.
      const hasCached = Array.isArray(displayRecords) && displayRecords.length > 0;
      if (!hasCached) setShowSpinner(true);

      // run fetchTaskRecords but don't block the UI longer than 2 seconds
      const MAX_VISIBLE_MS = 2000;
      const start = Date.now();

      try {
        if (fetchTaskRecords) {
          // fire fetch (don't await forever)
          const fetchPromise = fetchTaskRecords();
          // race with timeout to ensure we never block more than MAX_VISIBLE_MS
          const race = Promise.race([
            fetchPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), MAX_VISIBLE_MS))
          ]);
          try {
            await race;
          } catch (e) {
            // timeout or fetch error -> ignore, record context may still update later
          }
        }
      } finally {
        // ensure spinner hides within MAX_VISIBLE_MS (even if fetchTaskRecords hangs)
        const elapsed = Date.now() - start;
        const remain = Math.max(0, MAX_VISIBLE_MS - elapsed);
        await sleep(remain);
        if (!cancelled) setShowSpinner(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // When navigating to the Records route specifically, do a short eager refresh (not blocking UI)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (location.pathname !== "/records") return;
      // if we already have data, do a background fetch without spinner
      try {
        if (fetchTaskRecords) {
          await fetchTaskRecords();
        }
      } catch (e) { /* ignore */ }
      if (mounted) {
        // context.records effect above will sync displayRecords and localStorage
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Regular polling for freshness (runs after initial load). Polling does not block UI.
  useEffect(() => {
    const iv = setInterval(() => {
      if (fetchTaskRecords) fetchTaskRecords().catch(() => {});
    }, 6000);
    return () => clearInterval(iv);
  }, [fetchTaskRecords]);

  // Helper: group all records by comboGroupId and sort groups by createdAt ascending
  function getAllComboGroups(recordsList) {
    const groups = {};
    for (const rec of recordsList) {
      if (rec.comboGroupId) {
        if (!groups[rec.comboGroupId]) groups[rec.comboGroupId] = [];
        groups[rec.comboGroupId].push(rec);
      }
    }
    Object.values(groups).forEach(arr =>
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );
    return groups;
  }

  const getRecordKey = (record, i) => {
    if (record.isCombo && typeof record.comboIndex !== "undefined") {
      return `${record.taskCode || record._id || "noid"}-combo-${record.comboIndex}`;
    }
    return record.taskCode || record._id || `idx-${i}`;
  };

  const showGrey = (message, duration = 1600) => {
    setGreyToast({ show: true, message });
    setTimeout(() => setGreyToast({ show: false, message: "" }), duration);
  };

  const handleSubmit = async (task) => {
    if (task.isCombo && task.canSubmit && balance < 0) {
      showGrey("Insufficient Balance.");
      setTimeout(() => {
        navigate("/deposit");
      }, 1600);
      return;
    }
    setSubmitting((prev) => ({ ...prev, [task.taskCode]: true }));
    setSubmitted((prev) => ({ ...prev, [task.taskCode]: false }));
    setTimeout(async () => {
      const result = await submitTaskRecord(task.taskCode);
      setSubmitting((prev) => ({ ...prev, [task.taskCode]: false }));
      if (!result.success && result.mustDeposit) {
        showGrey("Insufficient Balance.");
        setTimeout(() => {
          navigate("/deposit");
        }, 1600);
        return;
      }
      if (!result.success) {
        alert(result.message || "Failed to submit task.");
      } else {
        setSubmitted((prev) => ({ ...prev, [task.taskCode]: true }));
        try { await refreshProfile(); } catch (e) {}
        if (fetchTaskRecords) await fetchTaskRecords();
        setTimeout(() => {
          setSubmitted((prev) => ({ ...prev, [task.taskCode]: false }));
        }, 1500);
      }
    }, 300); // small debounce (not 3s) to speed UI responsiveness
  };

  // Build general combo groups from all records (used to determine combo membership & top-of-group)
  const comboGroupsAll = getAllComboGroups(displayRecords);

  // Determine which groups have at least one pending item -> these groups should be shown under Pending tab
  const pendingGroupIds = new Set();
  Object.entries(comboGroupsAll).forEach(([groupId, members]) => {
    if (members.some(m => String(m.status).toLowerCase() === "pending")) {
      pendingGroupIds.add(groupId);
    }
  });

  // Filter records by tab
  // Important: for the Pending tab include any record that is pending OR is part of a combo group that has a pending item.
  const filteredRecords = (displayRecords || []).filter((record) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") {
      if (String(record.status).toLowerCase() === "pending") return true;
      if (record.comboGroupId && pendingGroupIds.has(record.comboGroupId)) return true;
      return false;
    }
    // Completed or other tabs: match by record.status
    return (record.status && record.status.toLowerCase() === activeTab.toLowerCase());
  });

  // Build frozenMap and topMap:
  // For groups that are in pendingGroupIds and have 2+ members, mark all members except the first (oldest) as frozen.
  const frozenMap = {};
  const topMap = {}; // topMap[groupId] = taskCode of top item (oldest)
  Object.entries(comboGroupsAll).forEach(([groupId, members]) => {
    if (!pendingGroupIds.has(groupId)) return;
    if (!members || members.length < 2) return;
    // members sorted ascending by createdAt in comboGroupsAll
    topMap[groupId] = members[0] && (members[0].taskCode || members[0]._id);
    for (let idx = 1; idx < members.length; idx++) {
      const rec = members[idx];
      if (rec && rec.taskCode) {
        frozenMap[rec.taskCode] = true;
      }
    }
  });

  // Build sortedRecords: ensure that for each pending combo group, the top (submit candidate) appears first,
  // followed by its frozen siblings. Then append remaining records sorted by date desc.
  const byDateDesc = (x, y) => new Date(y.startedAt || y.createdAt) - new Date(x.startedAt || x.createdAt);

  const remaining = [...filteredRecords];

  const priorityList = [];
  // For deterministic ordering iterate pending groups and push members if they exist in remaining,
  // top first then other members in group order.
  Array.from(pendingGroupIds).forEach((groupId) => {
    const membersAll = comboGroupsAll[groupId] || [];
    // iterate members in ascending createdAt order (top first)
    membersAll.forEach((member) => {
      // include only if this member is part of filteredRecords (e.g., Pending tab)
      const idx = remaining.findIndex((x) => (x.taskCode || x._id) === (member.taskCode || member._id));
      if (idx !== -1) {
        priorityList.push(remaining[idx]);
        remaining.splice(idx, 1);
      }
    });
  });

  // Now add any other pending items that are not in groups (these remain in remaining)
  remaining.sort(byDateDesc);

  const sortedRecords = [...priorityList, ...remaining];

  const getRecordImage = (product) => {
    if (
      product &&
      typeof product.image === "string" &&
      product.image.trim() !== "" &&
      product.image !== "null"
    ) {
      return product.image;
    }
    return "/assets/images/products/default.png";
  };

  const renderProductRecord = (record, i) => {
    const isFrozenDisplay = !!frozenMap[record.taskCode];
    const isTopInPendingGroup =
      record.comboGroupId && pendingGroupIds.has(record.comboGroupId) && topMap[record.comboGroupId] === (record.taskCode || record._id);

    // Determine displayed status text:
    // - Frozen group members: "Frozen"
    // - Top of pending group: show "Pending" (even if underlying status differs)
    // - Otherwise show record.status
    let displayStatusText = record.status;
    if (isFrozenDisplay) displayStatusText = "Frozen";
    else if (isTopInPendingGroup) displayStatusText = "Pending";

    // Determine pill CSS class (use CSS classes rather than inline styles so Records.css controls colors)
    const pillClass =
      isFrozenDisplay
        ? "status-pill status-frozen"
        : String(displayStatusText).toLowerCase() === "pending"
          ? "status-pill status-pending"
          : record.status === "Completed"
            ? "status-pill status-success"
            : "status-pill";

    const showSubmitButton = (() => {
      // Only show submit button on:
      // - Top of pending combo group (isTopInPendingGroup) when canSubmit
      // - Or non-combo/pending items that are allowed (preserve original behavior)
      if (submitted[record.taskCode] && record.status === "Completed") return true;
      if (record.comboGroupId) {
        return isTopInPendingGroup && record.canSubmit;
      }
      if (record.status === "Pending" && (!record.isCombo || record.canSubmit)) {
        return true;
      }
      return false;
    })();

    const isDisabledSubmit = submitting[record.taskCode] || submitted[record.taskCode] || !record.canSubmit;

    // Helper to format date similar to screenshot "DD/MM/YYYY, hh:mm:ss pm"
    const formatLocal = (dstr) => {
      if (!dstr) return "";
      try {
        const d = new Date(dstr);
        if (isNaN(d.getTime())) return dstr;
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
      } catch (e) {
        return dstr;
      }
    };

    // Ensure we show a real creation datetime by falling back to other timestamps if createdAt is missing
    const rawDate =
      record.createdAt ||
      record.startedAt ||
      record.completedAt ||
      record.addedAt ||
      record.updatedAt ||
      null;
    const displayDate = rawDate ? formatLocal(rawDate) : "N/A";

    // Ensure real task/order number is shown: prefer orderNumber, fall back to taskCode or _id
    const orderNumDisplay = record.orderNumber ?? record.taskCode ?? record._id ?? "N/A";

    return (
      <div
        key={getRecordKey(record, i)}
        className="record-card"
      >
        <div className="record-image-wrap">
          <img
            src={getRecordImage(record.product)}
            alt={record.product?.name}
          />
        </div>

        <div className="record-main">
          <div>
            <div className="brand-pill">Brand</div>
            <div className="record-title">{toTitleCase(record.product?.name || "")}</div>
            <div className="record-quantity">Quantity: {record.quantity ?? 1}</div>
          </div>
        </div>

        <div className="record-meta-col">
          <div className="record-meta" aria-hidden="false">
            <div className="meta-row">
              <div className="meta-label">Create Time</div>
              <div className="meta-value">{displayDate}</div>
            </div>

            <div className="meta-row">
              <div className="meta-label">Order Number</div>
              <div className="meta-value">{orderNumDisplay}</div>
            </div>

            <div className="meta-row" style={{ alignItems: "center" }}>
              <div className="meta-label">Status</div>
              <div style={{ minWidth: 90, display: "flex", justifyContent: "flex-end" }}>
                <div
                  className={pillClass}
                  style={{
                    textTransform: "uppercase",
                    fontSize: 12,
                    padding: "6px 12px",
                    borderRadius: 12,
                    fontWeight: 800,
                    display: "inline-block",
                    lineHeight: 1,
                  }}
                >
                  {String(displayStatusText || "").toUpperCase()}
                </div>
              </div>
            </div>

            <div className="totals">
              <div style={{ width: "100%" }}>
                <div className="total-label">Total amount</div>
                <div className="total-value"> {record.product?.price}</div>
              </div>

              <div style={{ width: "100%" }}>
                <div className="total-label">Commission</div>
                <div className="commission-value"> {record.product?.commission ?? "0.00"}</div>
              </div>
            </div>

            {showSubmitButton && (
              <button
                onClick={() => handleSubmit(record)}
                disabled={isDisabledSubmit}
                className="proceed-btn"
                aria-disabled={isDisabledSubmit}
              >
                {submitting[record.taskCode] ? "Submitting..." : (submitted[record.taskCode] ? "Submitted" : "Proceed to Submit")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="records-container" style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <SpinnerOverlay show={showSpinner} />
      <GreyToast show={greyToast.show} message={greyToast.message} />

      <div className="records-centered">
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "#222", paddingBottom: 12 }}>Orders</h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {tabs.map((t) => (
            <div
              key={t}
              role="tab"
              aria-selected={activeTab === t}
              onClick={() => {
                setActiveTab(t);
                if (fetchTaskRecords) fetchTaskRecords().catch(() => {});
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                background: activeTab === t ? "#fff" : "transparent",
                color: activeTab === t ? "#111" : "#6b6b6b",
                border: activeTab === t ? "1px solid #eef2f6" : "1px solid transparent",
                boxShadow: activeTab === t ? "0 6px 18px rgba(0,0,0,0.04)" : "none"
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 6 }}>
          {showSpinner ? (
            <div style={{ height: 120 }} />
          ) : sortedRecords.length === 0 ? (
            <div style={{ padding: 36, background: "#fff", borderRadius: 12 }}>
              <div style={{ color: "#666", textAlign: "center" }}>No orders found</div>
            </div>
          ) : (
            <div className="record-list">
              {sortedRecords.map((record, i) => renderProductRecord(record, i))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Records;
