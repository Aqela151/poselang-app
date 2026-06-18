import {
Eye,
Pencil,
Trash2,
Search,
SlidersHorizontal,
ChevronDown,
Plus,
} from "lucide-react";

import Card from "../components/Card/Card";
import "./StokBarang.css";

const products = [
{
name: "GS Astra MF NS40Z",
sub: "Aki kering",
sku: "AK-001",
kategori: "Aki Kering",
eceran: "800.000",
grosir: "500.000",
stok: 42,
status: "aman",
},
{
name: "GS Astra MF NS60",
sub: "Aki kering",
sku: "AK-002",
kategori: "Aki Kering",
eceran: "1.000.000",
grosir: "800.000",
stok: 8,
status: "menipis",
},
{
name: "Incoe50",
sub: "Aki basah",
sku: "AB-0010",
kategori: "Aki Basah",
eceran: "445.000",
grosir: "400.000",
stok: 5,
status: "menipis",
},
{
name: "Yuasa YB5L-B",
sub: "Aki motor",
sku: "AM-0021",
kategori: "Aki Motor",
eceran: "240.000",
grosir: "215.000",
stok: 0,
status: "habis",
},
{
name: "Kabel Terminal (+)",
sub: "Kabel aksesoris",
sku: "KA-003",
kategori: "Kabel Aksesoris",
eceran: "35.000",
grosir: "30.000",
stok: 120,
status: "aman",
},
];

const statusLabel = {
aman: "Aman",
menipis: "Menipis",
habis: "Habis",
};

function StokBarang() {
return ( <div className="stok-container">

  <div className="stats-cards">
    <Card
      title="Total Produk"
      value="248"
      description="Di semua kategori"
    />

    <Card
      title="Stok Produk"
      value="1.842"
      description="+24 dari kemarin"
    />

    <Card
      title="Stok Menipis"
      value="12"
      description="Perlu restock segera"
    />

    <Card
      title="Stok Habis"
      value="5"
      description="Tidak tersedia"
    />
  </div>

  <div className="filter-box">
    <div className="search-wrap">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        placeholder="Cari nama produk, SKU"
      />
    </div>

    <div className="filter-select">
      Semua Kategori
      <ChevronDown size={14} />
    </div>

    <div className="filter-select">
      Semua Stok
      <ChevronDown size={14} />
    </div>

    <button className="filter-btn">
      <SlidersHorizontal size={14} />
      Filter
    </button>

    <button className="add-btn">
      <Plus size={16} />
      Tambah Barang
    </button>
  </div>

  <div className="product-table-card">
    <h3>Daftar Barang</h3>

    <table>
      <thead>
        <tr>
          <th>PRODUK</th>
          <th>SKU</th>
          <th>KATEGORI</th>
          <th>HARGA ECERAN</th>
          <th>HARGA GROSIR</th>
          <th>STOK</th>
          <th>STATUS</th>
          <th>AKSI</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p) => (
          <tr key={p.sku}>
            <td>
              <div className="prod-name">
                {p.name}
              </div>

              <div className="prod-sub">
                {p.sub}
              </div>
            </td>

            <td>{p.sku}</td>
            <td>{p.kategori}</td>
            <td>{p.eceran}</td>
            <td>{p.grosir}</td>

            <td>
              <strong>{p.stok}</strong>
            </td>

            <td>
              <span
                className={`status ${p.status}`}
              >
                {statusLabel[p.status]}
              </span>
            </td>

            <td>
              <div className="aksi-btns">
                <Eye size={16} />
                <Pencil size={16} />
                <Trash2 size={16} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="pagination">
      <span className="pag-info">
        Menampilkan 5 dari 150 produk
      </span>

      <div className="pag-pages">
        <button className="pag-btn arrow">
          ‹
        </button>

        <button className="pag-btn active">
          1
        </button>

        <button className="pag-btn">
          2
        </button>

        <button className="pag-btn">
          3
        </button>

        <span className="pag-dots">
          ...
        </span>

        <button className="pag-btn">
          20
        </button>

        <button className="pag-btn arrow">
          ›
        </button>
      </div>
    </div>
  </div>

</div>

);
}

export default StokBarang;
