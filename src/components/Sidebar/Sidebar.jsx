import "./Sidebar.css";
import SidebarItem from "../SidebarItem/SidebarItem";
import dashboardIcon from "../../assets/icons/dashboard.png";
import keranjangIcon from "../../assets/icons/keranjang.png";
import barangIcon    from "../../assets/icons/barang.png";
import memberIcon    from "../../assets/icons/member.png";
import laporanIcon   from "../../assets/icons/laporan.png";
import settingsIcon  from "../../assets/icons/settings.png";
import logoutIcon    from "../../assets/icons/logout.png";

const avatarImg = null;

function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>

      {/* ── Logo ── */}
      <div className="sidebar-logo-bar">
        <span className="sidebar-logo-name">POS ElangAnugerah</span>
        <button className="sidebar-logo-btn" aria-label="Toggle" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="18" rx="1"/>
            <rect x="14" y="3" width="7" height="18" rx="1"/>
          </svg>
        </button>
      </div>

      {/* ── Menu utama ── */}
      <p className="sidebar-section-label">Menu</p>
      <ul className="sidebar-nav">
        <SidebarItem text="Dashboard"   icon={dashboardIcon} to="/dashboard"  onClick={onClose} />
        <SidebarItem text="Kasir"       icon={keranjangIcon} to="/kasir"       onClick={onClose} />
        <SidebarItem text="Stok Barang" icon={barangIcon}    to="/stok-barang" onClick={onClose} />
        <SidebarItem text="Data Member" icon={memberIcon}    to="/data-member" onClick={onClose} />
        <SidebarItem text="Laporan"     icon={laporanIcon}   to="/laporan"     onClick={onClose} />
      </ul>

      <div className="sidebar-spacer" />

      <div className="sidebar-profile">
        {avatarImg
          ? <img src={avatarImg} alt="Avatar" className="sidebar-avatar-img" />
          : <div className="sidebar-avatar-placeholder">A</div>
        }
        <div className="sidebar-profile-info">
          <p className="sidebar-profile-name">Alex Bizher</p>
          <span className="sidebar-profile-badge">Admin</span>
        </div>
      </div>

      <div className="sidebar-divider" />
      <ul className="sidebar-bottom">
        <SidebarItem text="Settings" icon={settingsIcon} to="/settings" onClick={onClose} />
        <SidebarItem text="Log out"  icon={logoutIcon}   to="/logout"   isLogout />
      </ul>

    </aside>
  );
}

export default Sidebar;