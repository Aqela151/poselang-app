import { Pencil, Trash2, Search, ChevronDown, Plus } from "lucide-react";
import Card from "../components/Card/Card";
import "./DataMember.css";

const members = [
  {
    name: "Budi Santoso",
    email: "budi@gmail.com",
    noHp: "081234567890",
    level: "platinum",
    totalTransaksi: "10.000.000",
    bergabung: "Jan 2024",
  },
  {
    name: "Siti Rahayu",
    email: "siti@gmail.com",
    noHp: "081234567890",
    level: "gold",
    totalTransaksi: "8.000.000",
    bergabung: "Mar 2024",
  },
  {
    name: "Edo Pratama",
    email: "edo@gmail.com",
    noHp: "081234567890",
    level: "silver",
    totalTransaksi: "5.000.000",
    bergabung: "Jun 2024",
  },
  {
    name: "Dewi Kusuma",
    email: "dewi@gmail.com",
    noHp: "081234567890",
    level: "platinum",
    totalTransaksi: "12.000.000",
    bergabung: "Nov 2022",
  },
  {
    name: "Rizky Hidayat",
    email: "rizky@gmail.com",
    noHp: "081234567890",
    level: "silver",
    totalTransaksi: "3.000.000",
    bergabung: "Agt 2024",
  },
];

const levelLabel = {
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};



function DataMember() {
  return (
    <div className="member-container">
      <div className="stats-cards">
        <Card title="Total Member" value="234" description="+ 6 bulan ini" />
        <Card title="Silver" value="142" description="60,7% dari total" />
        <Card title="Gold" value="76" description="32,5% dari total" />
        <Card title="Platinum" value="16" description="6,8% dari total" />
      </div>

      <div className="filter-box">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Cari nama member, nomor HP" />
        </div>

        <div className="filter-select">
          Semua Level
          <ChevronDown size={14} />
        </div>

        <div className="filter-select">
          Terbaru
          <ChevronDown size={14} />
        </div>

        <button className="add-btn">
          <Plus size={16} />
          Tambah Member
        </button>
      </div>

      <div className="member-table-card">
        <h3>Daftar Member</h3>

        <table>
          <thead>
            <tr>
              <th>MEMBER</th>
              <th>No.HP</th>
              <th>LEVEL</th>
              <th>TOTAL TRANSAKSI</th>
              <th>BERGABUNG</th>
              <th>AKSI</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m, i) => (
              <tr key={i}>
                <td>
                  <div className="member-name">{m.name}</div>
                  <div className="member-email">{m.email}</div>
                </td>
                <td>{m.noHp}</td>
                <td>
                  <span className={`level-badge ${m.level}`}>
                    {levelLabel[m.level]}
                  </span>
                </td>
                <td>{m.totalTransaksi}</td>
                <td>{m.bergabung}</td>
                <td>
                  <div className="aksi-btns">
                    <Pencil size={16} />
                    <Trash2 size={16} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pag-info">Halaman 1 dari 24</span>

          <div className="pag-pages">
            <button className="pag-btn arrow">‹</button>
            <button className="pag-btn active">1</button>
            <button className="pag-btn">2</button>
            <button className="pag-btn">3</button>
            <button className="pag-btn arrow">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataMember;