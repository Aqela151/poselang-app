import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { Check } from "lucide-react";
import api from "../../services/api";

export default function EditSupplierModal({
  isOpen,
  onClose,
  supplier,
  onSave,
}) {
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    email: "",
    alamat: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        nama: supplier.nama || "",
        telepon: supplier.telepon || "",
        email: supplier.email || "",
        alamat: supplier.alamat || "",
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/supplier/${supplier.id}`, form);

      alert("Supplier berhasil diupdate");

      onSave(res.data.data);

      onClose();
    } catch (err) {
      console.log(err.response);
      alert("Gagal update supplier");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Supplier">
      <div className="modal-form-grid">

        <div className="modal-form-group">
          <label className="modal-label">Nama Supplier</label>
          <input
            className="modal-input"
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Telepon</label>
          <input
            className="modal-input"
            name="telepon"
            value={form.telepon}
            onChange={handleChange}
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Email</label>
          <input
            className="modal-input"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="modal-form-group full">
          <label className="modal-label">Alamat</label>
          <textarea
            className="modal-textarea"
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
          />
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Batal
          </button>

          <button className="modal-btn-save" onClick={handleSave}>
            <Check size={14} />
            Simpan Perubahan
          </button>
        </div>

      </div>
    </Modal>
  );
}