import React, { createContext, useContext, useState, useEffect } from "react";

const TaskRecordsContext = createContext();

export const TaskRecordsProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const BASE_URL = "https://keymuse-backend.onrender.com";

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

    // Preserve server-provided frozen flag if present (boolean), else leave undefined for client fallback
    if (record.product && typeof record.product.frozen === "boolean") {
      record.product.frozen = record.product.frozen;
    }

    // Preserve server-provided canSubmit if present; otherwise fallback to undefined (client will compute)
    if (typeof record.canSubmit !== "undefined") {
      record.canSubmit = !!record.canSubmit;
    }

    return record;
  }

  const fetchTaskRecords = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setRecords([]);
      try {
        window.dispatchEvent(new CustomEvent("taskRecordsUpdated", { detail: [] }));
      } catch (e) {}
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

      // If server provided product.frozen but not canSubmit, set canSubmit accordingly
      const finalRecords = normalized.map((rec) => {
        if (rec.product && typeof rec.product.frozen === "boolean" && typeof rec.canSubmit === "undefined") {
          rec.canSubmit = !rec.product.frozen;
        }
        return rec;
      });

      setRecords(finalRecords);
      try {
        window.dispatchEvent(new CustomEvent("taskRecordsUpdated", { detail: finalRecords }));
      } catch (e) {}
      return finalRecords;
    } catch (err) {
      return records;
    }
  };

  useEffect(() => {
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

  // Submit a task by taskCode.
  // Accept optional comboIndex for combo per-product submission (pass undefined for non-combo submits).
  const submitTaskRecord = async (taskCode, comboIndex) => {
    const token = localStorage.getItem("authToken");
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const body = typeof comboIndex === "number" ? { taskCode, comboIndex } : { taskCode };
      const res = await fetch(`${BASE_URL}/api/submit-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data && data.success) {
        await fetchTaskRecords();
        return data;
      }
      return { success: false, message: data?.message, mustDeposit: !!data?.mustDeposit, code: data?.code };
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  const hasPendingTask = () =>
    records.some((t) => String(t.status).toLowerCase() === "pending" && !t.isCombo);

  const hasPendingComboTask = () =>
    records.some((t) => String(t.status).toLowerCase() === "pending" && t.isCombo);

  const getPendingTask = () =>
    records.find((t) => String(t.status).toLowerCase() === "pending" && !t.isCombo) || null;

  const getPendingComboTasks = () => {
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
