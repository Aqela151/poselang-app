import "./App.css";
import Card from "./components/Card/Card";
import Button from "./components/Button/Button";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">POS ElangAnugerah</h2>

        <p className="menu-title">MENU</p>

        <ul className="menu">
          <li className="active">Dashboard</li>
          <li>Kasir</li>
          <li>Stok Barang</li>
          <li>Data Member</li>
          <li>Laporan</li>
        </ul>

        <div className="bottom-menu">
          <p>Settings</p>
          <p>Log Out</p>
        </div>
      </aside>

      {/* Content */}
      <main className="content">
        <h1>Dashboard</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <SearchBar />
          <Button text="Tambah Barang" />
        </div>

        <div className="cards">
          <Card
            title="Omset"
            value="Rp 2.000.000"
            description="Total semua cabang"
          />

          <Card
            title="Total Transaksi"
            value="123"
            description="Struk tercetak hari ini"
          />

          <Card
            title="Member Aktif"
            value="234"
            description="+6 Member bulan ini"
          />

          <Card
            title="Stok Kritis"
            value="4 Item"
            description="Perlu restock segera"
          />
        </div>

        <div className="chart">
          Grafik Omset
        </div>

        <div className="bottom-section">
          <div className="table-box">
            Transaksi Terakhir
          </div>

          <div className="stock-box">
            Stok Menipis
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;