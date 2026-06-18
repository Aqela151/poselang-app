import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Kasir from "./pages/Kasir";
import StokBarang from "./pages/StokBarang";
import DataMember from "./pages/DataMember";
import Laporan from "./pages/Laporan";
import Settings from "./pages/Settings";

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = {
    "/dashboard": "Dashboard",
    "/kasir": "Kasir",
    "/stok-barang": "Stok Barang",
    "/data-member": "Data Member",
    "/laporan": "Laporan",
    "/settings": "Settings",
  };

  return (
    <div className="layout">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="content-wrapper">
        <header className="header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h1>{pageTitle[location.pathname] || "Dashboard"}</h1>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/kasir" element={<Kasir />} />
          <Route path="/stok-barang" element={<StokBarang />} />
          <Route path="/data-member" element={<DataMember />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;