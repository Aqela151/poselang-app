import { useState, useEffect } from "react";
import api from "../services/api";
import { Pencil, Trash2, Search, ChevronDown, Plus } from "lucide-react";
import Card from "../components/Card/Card";
import TambahSupplierModal from "../components/TambahSupplierModal/TambahSupplierModal";
import EditSupplierModal from "../components/EditSupplierModal/EditSupplierModal";
import DeleteSupplierModal from "../components/DeleteSupplierModal/DeleteSupplierModal";
import "./DataSupplier.css";

function DataSupplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [tambahOpen, setTambahOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
  getSupplier();
}, []);

const getSupplier = async () => {
  try {
    const res = await api.get("/supplier");
    setSuppliers(res.data);
  } catch (err) {
    console.log(err);
  }
};

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setEditOpen(true);
  };

  const handleDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteOpen(true);
  };

  const handleSaveEdit = (updated) => {
  setSuppliers((prev) =>
    prev.map((s) => (s.id === updated.id ? updated : s))
  );
};

  const handleConfirmDelete = async (target) => {
  try {
    await api.delete(`/supplier/${target.id}`);

    setSuppliers((prev) =>
      prev.filter((s) => s.id !== target.id)
    );

    alert("Supplier berhasil dihapus");
  } catch (err) {
    console.log(err);
    alert("Gagal menghapus supplier");
  }
};

  const filteredSuppliers = suppliers.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      (s.nama || "").toLowerCase().includes(q) ||
        (s.telepon || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="member-container">
      <div className="stats-cards">
        <Card
  title="Total Supplier"
  value={filteredSuppliers.length}
  description="Supplier terdaftar"
/>
      </div>

      <div className="filter-box">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Cari nama supplier, nomor HP, email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-select">
          Semua Supplier <ChevronDown size={14} />
        </div>
        <div className="filter-select">
          Terbaru <ChevronDown size={14} />
        </div>
        <button className="add-btn" onClick={() => setTambahOpen(true)}>
          <Plus size={16} />
          Tambah Supplier
        </button>
      </div>

      <div className="member-table-card">
        <h3>Daftar Supplier</h3>
        <table>
          <thead>
            <tr>
              <th>SUPPLIER</th>
              <th>NO.HP</th>
              <th>EMAIL</th>
              <th>ALAMAT</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
  {filteredSuppliers.map((s) => (
    <tr key={s.id}>
      <td>
        <div className="member-name">{s.nama}</div>
      </td>

      <td>{s.telepon}</td>

      <td>{s.email}</td>

      <td>{s.alamat}</td>

      <td>
        <div className="aksi-btns">
          <Pencil size={16} onClick={() => handleEdit(s)} />
          <Trash2 size={16} onClick={() => handleDelete(s)} />
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

      <TambahSupplierModal
  isOpen={tambahOpen}
  onClose={() => setTambahOpen(false)}
  onSuccess={getSupplier}
/>
      <EditSupplierModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        supplier={selectedSupplier}
        onSave={handleSaveEdit}
      />
      <DeleteSupplierModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        supplier={selectedSupplier}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default DataSupplier;