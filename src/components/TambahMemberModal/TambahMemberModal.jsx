import { useState } from "react";
import Modal from "../Modal/Modal";
import { Check } from "lucide-react";
import api from "../../services/api";

export default function TambahMemberModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const initialForm = {
    nama: "",
    no_hp: "",
    email: "",
    alamat: "",
    level: "silver",
    total_transaksi: 0,
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleSubmit = async () => {
    try {
      await api.post("/member", form);

      alert("Member berhasil ditambahkan");
      onSuccess(); // ambil ulang data member
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan member");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title="Tambah Member Baru">
      <div className="modal-form-grid">

        <div className="modal-form-group">
          <label className="modal-label">Nama Lengkap</label>
          <input
            className="modal-input"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama Member"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">No. HP</label>
          <input
            className="modal-input"
            name="no_hp"
            value={form.no_hp}
            onChange={handleChange}
            placeholder="0812xxxxxxx"
          />
        </div>

        <div className="modal-form-group full">
          <label className="modal-label">Email</label>
          <input
            className="modal-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@gmail.com"
          />
        </div>

        <div className="modal-form-group full">
          <label className="modal-label">Alamat</label>
          <textarea
            className="modal-textarea"
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            placeholder="Alamat lengkap..."
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Level Member</label>
          <select
            className="modal-select"
            name="level"
            value={form.level}
            onChange={handleChange}
          >
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Total Transaksi</label>
          <input
            className="modal-input"
            type="number"
            name="total_transaksi"
            value={form.total_transaksi}
            onChange={handleChange}
          />
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn-cancel"
            onClick={onClose}
          >
            Batal
          </button>

          <button
            className="modal-btn-save"
            onClick={handleSubmit}
          >
            <Check size={14} />
            Simpan Member
          </button>
        </div>

      </div>
    </Modal>
  );
}