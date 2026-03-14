import React, { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = "https://stacksapp-backend-main.onrender.com";

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user-profile`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      });
      const data = await res.json();
      if (data.success && data.user) {
        setProfile(data.user);
      } else {
        setProfile(null);
      }
    } catch (err) {
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
