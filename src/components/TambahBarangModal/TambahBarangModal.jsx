import { useState, useRef } from "react";
import Modal from "../Modal/Modal";
import { CloudUpload, Check } from "lucide-react";

export default function TambahBarangModal({ isOpen, onClose }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Barang Baru">
      <div className="modal-form-grid">
        <div className="modal-upload-box" onClick={() => inputRef.current.click()}>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
          {preview ? (
            <img src={preview} alt="preview" className="modal-upload-preview" />
          ) : (
            <>
              <CloudUpload size={28} color="#F5A300" />
              <span className="modal-upload-label">Klik atau drag foto produk ke sini</span>
              <span className="modal-upload-hint">PNG, JPG, WEBP - maks 2MB</span>
            </>
          )}
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Nama Produk</label>
          <input className="modal-input" placeholder="Contoh: GS Astra MF NS40Z" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">SKU/Kode Barang</label>
          <input className="modal-input" placeholder="AK-0001" />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Kategori</label>
          <select className="modal-select">
            <option>Aki Kering</option>
            <option>Aki Basah</option>
            <option>Aki Motor</option>
            <option>Kabel Aksesoris</option>
          </select>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Stok Awal</label>
          <input className="modal-input" type="number" placeholder="0" />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Harga Eceran</label>
          <input className="modal-input" placeholder="Rp0" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Harga Grosir</label>
          <input className="modal-input" placeholder="Rp0" />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Harga Modal</label>
          <input className="modal-input" placeholder="Rp0" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Stok Minimum</label>
          <input className="modal-input" placeholder="Rp0" />
        </div>

        <div className="modal-form-group full">
          <label className="modal-label">Deskripsi (opsional)</label>
          <textarea className="modal-textarea" placeholder="Deskripsi singkat produk..." />
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Batal</button>
          <button className="modal-btn-save"><Check size={14} />Simpan Barang</button>
        </div>
      </div>
    </Modal>
  );
}