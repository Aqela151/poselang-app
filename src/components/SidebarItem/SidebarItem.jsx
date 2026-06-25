import { NavLink } from "react-router-dom";
import "./SidebarItem.css";

function SidebarItem({ text, icon, to, isLogout = false, onClick, collapsed }) {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        title={collapsed ? text : undefined}
        className={({ isActive }) =>
          ["sidebar-item", isActive ? "sidebar-item--active" : "", isLogout ? "sidebar-item--logout" : ""]
            .filter(Boolean).join(" ")
        }
      >
        <img src={icon} alt="" className="sidebar-item-icon" draggable={false} />
        {!collapsed && <span className="sidebar-item-text">{text}</span>}
      </NavLink>
    </li>
  );
}

export default SidebarItem;