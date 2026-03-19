import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTaskRecords } from "../context/TaskRecordsContext";
import { useBalance } from "../context/balanceContext";
import "./Records.css";

import homeIcon from "../assets/images/tabBar/homeh.png";
import startingIcon from "../assets/images/tabBar/icon30.png";
import recordsIcon from "../assets/images/tabBar/records.png";

/*
  Records.jsx

  Behavior implemented (updated per your request):
  - Groups records by comboGroupId.
  - For any combo group that contains at least one Pending item, the group is considered a "pending group".
  - For pending groups with 2+ members:
      * The last member by createdAt (newest) is the "top" submit candidate: it shows the yellow PENDING pill and (when allowed) the submit button.
      * All other members of the same group are shown immediately after the top item and display the red FROZEN pill (no submit button).
  - Completed items show a green pill.
  - No inline styles override the pill color; CSS classes are used so Records.css controls colors.
  - All other app logic/flows preserved.
*/

const tabs = ["All", "Pending", "Completed"];

const START_BLUE = "#1fb6fc";

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
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
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

  // displayRecords seeded from context or localStorage
  const [displayRecords, setDisplayRecords] = useState(() => {
    try {
      const cached = localStorage.getItem("taskRecords");
      if (cached) return JSON.parse(cached);
    } catch (e) { /* ignore */ }
    return records || [];
  });

  const [showSpinner, setShowSpinner] = useState(false);
  const [submitting, setSubmitting] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [greyToast, setGreyToast] = useState({ show: false, message: "" });

  useEffect(() => {
    if (Array.isArray(records) && records.length > 0) {
      setDisplayRecords(records);
      try { localStorage.setItem("taskRecords", JSON.stringify(records)); } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

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

  // initial background refresh (spinner capped)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hasCached = Array.isArray(displayRecords) && displayRecords.length > 0;
      if (!hasCached) setShowSpinner(true);

      const MAX_VISIBLE_MS = 2000;
      const start = Date.now();

      try {
        if (fetchTaskRecords) {
          const fetchPromise = fetchTaskRecords();
          const race = Promise.race([
            fetchPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), MAX_VISIBLE_MS))
          ]);
          try { await race; } catch (e) { /* ignore */ }
        }
      } finally {
        const elapsed = Date.now() - start;
        const remain = Math.max(0, MAX_VISIBLE_MS - elapsed);
        await sleep(remain);
        if (!cancelled) setShowSpinner(false);
      }
    })();

    return () => { cancelled = true; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (location.pathname !== "/records") return;
      try {
        if (fetchTaskRecords) await fetchTaskRecords();
      } catch (e) {}
      if (mounted) {}
    })();
    return () => { mounted = false; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (fetchTaskRecords) fetchTaskRecords().catch(() => {});
    }, 6000);
    return () => clearInterval(iv);
  }, [fetchTaskRecords]);

  // Group records by comboGroupId and sort each group ascending by createdAt (oldest -> newest)
  function groupByCombo(recordsList) {
    const groups = {};
    for (const rec of recordsList) {
      const gid = rec.comboGroupId;
      if (!gid) continue;
      if (!groups[gid]) groups[gid] = [];
      groups[gid].push(rec);
    }
    Object.values(groups).forEach(arr =>
      arr.sort((a, b) => new Date(a.createdAt || a.startedAt || 0) - new Date(b.createdAt || b.startedAt || 0))
    );
    return groups;
  }

  const comboGroupsAll = groupByCombo(displayRecords);

  // pendingGroupIds: groups that contain at least one Pending member
  const pendingGroupIds = new Set();
  Object.entries(comboGroupsAll).forEach(([groupId, members]) => {
    const hasPending = members.some(m => String(m.status || "").toLowerCase() === "pending");
    if (hasPending) pendingGroupIds.add(groupId);
  });

  // Filter records by tab. For Pending tab include items that are pending OR belong to a pending combo group.
  const filteredRecords = (displayRecords || []).filter((record) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") {
      if (String(record.status || "").toLowerCase() === "pending") return true;
      if (record.comboGroupId && pendingGroupIds.has(record.comboGroupId)) return true;
      return false;
    }
    return (record.status && record.status.toLowerCase() === activeTab.toLowerCase());
  });

  // Build frozenMap and topMap:
  // For pending groups with >=2 members, the LAST member (newest) is top (submit candidate),
  // and all other members are marked frozen.
  const frozenMap = {};
  const topMap = {};
  Object.entries(comboGroupsAll).forEach(([groupId, members]) => {
    if (!pendingGroupIds.has(groupId)) return;
    if (!members || members.length < 2) return;
    const lastIdx = members.length - 1;
    const topRec = members[lastIdx];
    const topKey = topRec && (topRec.taskCode || topRec._id);
    if (topKey) topMap[groupId] = topKey;
    for (let idx = 0; idx < members.length; idx++) {
      if (idx === lastIdx) continue; // skip the top (last) item
      const rec = members[idx];
      const key = rec && (rec.taskCode || rec._id);
      if (key) frozenMap[key] = true;
    }
  });

  const byDateDesc = (x, y) => new Date(y.startedAt || y.createdAt || 0) - new Date(x.startedAt || x.createdAt || 0);

  // Build sortedRecords so each pending group appears with LAST (top) first, then the frozen members,
  // then the rest of records sorted by date desc.
  const remaining = [...filteredRecords];
  const priorityList = [];

  Array.from(pendingGroupIds).forEach((groupId) => {
    const members = comboGroupsAll[groupId] || [];
    if (!members || members.length === 0) return;
    const lastIdx = members.length - 1;
    // push the last (top submit candidate) first if present in remaining
    const topMember = members[lastIdx];
    if (topMember) {
      const idx = remaining.findIndex((r) => (r.taskCode || r._id) === (topMember.taskCode || topMember._id));
      if (idx !== -1) {
        priorityList.push(remaining[idx]);
        remaining.splice(idx, 1);
      }
    }
    // then push the other members (frozen) in ascending order (oldest -> newest), excluding the top already pushed
    for (let j = 0; j < members.length; j++) {
      if (j === lastIdx) continue;
      const mem = members[j];
      const idx2 = remaining.findIndex((r) => (r.taskCode || r._id) === (mem.taskCode || mem._id));
      if (idx2 !== -1) {
        priorityList.push(remaining[idx2]);
        remaining.splice(idx2, 1);
      }
    }
  });

  remaining.sort(byDateDesc);
  const sortedRecords = [...priorityList, ...remaining];

  const getRecordImage = (product) => {
    if (product && typeof product.image === "string" && product.image.trim() !== "" && product.image !== "null") {
      return product.image;
    }
    return "/assets/images/products/default.png";
  };

  const showGrey = (message, duration = 1600) => {
    setGreyToast({ show: true, message });
    setTimeout(() => setGreyToast({ show: false, message: "" }), duration);
  };

  const handleSubmit = async (task) => {
    if (task.isCombo && task.canSubmit && balance < 0) {
      showGrey("Insufficient Balance.");
      setTimeout(() => navigate("/deposit"), 1600);
      return;
    }
    const keyId = task.taskCode || task._id;
    setSubmitting(prev => ({ ...prev, [keyId]: true }));
    setSubmitted(prev => ({ ...prev, [keyId]: false }));
    setTimeout(async () => {
      const result = await submitTaskRecord(task.taskCode);
      setSubmitting(prev => ({ ...prev, [keyId]: false }));
      if (!result.success && result.mustDeposit) {
        showGrey("Insufficient Balance.");
        setTimeout(() => navigate("/deposit"), 1600);
        return;
      }
      if (!result.success) {
        alert(result.message || "Failed to submit task.");
      } else {
        setSubmitted(prev => ({ ...prev, [keyId]: true }));
        try { await refreshProfile(); } catch (e) {}
        if (fetchTaskRecords) await fetchTaskRecords();
        setTimeout(() => setSubmitted(prev => ({ ...prev, [keyId]: false })), 1500);
      }
    }, 300);
  };

  const renderProductRecord = (record, i) => {
    const keyId = record.taskCode || record._id || `idx-${i}`;
    const isFrozenDisplay = !!frozenMap[keyId];
    const isTopInPendingGroup = !!(record.comboGroupId && pendingGroupIds.has(record.comboGroupId) && topMap[record.comboGroupId] === keyId);

    let displayStatusText = record.status || "";
    if (isFrozenDisplay) displayStatusText = "Frozen";
    else if (isTopInPendingGroup) displayStatusText = "Pending";

    const pillClass =
      isFrozenDisplay ? "status-pill status-frozen"
      : String(displayStatusText).toLowerCase() === "pending" ? "status-pill status-pending"
      : String(record.status).toLowerCase() === "completed" ? "status-pill status-success"
      : "status-pill";

    const showSubmitButton = (() => {
      if (submitted[keyId] && String(record.status).toLowerCase() === "completed") return true;
      if (record.comboGroupId) {
        return isTopInPendingGroup && record.canSubmit;
      }
      if (String(record.status).toLowerCase() === "pending" && (!record.isCombo || record.canSubmit)) {
        return true;
      }
      return false;
    })();

    const isDisabledSubmit = submitting[keyId] || submitted[keyId] || !record.canSubmit;

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

    const rawDate = record.createdAt || record.startedAt || record.completedAt || record.addedAt || record.updatedAt || null;
    const displayDate = rawDate ? formatLocal(rawDate) : "N/A";
    const orderNumDisplay = record.orderNumber ?? record.taskCode ?? record._id ?? "N/A";

    return (
      <div key={getRecordKey(record, i)} className="record-card" data-frozen={isFrozenDisplay ? "true" : "false"} data-top={isTopInPendingGroup ? "true" : "false"}>
        <div className="record-image-wrap">
          <img src={getRecordImage(record.product)} alt={record.product?.name} />
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
                <div className={pillClass} style={{ textTransform: "uppercase", fontSize: 12, padding: "6px 12px", borderRadius: 12, fontWeight: 800, display: "inline-block", lineHeight: 1 }}>
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
              <button onClick={() => handleSubmit(record)} disabled={isDisabledSubmit} className="proceed-btn" aria-disabled={isDisabledSubmit}>
                {submitting[keyId] ? "Submitting..." : (submitted[keyId] ? "Submitted" : "Proceed to Submit")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // helper to create stable key
  function getRecordKey(record, i) {
    if (record.isCombo && typeof record.comboIndex !== "undefined") {
      return `${record.taskCode || record._id || "noid"}-combo-${record.comboIndex}`;
    }
    return record.taskCode || record._id || `idx-${i}`;
  }

  return (
    <div className="records-container" style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

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
