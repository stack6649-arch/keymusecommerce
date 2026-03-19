import React, { createContext, useContext, useState, useEffect } from "react";

const TaskRecordsContext = createContext();

export const TaskRecordsProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const BASE_URL = "https://stacksapp-backend-main.onrender.com";

  // Helper: normalize a fetched record to ensure fields the UI expects exist.
  function normalizeRecord(r) {
    const record = { ...(r || {}) };
    // stable id / task code
    record.taskCode = record.taskCode || record.task_code || record._id || record.id || null;
    // prefer explicit comboGroupId, else fall back to orderNumber (useful if backend didn't set comboGroupId)
    record.comboGroupId = record.comboGroupId ?? record.combo_group_id ?? record.orderNumber ?? record.order_number ?? null;
    // timestamps
    record.createdAt = record.createdAt || record.created_at || record.startedAt || record.started_at || record.addedAt || record.added_at || null;
    record.startedAt = record.startedAt || record.started_at || record.createdAt || null;
    // ensure product object exists
    record.product = record.product || record.item || {};
    // ensure status is a string
    record.status = typeof record.status === "string" ? record.status : (record.state || "");
    // preserve isCombo if backend provides, else we'll compute later
    record.isCombo = !!record.isCombo;
    return record;
  }

  // Fetch records from backend and return the fetched array for callers that await it.
  // Also dispatches a CustomEvent 'taskRecordsUpdated' after updating state so other parts
  // of the app can react immediately if needed.
  const fetchTaskRecords = async () => {
    const token = localStorage.getItem("authToken");
    // If there's no token, clear records and return empty array so callers get a deterministic result.
    if (!token) {
      setRecords([]);
      try {
        window.dispatchEvent(new CustomEvent("taskRecordsUpdated", { detail: [] }));
      } catch (e) {
        // noop
      }
      return [];
    }
    try {
      const res = await fetch(`${BASE_URL}/api/task-records`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      });
      const data = await res.json();
      let incoming = Array.isArray(data && data.records) ? data.records : [];

      // Normalize incoming records to ensure UI-friendly shape
      const normalized = incoming.map(normalizeRecord);

      // Compute combo membership: group by comboGroupId (if present) OR orderNumber fallback
      const groups = {};
      normalized.forEach((rec) => {
        const gid = rec.comboGroupId ?? null;
        if (!gid) return;
        if (!groups[gid]) groups[gid] = [];
        groups[gid].push(rec);
      });

      // Mark isCombo where group length > 1
      Object.values(groups).forEach((arr) => {
        if (arr.length > 1) {
          arr.forEach((r) => {
            r.isCombo = true;
          });
        }
      });

      // Sort each group's members by createdAt ascending so UI logic can pick oldest/newest
      Object.values(groups).forEach((arr) => {
        arr.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return ta - tb;
        });
      });

      const finalRecords = normalized;

      setRecords(finalRecords);
      try {
        window.dispatchEvent(new CustomEvent("taskRecordsUpdated", { detail: finalRecords }));
      } catch (e) {
        // noop
      }
      return finalRecords;
    } catch (err) {
      // On network error, return the current state (do not clear) so callers won't hang.
      return records;
    }
  };

  useEffect(() => {
    // Load initial records on provider mount.
    fetchTaskRecords();
    // eslint-disable-next-line
  }, []);

  // Add a new task record (start task)
  const addTaskRecord = async (taskObj) => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
      const res = await fetch(`${BASE_URL}/api/start-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify({ image: taskObj.image }),
      });
      const data = await res.json();
      if (data && data.success) {
        // Re-fetch records and return the API response
        const refreshed = await fetchTaskRecords();
        if (data.isCombo) {
          return {
            isCombo: true,
            ...data,
            refreshed,
          };
        }
        return { task: data.task, refreshed };
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  // Submit a task by taskCode ONLY!
  const submitTaskRecord = async (taskCode) => {
    const token = localStorage.getItem("authToken");
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await fetch(`${BASE_URL}/api/submit-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify({ taskCode }),
      });
      const data = await res.json();
      if (data && data.success) {
        // Refresh records so UI shows the latest immediately
        await fetchTaskRecords();
        return data;
      }
      return { success: false, message: data?.message, mustDeposit: !!data?.mustDeposit };
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  // Convenience helpers kept for compatibility with existing code
  const hasPendingTask = () =>
    records.some((t) => String(t.status).toLowerCase() === "pending" && !t.isCombo);

  const hasPendingComboTask = () =>
    records.some((t) => String(t.status).toLowerCase() === "pending" && t.isCombo);

  const getPendingTask = () =>
    records.find((t) => String(t.status).toLowerCase() === "pending" && !t.isCombo) || null;

  const getPendingComboTasks = () => {
    // Find first combo that is pending (this logic mirrors the original helper)
    const combo = records.find((t) => String(t.status).toLowerCase() === "pending" && t.isCombo);
    if (!combo || !combo.comboGroupId) return [];
    return records.filter((t) => String(t.status).toLowerCase() === "pending" && t.comboGroupId === combo.comboGroupId);
  };

  return (
    <TaskRecordsContext.Provider
      value={{
        records,
        fetchTaskRecords,
        addTaskRecord,
        submitTaskRecord,
        hasPendingTask,
        hasPendingComboTask,
        getPendingTask,
        getPendingComboTasks,
      }}
    >
      {children}
    </TaskRecordsContext.Provider>
  );
};

export const useTaskRecords = () => useContext(TaskRecordsContext);
