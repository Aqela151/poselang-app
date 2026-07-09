import Modal from "../Modal/Modal";
import { Trash2 } from "lucide-react";
import api from "../../services/api";

export default function DeleteSupplierModal({
  isOpen,
  onClose,
  supplier,
  onConfirm,
}) {
  if (!supplier) return null;

  const handleDelete = async () => {
    try {
      await api.delete(`/supplier/${supplier.id}`);

      onConfirm(supplier);

      alert("Supplier berhasil dihapus");
      onClose();
    } catch (err) {
      console.log(err.response);
      alert("Gagal menghapus supplier");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Supplier">
      <div className="delete-confirm-body">
        <div className="delete-icon-wrap">
          <Trash2 size={28} color="#ef4444" />
        </div>

        <p className="delete-confirm-text">
          Yakin ingin menghapus supplier <strong>{supplier.nama}</strong>?
          <br />
          Tindakan ini tidak bisa dibatalkan.
        </p>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Batal
          </button>

          <button className="modal-btn-delete" onClick={handleDelete}>
            <Trash2 size={14} />
            Hapus Supplier
          </button>
        </div>
      </div>
    </Modal>
  );
}