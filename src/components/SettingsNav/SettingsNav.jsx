import "./SettingsNav.css";
import {
  Store,
  Percent,
  User,
  Users,
  Bell,
} from "lucide-react";

export default function SettingsNav({
  activeTab,
  setActiveTab,
  tabs,
}) {
  return (
    <div className="settings-nav">
      {tabs.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.key}
            className={`settings-nav-item ${activeTab === item.key ? "active" : ""}`}
            onClick={() => setActiveTab(item.key)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}