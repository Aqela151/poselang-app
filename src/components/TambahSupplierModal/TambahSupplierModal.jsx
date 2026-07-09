import { useState } from "react";
import Modal from "../Modal/Modal";
import { Check } from "lucide-react";
import api from "../../services/api";

export default function TambahSupplierModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    email: "",
    alamat: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await api.post("/supplier", form);

      alert("Supplier berhasil ditambahkan");

      setForm({
        nama: "",
        telepon: "",
        email: "",
        alamat: "",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.log(err.response);
      alert("Gagal menambahkan supplier");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Supplier">
      <div className="modal-form-grid">

        <div className="modal-form-group">
          <label className="modal-label">Nama Supplier</label>
          <input
            className="modal-input"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan nama supplier"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Telepon</label>
          <input
            className="modal-input"
            name="telepon"
            value={form.telepon}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Email</label>
          <input
            className="modal-input"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="supplier@email.com"
          />
        </div>

        <div className="modal-form-group full">
          <label className="modal-label">Alamat</label>
          <textarea
            className="modal-textarea"
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            placeholder="Masukkan alamat supplier"
          />
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Batal
          </button>

          <button className="modal-btn-save" onClick={handleSave}>
            <Check size={14} />
            Simpan
          </button>
        </div>

      </div>
    </Modal>
  );
}