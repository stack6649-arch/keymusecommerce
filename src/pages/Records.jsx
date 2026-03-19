import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTaskRecords } from "../context/TaskRecordsContext";
import { useBalance } from "../context/balanceContext";
import "./Records.css";

/*
  Records.jsx

  Change implemented (simple heuristic you requested):
  - After building the final sortedRecords list, scan it for consecutive runs of Pending items.
  - For every run of 2 or more consecutive Pending records, mark ONLY the FIRST item of the run as "Frozen".
    The other items in the run remain showing "Pending".
  - All records remain visible under the Pending tab; only the status word/pill for the first item in each
    consecutive Pending run changes to "Frozen".
  - No other logic or behavior was changed.
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
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          border: "6px solid #ddd",
          borderTop: `6px solid ${START_BLUE}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
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

function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function Records() {
  const [activeTab, setActiveTab] = useState("All");
  const { records, fetchTaskRecords, submitTaskRecord } = useTaskRecords();
  const { balance, refreshProfile } = useBalance();
  const navigate = useNavigate();
  const location = useLocation();

  const [displayRecords, setDisplayRecords] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitting, setSubmitting] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [greyToast, setGreyToast] = useState({ show: false, message: "" });

  useEffect(() => {
    if (Array.isArray(records) && records.length > 0) {
      setDisplayRecords(records);
      try {
        localStorage.setItem("taskRecords", JSON.stringify(records));
      } catch (e) {}
    }
  }, [records]);

  useEffect(() => {
    // initial fetch on mount (non-blocking)
    fetchTaskRecords && fetchTaskRecords().catch(() => {});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      if (fetchTaskRecords) fetchTaskRecords().catch(() => {});
    }, 6000);
    return () => clearInterval(iv);
  }, [fetchTaskRecords]);

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
    const key = task.taskCode || task._id;
    setSubmitting((p) => ({ ...p, [key]: true }));
    setSubmitted((p) => ({ ...p, [key]: false }));
    setTimeout(async () => {
      const result = await submitTaskRecord(task.taskCode);
      setSubmitting((p) => ({ ...p, [key]: false }));
      if (!result.success && result.mustDeposit) {
        showGrey("Insufficient Balance.");
        setTimeout(() => navigate("/deposit"), 1600);
        return;
      }
      if (!result.success) {
        alert(result.message || "Failed to submit task.");
      } else {
        setSubmitted((p) => ({ ...p, [key]: true }));
        try {
          await refreshProfile();
        } catch (e) {}
        if (fetchTaskRecords) await fetchTaskRecords();
        setTimeout(() => setSubmitted((p) => ({ ...p, [key]: false })), 1500);
      }
    }, 300);
  };

  // group records by combo key (comboGroupId or orderNumber fallback)
  function groupByCombo(recordsList) {
    const groups = {};
    for (const r of recordsList) {
      const gid = r.comboGroupId ?? r.orderNumber ?? null;
      if (!gid) continue;
      if (!groups[gid]) groups[gid] = [];
      groups[gid].push(r);
    }
    Object.values(groups).forEach((arr) =>
      arr.sort((a, b) => new Date(a.createdAt || a.startedAt || 0) - new Date(b.createdAt || b.startedAt || 0))
    );
    return groups;
  }

  const comboGroupsAll = groupByCombo(displayRecords);

  // which groups have at least one pending member
  const pendingGroupIds = new Set();
  Object.entries(comboGroupsAll).forEach(([g, members]) => {
    if (members.some((m) => String(m.status || "").toLowerCase() === "pending")) pendingGroupIds.add(g);
  });

  // Filter records by tab: Pending tab includes items pending OR part of a pending combo group.
  const filteredRecords = (displayRecords || []).filter((record) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") {
      if (String(record.status || "").toLowerCase() === "pending") return true;
      if ((record.comboGroupId ?? record.orderNumber ?? null) && pendingGroupIds.has(record.comboGroupId ?? record.orderNumber)) return true;
      return false;
    }
    return (record.status && record.status.toLowerCase() === activeTab.toLowerCase());
  });

  // Build initial sortedRecords: bring pending combo groups (group order) first, then the rest by date desc.
  const byDateDesc = (x, y) => new Date(y.startedAt || y.createdAt || 0) - new Date(x.startedAt || x.createdAt || 0);

  const remaining = [...filteredRecords];
  const priorityList = [];

  Array.from(pendingGroupIds).forEach((groupId) => {
    const members = comboGroupsAll[groupId] || [];
    members.forEach((member) => {
      const idx = remaining.findIndex((r) => (r.taskCode || r._id) === (member.taskCode || member._id));
      if (idx !== -1) {
        priorityList.push(remaining[idx]);
        remaining.splice(idx, 1);
      }
    });
  });

  remaining.sort(byDateDesc);
  const sortedRecords = [...priorityList, ...remaining];

  // NEW: compute frozenMap using the simple consecutive-pending heuristic:
  // For each run of consecutive Pending records (in sortedRecords), when run length >= 2,
  // mark ONLY the first record in that run as frozen.
  const frozenMap = {};
  for (let i = 0; i < sortedRecords.length; ) {
    const record = sortedRecords[i];
    const status = String(record.status || "").toLowerCase();
    if (status === "pending") {
      // start a run
      let j = i + 1;
      while (j < sortedRecords.length && String(sortedRecords[j].status || "").toLowerCase() === "pending") {
        j++;
      }
      const runLength = j - i;
      if (runLength >= 2) {
        // mark the first item of the run frozen
        const firstRec = sortedRecords[i];
        const key = firstRec.taskCode || firstRec._id || `idx-${i}`;
        frozenMap[key] = true;
      }
      // advance to end of run
      i = j;
    } else {
      i++;
    }
  }

  const getRecordImage = (product) => {
    if (product && typeof product.image === "string" && product.image.trim() !== "" && product.image !== "null") {
      return product.image;
    }
    return "/assets/images/products/default.png";
  };

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

  function getRecordKey(record, i) {
    if (record.isCombo && typeof record.comboIndex !== "undefined") {
      return `${record.taskCode || record._id || "noid"}-combo-${record.comboIndex}`;
    }
    return record.taskCode || record._id || `idx-${i}`;
  }

  const renderProductRecord = (record, i) => {
    const keyId = record.taskCode || record._id || `idx-${i}`;
    const isFrozenDisplay = !!frozenMap[keyId];

    // Only change status text/pill for frozen items; otherwise leave status as-is
    let displayStatusText = record.status || "";
    if (isFrozenDisplay) displayStatusText = "Frozen";

    const pillClass =
      isFrozenDisplay ? "status-pill status-frozen"
      : String(displayStatusText).toLowerCase() === "pending" ? "status-pill status-pending"
      : String(record.status).toLowerCase() === "completed" ? "status-pill status-success"
      : "status-pill";

    const showSubmitButton = (() => {
      if (submitted[keyId] && String(record.status).toLowerCase() === "completed") return true;
      if (record.comboGroupId) {
        return record.status === "Pending" && record.canSubmit;
      }
      if (String(record.status).toLowerCase() === "pending" && (!record.isCombo || record.canSubmit)) {
        return true;
      }
      return false;
    })();

    const isDisabledSubmit = submitting[keyId] || submitted[keyId] || !record.canSubmit;

    const rawDate = record.createdAt || record.startedAt || record.completedAt || record.addedAt || record.updatedAt || null;
    const displayDate = rawDate ? formatLocal(rawDate) : "N/A";
    const orderNumDisplay = record.orderNumber ?? record.taskCode ?? record._id ?? "N/A";

    return (
      <div key={getRecordKey(record, i)} className="record-card" data-frozen={isFrozenDisplay ? "true" : "false"}>
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
                boxShadow: activeTab === t ? "0 6px 18px rgba(0,0,0,0.04)" : "none",
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
}
