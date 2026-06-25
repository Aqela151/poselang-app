import Modal from "../Modal/Modal";
import { Check } from "lucide-react";

export default function TambahMemberModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Member Baru">
      <div className="modal-form-grid">
        <div className="modal-form-group">
          <label className="modal-label">Nama Lengkap</label>
          <input className="modal-input" placeholder="Nama member" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">No.Hp</label>
          <input className="modal-input" placeholder="0812-xxxx-xxxx" />
        </div>

        <div className="modal-form-group full">
          <label className="modal-label">Email</label>
          <input className="modal-input" type="email" placeholder="email@gmail.com" />
        </div>

        <div className="modal-form-group full">
          <label className="modal-label">Alamat</label>
          <textarea className="modal-textarea" placeholder="Alamat lengkap..." />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Level Member</label>
          <select className="modal-select">
            <option>Silver</option>
            <option>Gold</option>
            <option>Platinum</option>
          </select>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Tanggal Bergabung</label>
          <input className="modal-input" type="date" />
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Batal</button>
          <button className="modal-btn-save"><Check size={14} />Simpan Member</button>
        </div>
      </div>
    </Modal>
  );
}