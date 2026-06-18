import { NavLink } from "react-router-dom";
import "./SidebarItem.css";

function SidebarItem({ text, icon, to, isLogout = false, onClick }) {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          ["sidebar-item", isActive ? "sidebar-item--active" : "", isLogout ? "sidebar-item--logout" : ""]
            .filter(Boolean).join(" ")
        }
      >
        <img src={icon} alt="" className="sidebar-item-icon" draggable={false} />
        <span className="sidebar-item-text">{text}</span>
      </NavLink>
    </li>
  );
}

export default SidebarItem;