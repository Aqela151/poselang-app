import "./Sidebar.css";
import { PanelLeft } from "lucide-react";
import SidebarItem from "../SidebarItem/SidebarItem";
import dashboardIcon from "../../assets/icons/dashboard.png";
import keranjangIcon from "../../assets/icons/keranjang.png";
import barangIcon    from "../../assets/icons/barang.png";
import memberIcon    from "../../assets/icons/member.png";
import laporanIcon   from "../../assets/icons/laporan.png";
import settingsIcon  from "../../assets/icons/settings.png";
import logoutIcon    from "../../assets/icons/logout.png";

const avatarImg = null;

function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
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
        <SidebarItem text="Dashboard"   icon={dashboardIcon} to="/dashboard"  onClick={onClose} collapsed={collapsed} />
        <SidebarItem text="Kasir"       icon={keranjangIcon} to="/kasir"       onClick={onClose} collapsed={collapsed} />
        <SidebarItem text="Stok Barang" icon={barangIcon}    to="/stok-barang" onClick={onClose} collapsed={collapsed} />
        <SidebarItem text="Data Member" icon={memberIcon}    to="/data-member" onClick={onClose} collapsed={collapsed} />
        <SidebarItem text="Laporan"     icon={laporanIcon}   to="/laporan"     onClick={onClose} collapsed={collapsed} />
      </ul>

      <div className="sidebar-spacer" />

      <div className="sidebar-profile">
        {avatarImg
          ? <img src={avatarImg} alt="Avatar" className="sidebar-avatar-img" />
          : <div className="sidebar-avatar-placeholder">A</div>
        }
        {!collapsed && (
          <div className="sidebar-profile-info">
            <p className="sidebar-profile-name">Alex Bizher</p>
            <span className="sidebar-profile-badge">Admin</span>
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