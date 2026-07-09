import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { Check } from "lucide-react";
import api from "../../services/api";

export default function EditMemberModal({ isOpen, onClose, member, onSave }) {
  const [form, setForm] = useState({
  nama:"",
  no_hp:"",
  email:"",
  alamat:"",
  level:"silver",
  total_transaksi:"",
});

  useEffect(() => {
    if (member) {
      setForm({
    nama: member.nama || "",
    no_hp: member.no_hp || "",
    email: member.email || "",
    alamat: member.alamat || "",
    level: member.level?.toLowerCase() || "silver",
    total_transaksi: member.total_transaksi || "",
});

    }
  }, [member]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
  try {
    await api.put(`/member/${member.id}`, form);

    onSave({
      ...member,
      ...form,
    });

    alert("Member berhasil diupdate");
    onClose();
  } catch (err) {
    console.log(err);
    alert("Gagal update member");
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Member">
      <div className="modal-form-grid">
        <div className="modal-form-group">
          <label className="modal-label">Nama Lengkap</label>
          <input className="modal-input" name="nama" value={form.nama} onChange={handleChange} placeholder="Nama member" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">No.Hp</label>
          <input
  className="modal-input"
  name="no_hp"
  value={form.no_hp}
  onChange={handleChange}
/>
        </div>
        <div className="modal-form-group full">
          <label className="modal-label">Email</label>
          <input className="modal-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@gmail.com" />
        </div>
        <div className="modal-form-group full">
          <label className="modal-label">Alamat</label>
          <textarea className="modal-textarea" name="alamat" value={form.alamat} onChange={handleChange} placeholder="Alamat lengkap..." />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Level Member</label>
          <select className="modal-select" name="level" value={form.level} onChange={handleChange}>
           <option value="silver">Silver</option>
<option value="gold">Gold</option>
<option value="platinum">Platinum</option>
          </select>
        </div>
        <div className="modal-form-group">
  <label>Total Transaksi</label>
  <input
    className="modal-input"
    name="total_transaksi"
    value={form.total_transaksi}
    onChange={handleChange}
  />
</div>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Batal</button>
          <button className="modal-btn-save" onClick={handleSave}>
            <Check size={14} />Simpan Perubahan
          </button>
        </div>
      </div>
      
    </Modal>
  );
}