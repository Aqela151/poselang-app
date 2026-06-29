import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Search, SlidersHorizontal, ChevronDown, Plus } from "lucide-react";
import Card from "../components/Card/Card";
import TambahBarangModal from "../components/TambahBarangModal/TambahBarangModal";
import EditBarangModal from "../components/EditBarangModal/EditBarangModal";
import DeleteBarangModal from "../components/DeleteBarangModal/DeleteBarangModal";
import ViewBarangModal from "../components/ViewBarangModal/ViewBarangModal";
import "./StokBarang.css";
import api from "../services/api";

const statusLabel = { aman: "Aman", menipis: "Menipis", habis: "Habis" };

function StokBarang() {
  const [products, setProducts] = useState([]);
  const [tambahOpen, setTambahOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);

  useEffect(() => {
  getProduk();
}, []);

const getProduk = async () => {
  try {
    const res = await api.get("/produk");
    setProducts(res.data);
  } catch (err) {
    console.log(err);
  }
};

  const handleView = (barang) => {
    setSelectedBarang(barang);
    setViewOpen(true);
  };

  const handleEdit = (barang) => {
    setSelectedBarang(barang);
    setEditOpen(true);
  };

  const handleDelete = (barang) => {
    setSelectedBarang(barang);
    setDeleteOpen(true);
  };

  const handleSaveEdit = (updated) => {
  setProducts((prev) =>
    prev.map((p) => (p.id === updated.id ? updated : p))
  );
};

  const handleConfirmDelete = (target) => {
  setProducts((prev) => prev.filter((p) => p.id !== target.id));
};

  return (
    <div className="stok-container">
      <div className="stats-cards">
        <Card title="Total Produk" value="248" description="Di semua kategori" />
        <Card title="Stok Produk" value="1.842" description="+24 dari kemarin" />
        <Card title="Stok Menipis" value="12" description="Perlu restock segera" />
        <Card title="Stok Habis" value="5" description="Tidak tersedia" />
      </div>

      <div className="filter-box">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Cari nama produk, SKU" />
        </div>
        <div className="filter-select">
          Semua Kategori <ChevronDown size={14} />
        </div>
        <div className="filter-select">
          Semua Stok <ChevronDown size={14} />
        </div>
        <button className="filter-btn">
          <SlidersHorizontal size={14} />
          Filter
        </button>
        <button className="add-btn" onClick={() => setTambahOpen(true)}>
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
              <tr key={p.id}>
                <td>
  <div className="prod-name">{p.nama_produk}</div>
  <div className="prod-sub">{p.kode_produk}</div>
</td>
                <td>{p.kode_produk}</td>
<td>{p.kode_produk}</td>
<td>{p.kategori_id}</td>
<td>Rp {Number(p.harga_eceran).toLocaleString("id-ID")}</td>
<td>Rp {Number(p.harga_grosir).toLocaleString("id-ID")}</td>
<td>{p.stok}</td>
                <td>
  {p.stok == 0 ? (
    <span className="status habis">Habis</span>
  ) : p.stok < 10 ? (
    <span className="status menipis">Menipis</span>
  ) : (
    <span className="status aman">Aman</span>
  )}

                </td>
                <td>
                  <div className="aksi-btns">
                    <Eye size={16} onClick={() => handleView(p)} />
                    <Pencil size={16} onClick={() => handleEdit(p)} />
                    <Trash2 size={16} onClick={() => handleDelete(p)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pag-info">Menampilkan 5 dari 150 produk</span>
          <div className="pag-pages">
            <button className="pag-btn arrow">‹</button>
            <button className="pag-btn active">1</button>
            <button className="pag-btn">2</button>
            <button className="pag-btn">3</button>
            <span className="pag-dots">...</span>
            <button className="pag-btn">20</button>
            <button className="pag-btn arrow">›</button>
          </div>
        </div>
      </div>

      <TambahBarangModal isOpen={tambahOpen} onClose={() => setTambahOpen(false)} />
      <EditBarangModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        barang={selectedBarang}
        onSave={handleSaveEdit}
      />
      <DeleteBarangModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        barang={selectedBarang}
        onConfirm={handleConfirmDelete}
      />
      <ViewBarangModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        barang={selectedBarang}
      />
    </div>
  );
}

export default StokBarang;