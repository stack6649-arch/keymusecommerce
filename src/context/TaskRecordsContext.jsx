import React, { createContext, useContext, useState, useEffect } from "react";

const TaskRecordsContext = createContext();

export const TaskRecordsProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const BASE_URL = "https://stacksapp-backend-main.onrender.com";

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
      if (data && data.success && Array.isArray(data.records)) {
        setRecords(data.records);
        try {
          window.dispatchEvent(new CustomEvent("taskRecordsUpdated", { detail: data.records }));
        } catch (e) {
          // noop
        }
        return data.records;
      } else {
        // If API responded but no records array, ensure state is set to the returned records if any,
        // or an empty array to avoid leaving stale data.
        const safeRecords = (data && Array.isArray(data.records)) ? data.records : [];
        setRecords(safeRecords);
        try {
          window.dispatchEvent(new CustomEvent("taskRecordsUpdated", { detail: safeRecords }));
        } catch (e) {
          // noop
        }
        return safeRecords;
      }
    } catch (err) {
      // On network error, do not modify records (to avoid flashing empty UI),
      // but return the current state so callers don't hang.
      return records;
    }
  };

  useEffect(() => {
    // Load initial records on provider mount. We don't await here because useEffect cannot be async directly,
    // but fetchTaskRecords will update state once the fetch completes. Components that need immediate data
    // should call fetchTaskRecords themselves (the Records page does this).
    fetchTaskRecords();
    // eslint-disable-next-line
  }, []);

  // Add a new task record (start task)
  // Supports both normal and combo (API will determine which is triggered)
  // Returns: for combo, { isCombo: true, task, ... }; for normal, { task }
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
        body: JSON.stringify({ image: taskObj.image }), // For combo, only image is used as hint
      });
      const data = await res.json();
      if (data && data.success) {
        // Re-fetch records and return the API response
        await fetchTaskRecords();
        if (data.isCombo) {
          return {
            isCombo: true,
            ...data,
          };
        }
        return { task: data.task };
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
    const combo = records.find((t) => String(t.status).toLowerCase() === "pending" && t.isCombo);
    if (!combo || !combo.comboGroupId) return [];
    return records.filter((t) => String(t.status).toLowerCase() === "pending" && t.comboGroupId === combo.comboGroupId);
  };

  return (
    <TaskRecordsContext.Provider
      value={{
        records,
        fetchTaskRecords, // prefer this name; Records.jsx will call and await it
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
