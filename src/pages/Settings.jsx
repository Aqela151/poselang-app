import { useState, useRef } from "react";
import "./Settings.css";
import SettingsNav from "../components/SettingsNav/SettingsNav";
import { CloudUpload, Check, Camera, Plus, Pencil, Trash2 } from "lucide-react";

/* ── Toggle component ── */
function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );
}

/* ── Profil Toko ── */
function ProfilToko() {
  const [logo, setLogo] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(URL.createObjectURL(file));
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Profil Toko</span>
        <button className="settings-save-btn"><Check size={14} />Simpan</button>
      </div>

      <div className="settings-logo-upload" onClick={() => inputRef.current.click()}>
        <input ref={inputRef} type="file" accept="image/png,image/jpeg" style={{ display: "none" }} onChange={handleUpload} />
        {logo ? (
          <img src={logo} alt="Logo" className="settings-logo-preview" />
        ) : (
          <>
            <CloudUpload size={26} color="#ccc" />
            <span className="settings-logo-label">Klik untuk ganti logo</span>
            <span className="settings-logo-hint">PNG, JPG, maks 2MB</span>
          </>
        )}
      </div>

      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label className="settings-label">Nama Toko</label>
          <input className="settings-input" type="text" />
        </div>
        <div className="settings-form-group">
          <label className="settings-label">No. Telepon</label>
          <input className="settings-input" type="text" />
        </div>
        <div className="settings-form-group">
          <label className="settings-label">Email</label>
          <input className="settings-input" type="email" />
        </div>
        <div className="settings-form-group">
          <label className="settings-label">Kota</label>
          <input className="settings-input" type="text" />
        </div>
      </div>

      <div className="settings-form-group">
        <label className="settings-label">Alamat</label>
        <input className="settings-input" type="text" />
      </div>
      <div className="settings-form-group">
        <label className="settings-label">Footer Struk</label>
        <input className="settings-input" type="text" />
      </div>
    </div>
  );
}

/* ── Pajak ── */
function Pajak() {
  const [items, setItems] = useState([
    { id: 1, label: "PPN", desc: "Pajak pada semua transaksi", value: 3, enabled: true, hasInput: true },
    { id: 2, label: "Tampilkan Pajak di Struk", desc: "Nominal pajak dicetak terpisah", value: null, enabled: true, hasInput: false },
    { id: 3, label: "Diskon Member Gold", desc: "Potongan otomatis member Gold", value: 5, enabled: true, hasInput: true },
    { id: 4, label: "Diskon Member Platinum", desc: "Potongan otomatis member Platinum", value: 10, enabled: true, hasInput: true },
  ]);

  const toggle = (id) => setItems(items.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  const setValue = (id, val) => setItems(items.map(i => i.id === id ? { ...i, value: val } : i));

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Pajak & Diskon</span>
        <button className="settings-save-btn"><Check size={14} />Simpan</button>
      </div>
      <div>
        {items.map(item => (
          <div key={item.id} className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">{item.label}</span>
              <span className="settings-toggle-desc">{item.desc}</span>
            </div>
            <div className="settings-toggle-right">
              {item.hasInput && (
                <>
                  <input
                    className="settings-percent-input"
                    type="number"
                    value={item.value}
                    onChange={e => setValue(item.id, e.target.value)}
                  />
                  <span className="settings-percent-sign">%</span>
                </>
              )}
              <Toggle checked={item.enabled} onChange={() => toggle(item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Akun Saya ── */
function AkunSaya() {
  const [photo, setPhoto] = useState(null);
  const inputRef = useRef(null);

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Akun Saya</span>
        <button className="settings-save-btn"><Check size={14} />Simpan</button>
      </div>

      <div className="akun-profile-row">
        <div className="akun-avatar">
          {photo ? <img src={photo} alt="avatar" /> : "AB"}
        </div>
        <div className="akun-info">
          <span className="akun-name">Alex Bizher</span>
          <span className="akun-role">Administrator</span>
          <button className="akun-ganti-foto-btn" onClick={() => inputRef.current.click()}>
            <Camera size={13} /> Ganti Foto
          </button>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files[0]; if (f) setPhoto(URL.createObjectURL(f)); }} />
        </div>
      </div>

      <div className="settings-form-group">
        <label className="settings-label">Nama Lengkap</label>
        <input className="settings-input" type="text" />
      </div>
      <div className="settings-form-group">
        <label className="settings-label">Email</label>
        <input className="settings-input" type="email" />
      </div>
    </div>
  );
}

/* ── Pengguna ── */
function Pengguna() {
  const [users] = useState([
    { id: 1, initials: "AB", name: "Alex Bizher", role: "Admin", cabang: "Semua", deletable: false },
    { id: 2, initials: "AN", name: "Aqela Nisa", role: "Kasir", cabang: "Blimbing", deletable: true },
    { id: 3, initials: "SR", name: "Sri Rahayu", role: "Kasir", cabang: "Kepanjen", deletable: true },
  ]);

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Pengguna</span>
        <button className="settings-save-btn"><Plus size={14} />Tambah</button>
      </div>

      <table className="pengguna-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Role</th>
            <th>Cabang</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <div className="pengguna-avatar-cell">
                  <div className="pengguna-avatar">{u.initials}</div>
                  {u.name}
                </div>
              </td>
              <td><span className="pengguna-badge">{u.role}</span></td>
              <td>{u.cabang}</td>
              <td>
                <button className="pengguna-action-btn"><Pencil size={12} /></button>
                {u.deletable && <button className="pengguna-action-btn delete"><Trash2 size={12} /></button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Notifikasi ── */
function Notifikasi() {
  const [items, setItems] = useState([
    { id: 1, label: "Stok Menipis", desc: "Notifikasi saat stok dibawah minimum", enabled: true },
    { id: 2, label: "Laporan Harian", desc: "Ringkasan penjualan tiap akhir hari", enabled: true },
    { id: 3, label: "Member Baru", desc: "Notifikasi saat ada pendaftar baru", enabled: false },
    { id: 4, label: "Transaksi Dibatalkan", desc: "Notifikasi saat transaksi di cancel", enabled: true },
  ]);

  const toggle = (id) => setItems(items.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Notifikasi</span>
        <button className="settings-save-btn"><Check size={14} />Simpan</button>
      </div>
      <div>
        {items.map(item => (
          <div key={item.id} className="settings-toggle-row">
            <div className="settings-toggle-info">
              <span className="settings-toggle-label">{item.label}</span>
              <span className="settings-toggle-desc">{item.desc}</span>
            </div>
            <Toggle checked={item.enabled} onChange={() => toggle(item.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Settings() {
  const [activeTab, setActiveTab] = useState("profil");

  const renderContent = () => {
    switch (activeTab) {
      case "profil": return <ProfilToko />;
      case "pajak": return <Pajak />;
      case "akun": return <AkunSaya />;
      case "pengguna": return <Pengguna />;
      case "notifikasi": return <Notifikasi />;
      default: return null;
    }
  };

  return (
    <div className="settings-page">
      <p className="settings-title">Settings</p>
      <div className="settings-layout">
        <div className="settings-sidebar">
          <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}