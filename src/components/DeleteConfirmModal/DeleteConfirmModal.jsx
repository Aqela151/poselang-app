import Modal from "../Modal/Modal";
import { Trash2 } from "lucide-react";
import "./DeleteConfirmModal.css";
import api from "../../services/api";

export default function DeleteConfirmModal({ isOpen, onClose, member, onConfirm }) {
  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Member">
      <div className="delete-confirm-body">
        <div className="delete-icon-wrap">
          <Trash2 size={28} color="#ef4444" />
        </div>
        <p className="delete-confirm-text">
  Yakin ingin menghapus member <strong>{member.nama}</strong>?
</p>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Batal</button>
          <button className="modal-btn-delete" onClick={() => { onConfirm(member); onClose(); }}>
            <Trash2 size={14} />Hapus Member
          </button>
        </div>
      </div>
    </Modal>
  );
}