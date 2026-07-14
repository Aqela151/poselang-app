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
      console.log("[DeleteBarangModal] deleting id:", barang.id);
      const res = await api.delete(`/produk/${encodeURIComponent(barang.id)}`);
      console.log("[DeleteBarangModal] delete response:", res);

      onConfirm(barang);

      alert("Produk berhasil dihapus");
      onClose();
    } catch (err) {
      console.error("[DeleteBarangModal] delete error:", err);
      const status = err.response?.status;
      const backendMsg = err.response?.data?.message || err.response?.data || err.message;
      alert(`Gagal menghapus produk. ${status ? 'Status: ' + status + '. ' : ''}${backendMsg || ''}`);

      // Jika gagal karena foreign key constraint (MySQL 1451), tawarkan non-aktifkan produk
      const errMsgStr = String(backendMsg || "").toLowerCase();
      const isFkConstraint = errMsgStr.includes("1451") || errMsgStr.includes("foreign key") || errMsgStr.includes("integrity constraint");
      if (isFkConstraint) {
        const confirmDisable = window.confirm("Produk ini masih direferensikan oleh transaksi. Non-aktifkan produk agar tidak tampil di stok? (Tidak akan menghapus riwayat transaksi)");
        if (confirmDisable) {
          try {
            console.log("[DeleteBarangModal] attempting to deactivate id:", barang.id);
            // Attempt to set an 'aktif' flag; backend may ignore if field name differs
            const payload = { aktif: 0 };
            const res = await api.patch(`/produk/${encodeURIComponent(barang.id)}`, payload);
            console.log("[DeleteBarangModal] deactivate response:", res);
            alert("Produk dinonaktifkan (jika backend mendukung field 'aktif').");
            onConfirm(barang);
            onClose();
          } catch (patchErr) {
            console.error("[DeleteBarangModal] deactivate error:", patchErr);
            alert("Gagal menonaktifkan produk secara otomatis. Silakan hubungi admin.");
          }
        }
      }
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