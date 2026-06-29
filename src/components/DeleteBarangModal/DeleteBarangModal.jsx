import Modal from "../Modal/Modal";
import { Trash2 } from "lucide-react";
import api from "../../services/api";
import "./DeleteBarangModal.css";

export default function DeleteBarangModal({
  isOpen,
  onClose,
  barang,
  onConfirm,
}) {
  if (!barang) return null;

  const handleDelete = async () => {
    try {
      await api.delete(`/produk/${barang.id}`);

      onConfirm(barang);

      alert("Produk berhasil dihapus");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Barang">
      <div className="delete-confirm-body">
        <div className="delete-icon-wrap">
          <Trash2 size={28} color="#ef4444" />
        </div>

        <p className="delete-confirm-text">
          Yakin ingin menghapus barang{" "}
          <strong>{barang.nama_produk}</strong>?
          <br />
          Tindakan ini tidak bisa dibatalkan.
        </p>

        <div className="modal-footer">
          <button
            className="modal-btn-cancel"
            onClick={onClose}
          >
            Batal
          </button>

          <button
            className="modal-btn-delete"
            onClick={handleDelete}
          >
            <Trash2 size={14} />
            Hapus Barang
          </button>
        </div>
      </div>
    </Modal>
  );
}