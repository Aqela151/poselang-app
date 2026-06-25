import Modal from "../Modal/Modal";
import "./ViewBarangModal.css";

const statusLabel = { aman: "Aman", menipis: "Menipis", habis: "Habis" };

export default function ViewBarangModal({ isOpen, onClose, barang }) {
  if (!barang) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Barang">
      <div className="view-barang-body">
        <div className="view-barang-grid">
          <div className="view-field">
            <span className="view-label">Nama Produk</span>
            <span className="view-value">{barang.name}</span>
          </div>
          <div className="view-field">
            <span className="view-label">SKU</span>
            <span className="view-value">{barang.sku}</span>
          </div>
          <div className="view-field">
            <span className="view-label">Kategori</span>
            <span className="view-value">{barang.kategori}</span>
          </div>
          <div className="view-field">
            <span className="view-label">Stok</span>
            <span className="view-value">{barang.stok}</span>
          </div>
          <div className="view-field">
            <span className="view-label">Harga Eceran</span>
            <span className="view-value">Rp {barang.eceran}</span>
          </div>
          <div className="view-field">
            <span className="view-label">Harga Grosir</span>
            <span className="view-value">Rp {barang.grosir}</span>
          </div>
          <div className="view-field full">
            <span className="view-label">Status</span>
            <span className={`status ${barang.status}`}>{statusLabel[barang.status]}</span>
          </div>
          <div className="view-field full">
            <span className="view-label">Deskripsi</span>
            <span className="view-value">{barang.sub || "-"}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </Modal>
  );
}