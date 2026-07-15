import "./Sidebar.css";
import { PanelLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SidebarItem from "../SidebarItem/SidebarItem";
import dashboardIcon from "../../assets/icons/dashboard.png";
import keranjangIcon from "../../assets/icons/keranjang.png";
import barangIcon    from "../../assets/icons/barang.png";
import memberIcon    from "../../assets/icons/member.png";
import laporanIcon   from "../../assets/icons/laporan.png";
import settingsIcon  from "../../assets/icons/settings.png";
import logoutIcon    from "../../assets/icons/logout.png";

function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { user } = useAuth();
  const displayName = user?.nama || user?.name || user?.username || user?.email || "Pengguna";
  const displayRole = user?.role === "kasir" ? "Kasir" : user?.role === "admin" ? "Admin" : "Pengguna";
  const avatarInitial = displayName?.trim()?.[0]?.toUpperCase() || "P";

  const menuItems = user?.role === "kasir"
    ? [
        { text: "Kasir", icon: keranjangIcon, to: "/kasir" },
        { text: "Settings", icon: settingsIcon, to: "/settings" },
      ]
    : [
        { text: "Dashboard", icon: dashboardIcon, to: "/dashboard" },
        { text: "Kasir", icon: keranjangIcon, to: "/kasir" },
        { text: "Stok Barang", icon: barangIcon, to: "/stok-barang" },
        { text: "Data Member", icon: memberIcon, to: "/data-member" },
        { text: "Laporan", icon: laporanIcon, to: "/laporan" },
      ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebar-logo-bar">
        {!collapsed && <span className="sidebar-logo-name">POS ElangAnugerah</span>}
        <button className="sidebar-logo-btn" aria-label="Toggle" onClick={onToggleCollapse}>
          <PanelLeft size={14} strokeWidth={2} />
        </button>
      </div>

      {!collapsed && <p className="sidebar-section-label">Menu</p>}
      <ul className="sidebar-nav">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.text}
            text={item.text}
            icon={item.icon}
            to={item.to}
            onClick={onClose}
            collapsed={collapsed}
          />
        ))}
      </ul>

      <div className="sidebar-spacer" />

      <div className="sidebar-profile">
        <div className="sidebar-avatar-placeholder">{avatarInitial}</div>
        {!collapsed && (
          <div className="sidebar-profile-info">
            <p className="sidebar-profile-name">{displayName}</p>
            <span className="sidebar-profile-badge">{displayRole}</span>
          </div>
        )}
      </div>

      <div className="sidebar-divider" />
      <ul className="sidebar-bottom">
        <SidebarItem text="Settings" icon={settingsIcon} to="/settings" onClick={onClose} collapsed={collapsed} />
        <SidebarItem text="Log out"  icon={logoutIcon}   to="/logout"   isLogout collapsed={collapsed} />
      </ul>

    </aside>
  );
}

export default Sidebar;