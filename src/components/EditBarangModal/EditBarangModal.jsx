import { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";
import { Check, CloudUpload } from "lucide-react";

export default function EditBarangModal({ isOpen, onClose, barang, onSave }) {
  const [form, setForm] = useState({
    name: "", sub: "", sku: "", kategori: "", eceran: "", grosir: "", stok: "", status: ""
  });
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (barang) {
      setForm({
        name: barang.name || "",
        sub: barang.sub || "",
        sku: barang.sku || "",
        kategori: barang.kategori || "",
        eceran: barang.eceran || "",
        grosir: barang.grosir || "",
        stok: barang.stok ?? "",
        status: barang.status || "",
      });
      setPreview(null);
    }
  }, [barang]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    onSave({ ...barang, ...form, stok: Number(form.stok) });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Barang">
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
          <input className="modal-input" name="name" value={form.name} onChange={handleChange} placeholder="Contoh: GS Astra MF NS40Z" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">SKU/Kode Barang</label>
          <input className="modal-input" name="sku" value={form.sku} onChange={handleChange} placeholder="AK-0001" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Kategori</label>
          <select className="modal-select" name="kategori" value={form.kategori} onChange={handleChange}>
            <option>Aki Kering</option>
            <option>Aki Basah</option>
            <option>Aki Motor</option>
            <option>Kabel Aksesoris</option>
          </select>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Stok</label>
          <input className="modal-input" name="stok" type="number" value={form.stok} onChange={handleChange} placeholder="0" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Harga Eceran</label>
          <input className="modal-input" name="eceran" value={form.eceran} onChange={handleChange} placeholder="Rp0" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Harga Grosir</label>
          <input className="modal-input" name="grosir" value={form.grosir} onChange={handleChange} placeholder="Rp0" />
        </div>
        <div className="modal-form-group full">
          <label className="modal-label">Deskripsi (opsional)</label>
          <textarea className="modal-textarea" name="sub" value={form.sub} onChange={handleChange} placeholder="Deskripsi singkat produk..." />
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