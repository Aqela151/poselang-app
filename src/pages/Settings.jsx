import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";
import SettingsNav from "../components/SettingsNav/SettingsNav";
import { CloudUpload, Check, Camera, Plus, Pencil, Trash2, Store, Receipt, User, Users, Bell } from "lucide-react";

const LOCAL_STORAGE_SETTINGS_KEY = "pos_settings";

const defaultSettings = {
  profil: {
    nama_toko: "",
    telepon: "",
    email: "",
    kota: "",
    alamat: "",
    footer_struk: "",
  },
  pajak: [
    { id: 1, label: "PPN", desc: "Pajak pada semua transaksi", value: 3, enabled: true, hasInput: true },
    { id: 2, label: "Tampilkan Pajak di Struk", desc: "Nominal pajak dicetak terpisah", value: null, enabled: true, hasInput: false },
    { id: 3, label: "Diskon Member Gold", desc: "Potongan otomatis member Gold", value: 5, enabled: true, hasInput: true },
    { id: 4, label: "Diskon Member Platinum", desc: "Potongan otomatis member Platinum", value: 10, enabled: true, hasInput: true },
  ],
  akun: {
    nama_lengkap: "",
    email: "",
  },
  notifikasi: [
    { id: 1, label: "Stok Menipis", desc: "Notifikasi saat stok dibawah minimum", enabled: true },
    { id: 2, label: "Laporan Harian", desc: "Ringkasan penjualan tiap akhir hari", enabled: true },
    { id: 3, label: "Member Baru", desc: "Notifikasi saat ada pendaftar baru", enabled: false },
    { id: 4, label: "Transaksi Dibatalkan", desc: "Notifikasi saat transaksi di cancel", enabled: true },
  ],
};

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );
}

function ProfilToko({ profil, onChange, onSave, saving }) {
  const [logo, setLogo] = useState(null);
  const inputRef = useRef(null);

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Profil Toko</span>
        <button className="settings-save-btn" onClick={onSave} disabled={saving}>
          <Check size={14} />{saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
      <div className="settings-logo-upload" onClick={() => inputRef.current.click()}>
        {/*
          TODO: Upload logo belum tersambung ke backend.
          Saat ini file cuma dipreview lokal (URL.createObjectURL) dan HILANG saat reload,
          karena belum ada endpoint upload file + kolom logo_url di tabel pengaturan_toko.
          Kalau mau ini permanen, perlu:
          1. Endpoint POST /settings/logo (multipart/form-data) di Laravel pakai Storage::disk('public')
          2. Kolom logo_path di tabel pengaturan_toko
          3. Kirim file pakai FormData di sini, bukan cuma createObjectURL
        */}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files[0];
            if (f) setLogo(URL.createObjectURL(f));
          }}
        />
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
          <input
            className="settings-input"
            type="text"
            value={profil.nama_toko}
            onChange={(e) => onChange({ ...profil, nama_toko: e.target.value })}
          />
        </div>
        <div className="settings-form-group">
          <label className="settings-label">No. Telepon</label>
          <input
            className="settings-input"
            type="text"
            value={profil.telepon}
            onChange={(e) => onChange({ ...profil, telepon: e.target.value })}
          />
        </div>
        <div className="settings-form-group">
          <label className="settings-label">Email</label>
          <input
            className="settings-input"
            type="email"
            value={profil.email}
            onChange={(e) => onChange({ ...profil, email: e.target.value })}
          />
        </div>
        <div className="settings-form-group">
          <label className="settings-label">Kota</label>
          <input
            className="settings-input"
            type="text"
            value={profil.kota}
            onChange={(e) => onChange({ ...profil, kota: e.target.value })}
          />
        </div>
      </div>
      <div className="settings-form-group">
        <label className="settings-label">Alamat</label>
        <input
          className="settings-input"
          type="text"
          value={profil.alamat}
          onChange={(e) => onChange({ ...profil, alamat: e.target.value })}
        />
      </div>
      <div className="settings-form-group">
        <label className="settings-label">Footer Struk</label>
        <input
          className="settings-input"
          type="text"
          value={profil.footer_struk}
          onChange={(e) => onChange({ ...profil, footer_struk: e.target.value })}
        />
      </div>
    </div>
  );
}

function Pajak({ pajak, onChange, onSave, saving }) {
  const toggle = (id) => onChange(pajak.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  const setValue = (id, value) => onChange(pajak.map((item) => (item.id === id ? { ...item, value } : item)));

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Pajak & Diskon</span>
        <button className="settings-save-btn" onClick={onSave} disabled={saving}>
          <Check size={14} />{saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
      {pajak.map((item) => (
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
                  value={item.value ?? ""}
                  onChange={(e) => setValue(item.id, Number(e.target.value))}
                />
                <span className="settings-percent-sign">%</span>
              </>
            )}
            <Toggle checked={item.enabled} onChange={() => toggle(item.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AkunSaya({ user, akun, onChange, onSave, saving }) {
  const [photo, setPhoto] = useState(null);
  const inputRef = useRef(null);
  // Prioritaskan nama dari form (akun.nama_lengkap) yang sudah tersinkron dengan
  // AuthContext setelah save berhasil, baru fallback ke data user awal.
  const displayName = akun.nama_lengkap || user?.name || user?.username || user?.email || "Nama User";
  const displayRole = user?.role === "kasir" ? "Kasir" : user?.role === "admin" ? "Admin" : "Pengguna";

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Akun Saya</span>
        <button className="settings-save-btn" onClick={onSave} disabled={saving}>
          <Check size={14} />{saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
      <div className="akun-profile-row">
        <div className="akun-avatar">
          {photo ? <img src={photo} alt="avatar" /> : displayName?.slice(0, 2).toUpperCase()}
        </div>
        <div className="akun-info">
          <span className="akun-name">{displayName}</span>
          <span className="akun-role">{displayRole}</span>
          <button className="akun-ganti-foto-btn" onClick={() => inputRef.current.click()}>
            <Camera size={13} /> Ganti Foto
          </button>
          {/* TODO: sama seperti logo toko, foto profil belum tersambung ke backend */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) setPhoto(URL.createObjectURL(f));
            }}
          />
        </div>
      </div>
      <div className="settings-form-group">
        <label className="settings-label">Nama Lengkap</label>
        <input
          className="settings-input"
          type="text"
          value={akun.nama_lengkap}
          onChange={(e) => onChange({ ...akun, nama_lengkap: e.target.value })}
        />
      </div>
      <div className="settings-form-group">
        <label className="settings-label">Email</label>
        <input
          className="settings-input"
          type="email"
          value={akun.email}
          onChange={(e) => onChange({ ...akun, email: e.target.value })}
        />
      </div>
    </div>
  );
}

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
      <div className="pengguna-table-wrap">
        <table className="pengguna-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Role</th>
              <th className="col-hide-mobile">Cabang</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="pengguna-avatar-cell">
                    <div className="pengguna-avatar">{u.initials}</div>
                    <div className="pengguna-name-group">
                      <span className="pengguna-name">{u.name}</span>
                      <span className="pengguna-cabang-sub">{u.cabang}</span>
                    </div>
                  </div>
                </td>
                <td><span className={`pengguna-badge ${u.role === "Admin" ? "admin" : "kasir"}`}>{u.role}</span></td>
                <td className="col-hide-mobile">{u.cabang}</td>
                <td>
                  <div className="pengguna-actions">
                    <button className="pengguna-action-btn" aria-label="Edit"><Pencil size={12} /></button>
                    {u.deletable && <button className="pengguna-action-btn delete" aria-label="Hapus"><Trash2 size={12} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Notifikasi({ notifikasi, onChange, onSave, saving }) {
  const toggle = (id) => onChange(notifikasi.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-title">Notifikasi</span>
        <button className="settings-save-btn" onClick={onSave} disabled={saving}>
          <Check size={14} />{saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
      {notifikasi.map((item) => (
        <div key={item.id} className="settings-toggle-row">
          <div className="settings-toggle-info">
            <span className="settings-toggle-label">{item.label}</span>
            <span className="settings-toggle-desc">{item.desc}</span>
          </div>
          <Toggle checked={item.enabled} onChange={() => toggle(item.id)} />
        </div>
      ))}
    </div>
  );
}

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState("akun");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const isKasir = user?.role === "kasir";

  const tabs = isKasir
    ? [
        { key: "akun", label: "Akun Saya", icon: User },
        { key: "notifikasi", label: "Notifikasi", icon: Bell },
      ]
    : [
        { key: "profil", label: "Profil Toko", icon: Store },
        { key: "pajak", label: "Pajak", icon: Receipt },
        { key: "akun", label: "Akun Saya", icon: User },
        { key: "pengguna", label: "Pengguna", icon: Users },
        { key: "notifikasi", label: "Notifikasi", icon: Bell },
      ];

  useEffect(() => {
    if (isKasir && activeTab === "profil") {
      setActiveTab("akun");
    }
  }, [isKasir, activeTab]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get("/settings");
        // Controller Laravel kita return langsung { profil, pajak, akun, notifikasi }
        // jadi tidak perlu fallback ke key bahasa Inggris (data.profile / data.account).
        const data = response.data || {};
        setSettings({
          profil: { ...defaultSettings.profil, ...(data.profil || {}) },
          pajak: Array.isArray(data.pajak) && data.pajak.length ? data.pajak : defaultSettings.pajak,
          akun: { ...defaultSettings.akun, ...(data.akun || {}) },
          notifikasi: Array.isArray(data.notifikasi) && data.notifikasi.length ? data.notifikasi : defaultSettings.notifikasi,
        });
        setBackendAvailable(true);
      } catch (error) {
        // Log biar kelihatan di console kalau backend error (404, 401, 500, dst)
        // bukannya diam-diam fallback ke localStorage tanpa jejak.
        console.error("Gagal memuat settings dari backend:", error);
        const saved = window.localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
        if (saved) {
          try {
            setSettings(JSON.parse(saved));
          } catch {
            setSettings(defaultSettings);
          }
        }
        setBackendAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const saveLocalSettings = (value) => {
    window.localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(value));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/settings", settings);
      saveLocalSettings(settings);
      setBackendAvailable(true);

      // Sinkronkan nama/email akun yang baru disimpan ke AuthContext,
      // supaya nama yang tampil di avatar & tempat lain di app langsung update
      // tanpa perlu logout/login ulang.
      updateUser({
        name: settings.akun.nama_lengkap,
        email: settings.akun.email,
      });

      alert("Settings berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan settings ke backend:", error);
      if (error.response?.status === 404) {
        try {
          await api.post("/settings", settings);
          saveLocalSettings(settings);
          setBackendAvailable(true);
          updateUser({
            name: settings.akun.nama_lengkap,
            email: settings.akun.email,
          });
          alert("Settings berhasil disimpan.");
        } catch (err2) {
          console.error("Gagal menyimpan settings (fallback POST):", err2);
          saveLocalSettings(settings);
          setBackendAvailable(false);
          alert("Settings disimpan secara lokal karena backend tidak tersedia.");
        }
      } else {
        saveLocalSettings(settings);
        setBackendAvailable(false);
        alert("Settings disimpan secara lokal karena backend tidak tersedia.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="settings-loading">Memuat pengaturan...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profil":
        return <ProfilToko profil={settings.profil} onChange={(value) => setSettings({ ...settings, profil: value })} onSave={handleSave} saving={saving} />;
      case "pajak":
        return <Pajak pajak={settings.pajak} onChange={(value) => setSettings({ ...settings, pajak: value })} onSave={handleSave} saving={saving} />;
      case "akun":
        return <AkunSaya user={user} akun={settings.akun} onChange={(value) => setSettings({ ...settings, akun: value })} onSave={handleSave} saving={saving} />;
      case "pengguna":
        return <Pengguna />;
      case "notifikasi":
        return <Notifikasi notifikasi={settings.notifikasi} onChange={(value) => setSettings({ ...settings, notifikasi: value })} onSave={handleSave} saving={saving} />;
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <p className="settings-title">Settings</p>
      {!backendAvailable && (
        <div className="settings-warning-box">
          Backend pengaturan tidak tersedia. Perubahan akan disimpan di browser sampai backend pulih.
        </div>
      )}
      {isKasir && (
        <div className="settings-warning-box">
          Pengaturan yang tersedia disesuaikan untuk peran <strong>Kasir</strong>.
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        </aside>
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>

      <nav className="s-bottom-nav">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`s-bottom-nav__item${activeTab === key ? " s-bottom-nav__item--active" : ""}`}
            onClick={() => setActiveTab(key)}
            aria-label={label}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}