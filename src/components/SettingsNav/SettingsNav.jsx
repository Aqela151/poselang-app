import "./SettingsNav.css";
import {
  Store,
  Percent,
  User,
  Users,
  Bell,
} from "lucide-react";

const menuItems = [
  {
    id: "profil",
    label: "Profil Toko",
    icon: Store,
  },
  {
    id: "pajak",
    label: "Pajak",
    icon: Percent,
  },
  {
    id: "akun",
    label: "Akun Saya",
    icon: User,
  },
  {
    id: "pengguna",
    label: "Pengguna",
    icon: Users,
  },
  {
    id: "notifikasi",
    label: "Notifikasi",
    icon: Bell,
  },
];

export default function SettingsNav({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="settings-nav">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            className={`settings-nav-item ${
              activeTab === item.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}