import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://keymuse-backend.onrender.com";

const ProfileContext = createContext({
  profile: null,
  fetchProfile: async () => null,
  setProfile: () => {},
  isLoading: false,
});

//
// fetchProfileFromServer: fetch with timeout + one retry.
// Accepts token and uses X-Auth-Token or Authorization Bearer header.
//
async function fetchProfileFromServer(token, timeoutMs = 3000, attempt = 1) {
  if (!token) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
      Authorization: `Bearer ${token}`,
    };

    const resp = await fetch(`${API_URL}/api/user-profile`, {
      method: "GET",
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    // clear local auth if server rejects the token
    if (resp.status === 401 || resp.status === 403) {
      try {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("userProfile");
        localStorage.removeItem("currentUser");
        window.dispatchEvent(new Event("auth:logout"));
      } catch (e) {}
      return null;
    }

    if (!resp.ok) {
      throw new Error("Non-OK response: " + resp.status);
    }

    const data = await resp.json();
    if (data && data.success && data.user) return data.user;
    return null;
  } catch (err) {
    clearTimeout(timeout);
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 250));
      return fetchProfileFromServer(token, Math.min(timeoutMs * 1.5, 5000), attempt + 1);
    }
    return null;
  }
}

function readProfileFromStorage() {
  try {
    const raw = localStorage.getItem("userProfile") || localStorage.getItem("currentUser") || localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => {
    try {
      const raw = localStorage.getItem("userProfile") || localStorage.getItem("currentUser");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // persist profile to storage and broadcast update
  const setProfile = (user) => {
    if (!mountedRef.current) return;
    setProfileState(user);
    try {
      if (user) {
        localStorage.setItem("userProfile", JSON.stringify(user));
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.dispatchEvent(new CustomEvent("profile:updated", { detail: user }));
      } else {
        localStorage.removeItem("userProfile");
        localStorage.removeItem("currentUser");
        window.dispatchEvent(new CustomEvent("profile:updated", { detail: null }));
      }
    } catch (e) {
      // ignore storage errors
    }
  };

  // fetchProfile wrapper
  const fetchProfile = async (tokenArg = null, timeoutMs = 3000) => {
    const token = tokenArg || localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      if (mountedRef.current) setProfileState(null);
      return null;
    }
    setIsLoading(true);
    try {
      const user = await fetchProfileFromServer(token, timeoutMs);
      if (user && mountedRef.current) {
        setProfile(user);
      }
      return user;
    } finally {
      setTimeout(() => {
        if (mountedRef.current) setIsLoading(false);
      }, 80);
    }
  };

  // react to external updates (storage events or custom events)
  useEffect(() => {
    function onProfileUpdated(evt) {
      try {
        const payload = evt?.detail;
        if (payload && typeof payload === "object") {
          if (mountedRef.current) setProfileState(payload);
        } else {
          const raw = readProfileFromStorage();
          if (raw && mountedRef.current) setProfileState(raw);
        }
      } catch (_) {}
    }
    function onStorage(e) {
      if (!e) return;
      if (e.key === "userProfile" || e.key === "currentUser") {
        try {
          const raw = e.newValue;
          if (raw) {
            const parsed = JSON.parse(raw);
            if (mountedRef.current) setProfileState(parsed);
          } else {
            if (mountedRef.current) setProfileState(null);
          }
        } catch (_) {}
      }
      if (e.key === "authToken" && !e.newValue) {
        if (mountedRef.current) setProfileState(null);
      }
    }

    window.addEventListener("profile:updated", onProfileUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("profile:updated", onProfileUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // background refresh once on mount to reconcile canonical state
  useEffect(() => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        await fetchProfile(token, 3000);
      } catch (e) {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    profile,
    fetchProfile,
    setProfile,
    isLoading,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  return useContext(ProfileContext);
}

export default ProfileProvider;
