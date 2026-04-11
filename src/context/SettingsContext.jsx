import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://keymuse-backend.onrender.com";
const STORAGE_KEY = "appSettings";

const SettingsContext = createContext({
  settings: null,
  loading: false,
  error: null,
  refreshSettings: async () => null,
  getServiceLink: (k) => "",
});

function readSettingsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => readSettingsFromStorage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Robust fetch with timeout + one retry
  const fetchSettingsFromServer = useCallback(async (timeoutMs = 3000, attempt = 1) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(`${API_URL}/api/settings`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);
      if (!resp.ok) throw new Error("Non-OK status: " + resp.status);
      const data = await resp.json();
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (attempt < 2) {
        // small backoff and retry once
        await new Promise((r) => setTimeout(r, 250));
        return fetchSettingsFromServer(Math.min(timeoutMs * 1.5, 5000), attempt + 1);
      }
      throw err;
    }
  }, []);

  const applySettings = useCallback((s) => {
    try {
      if (mountedRef.current) setSettings(s || null);
      try {
        if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        else localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore storage errors
      }
      try {
        window.dispatchEvent(new CustomEvent("settings:updated", { detail: s }));
      } catch (e) {}
    } catch (e) {}
  }, []);

  const refreshSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSettingsFromServer();
      // accept both { success: true, ... } or plain settings object depending on backend
      const payload = data && typeof data === "object" && ("success" in data) ? (data.success ? (data.settings || data) : null) : data;
      // if payload has top-level fields like siteName etc., use it directly
      if (payload) applySettings(payload);
      return payload;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [applySettings, fetchSettingsFromServer]);

  // hydrate from storage then fetch in background (non-blocking)
  useEffect(() => {
    (async () => {
      // If we already have cached settings, keep them shown immediately and still try to refresh
      const cached = readSettingsFromStorage();
      if (cached && mountedRef.current) setSettings(cached);
      try {
        await refreshSettings();
      } catch (e) {
        // ignore, error state already set by refreshSettings
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // react to storage events or explicit settings:updated events
  useEffect(() => {
    function onStorage(e) {
      if (!e) return;
      if (e.key === STORAGE_KEY) {
        try {
          const raw = e.newValue;
          if (raw) {
            const parsed = JSON.parse(raw);
            if (mountedRef.current) setSettings(parsed);
          } else {
            if (mountedRef.current) setSettings(null);
          }
        } catch (_) {}
      }
    }
    function onSettingsUpdated(evt) {
      try {
        const payload = evt?.detail;
        if (payload && typeof payload === "object") {
          if (mountedRef.current) setSettings(payload);
        } else if (payload === null) {
          if (mountedRef.current) setSettings(null);
        } else {
          // fallback to storage
          const s = readSettingsFromStorage();
          if (s && mountedRef.current) setSettings(s);
        }
      } catch (_) {}
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("settings:updated", onSettingsUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("settings:updated", onSettingsUpdated);
    };
  }, []);

  // Helper to read service links safely
  const getServiceLink = useCallback((key) => {
    try {
      if (!settings) return "";
      const links = settings.serviceLinks || settings.service || settings.service_links || {};
      return (links && typeof links === "object" && links[key]) ? String(links[key]) : "";
    } catch (e) {
      return "";
    }
  }, [settings]);

  const value = {
    settings,
    loading,
    error,
    refreshSettings,
    getServiceLink,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsProvider;
