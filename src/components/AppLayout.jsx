import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar/Sidebar";
import "../App.css";

const routeTitles = {
  "/dashboard": "Dashboard",
  "/kasir": "Kasir",
  "/stok-barang": "Stok Barang",
  "/data-member": "Data Member",
  "/laporan": "Laporan",
  "/settings": "Settings",
};

export default function AppLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const pageTitle = title || routeTitles[location.pathname] || "POS";

  return (
    <div className={`layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="content-wrapper">
        <header className="header">
          <button
            className="hamburger-btn"
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={18} />
          </button>
          <h1>{pageTitle}</h1>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
