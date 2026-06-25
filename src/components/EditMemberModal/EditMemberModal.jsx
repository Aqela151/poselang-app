import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { Check } from "lucide-react";

export default function EditMemberModal({ isOpen, onClose, member, onSave }) {
  const [form, setForm] = useState({
    name: "", email: "", noHp: "", alamat: "", level: "Silver", bergabung: ""
  });

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        email: member.email || "",
        noHp: member.noHp || "",
        alamat: member.alamat || "",
        level: member.level
          ? member.level.charAt(0).toUpperCase() + member.level.slice(1)
          : "Silver",
        bergabung: member.bergabung || "",
      });
    }
  }, [member]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    onSave({ ...member, ...form, level: form.level.toLowerCase() });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Member">
      <div className="modal-form-grid">
        <div className="modal-form-group">
          <label className="modal-label">Nama Lengkap</label>
          <input className="modal-input" name="name" value={form.name} onChange={handleChange} placeholder="Nama member" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">No.Hp</label>
          <input className="modal-input" name="noHp" value={form.noHp} onChange={handleChange} placeholder="0812-xxxx-xxxx" />
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
            <option>Silver</option>
            <option>Gold</option>
            <option>Platinum</option>
          </select>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Tanggal Bergabung</label>
          <input className="modal-input" name="bergabung" value={form.bergabung} onChange={handleChange} />
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