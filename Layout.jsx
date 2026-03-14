// src/components/Layout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar"; // ✅ import new Sidebar

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Disable hamburger menu on login/register
  const noHamburgerRoutes = ["/login", "/register"];
  const disableMenu = noHamburgerRoutes.includes(location.pathname);

  return (
    <div className="layout-container">
      {/* Header with hamburger toggle */}
      <Header
        disableMenu={disableMenu}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Sidebar (closes on overlay click) */}
      {!disableMenu && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* ✅ Where Dashboard OR Login/Register gets injected */}
      <main className="layout-content">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
