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

const categoryLabelMap = {
  1: "Aki Kering",
  2: "Aki Basah",
  3: "Aki Motor",
  4: "Kabel Aksesoris",
};

function StokBarang() {
  const [products, setProducts] = useState([]);
  const [tambahOpen, setTambahOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    getProduk();
  }, []);

  const getProduk = async () => {
    try {
      const res = await api.get("/produk");
      const data = res?.data;
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
      setProducts(normalized);
    } catch (err) {
      console.log(err);
      setProducts([]);
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
      prev.map((p) => (Number(p.id) === Number(updated.id) ? updated : p))
    );
  };

  const handleConfirmDelete = (target) => {
    setProducts((prev) => prev.filter((p) => Number(p.id) !== Number(target.id)));
  };

  const getStatusKey = (stok) => {
    if (Number(stok) === 0) return "habis";
    if (Number(stok) < 10) return "menipis";
    return "aman";
  };

  const getCategoryLabel = (product) => {
    const rawValue = product.kategori_name || product.kategori || product.category_name || product.category || product.kategori_id;

    if (typeof rawValue === "string" && rawValue.trim()) {
      const mapped = categoryLabelMap[Number(rawValue)] ?? rawValue;
      return mapped;
    }

    const id = Number(product.kategori_id ?? product.kategori ?? 0);
    return categoryLabelMap[id] || "Lainnya";
  };

  // Ambil URL gambar produk — prioritas ke gambar_url yang sudah lengkap dari Laravel
  const getProductImage = (product) => {
    if (product.gambar_url) return product.gambar_url;

    const raw = product.gambar || product.foto || product.image || "";
    if (!raw) return null;

    if (raw.startsWith("http") || raw.startsWith("blob:") || raw.startsWith("data:")) return raw;

    const baseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
    return `${baseUrl}/uploads/${raw}`;
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const categoryOptions = Array.from(new Set(safeProducts.map((product) => getCategoryLabel(product))));

  const filteredProducts = safeProducts.filter((product) => {
    const query = searchTerm.toLowerCase();
    const searchableText = `${product.nama_produk || ""} ${product.kode_produk || ""} ${getCategoryLabel(product)}`.toLowerCase();
    const matchesSearch = searchableText.includes(query);
    const categoryValue = getCategoryLabel(product);
    const matchesCategory = categoryFilter === "all" || categoryValue === categoryFilter;
    const matchesStock = stockFilter === "all" || getStatusKey(product.stok) === stockFilter;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const idA = Number(a.id || 0);
    const idB = Number(b.id || 0);

    return sortOrder === "newest" ? idB - idA : idA - idB;
  });

  const totalStok = safeProducts.reduce((sum, p) => sum + Number(p.stok || 0), 0);
  const stokMenipis = safeProducts.filter((p) => Number(p.stok) > 0 && Number(p.stok) < 10).length;
  const stokHabis = safeProducts.filter((p) => Number(p.stok) === 0).length;

  return (
    <div className="stok-container">
      <div className="stats-cards">
        <Card title="Total Produk" value={safeProducts.length} description="Di semua kategori" />
        <Card title="Stok Produk" value={totalStok.toLocaleString("id-ID")} description="Total keseluruhan" />
        <Card title="Stok Menipis" value={stokMenipis} description="Perlu restock segera" />
        <Card title="Stok Habis" value={stokHabis} description="Tidak tersedia" />
      </div>

      <div className="filter-box">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Cari nama produk, SKU"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Semua Kategori</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select className="filter-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
          <option value="all">Semua Stok</option>
          <option value="aman">Aman</option>
          <option value="menipis">Menipis</option>
          <option value="habis">Habis</option>
        </select>
        <select className="filter-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
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
            {sortedProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="prod-info">
                    {getProductImage(p) ? (
                      <img
                        src={getProductImage(p)}
                        alt={p.nama_produk}
                        className="prod-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="prod-img prod-img-fallback"
                      style={{ display: getProductImage(p) ? "none" : "flex" }}
                    >
                      🔋
                    </div>
                    <div>
                      <div className="prod-name">{p.nama_produk}</div>
                      <div className="prod-sub">{p.kode_produk}</div>
                    </div>
                  </div>
                </td>
                <td>{p.kode_produk}</td>
                <td>{getCategoryLabel(p)}</td>
                <td>Rp {Number(p.harga_eceran).toLocaleString("id-ID")}</td>
                <td>Rp {Number(p.harga_grosir).toLocaleString("id-ID")}</td>
                <td>{p.stok}</td>
                <td>
                  {getStatusKey(p.stok) === "habis" ? (
                    <span className="status habis">{statusLabel.habis}</span>
                  ) : getStatusKey(p.stok) === "menipis" ? (
                    <span className="status menipis">{statusLabel.menipis}</span>
                  ) : (
                    <span className="status aman">{statusLabel.aman}</span>
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
          <span className="pag-info">Menampilkan {sortedProducts.length} dari {safeProducts.length} produk</span>
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

      <TambahBarangModal
        isOpen={tambahOpen}
        onClose={() => setTambahOpen(false)}
        onSuccess={getProduk}
      />
      <EditBarangModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        barang={selectedBarang}
        onSave={handleSaveEdit}
        onSuccess={getProduk}
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