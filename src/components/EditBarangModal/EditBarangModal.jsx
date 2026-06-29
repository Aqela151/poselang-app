import { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";
import { Check, CloudUpload } from "lucide-react";
import api from "../../services/api";

export default function EditBarangModal({ isOpen, onClose, barang, onSave }) {
  const [form, setForm] = useState({
  nama_produk: "",
  kode_produk: "",
  kategori_id: "",
  supplier_id: "",
  harga_beli: "",
  harga_eceran: "",
  harga_grosir: "",
  stok: "",
});
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (barang) {
      setForm({
        nama_produk: barang.nama_produk || "",
        kode_produk: barang.kode_produk || "",
        kategori_id: barang.kategori_id || "",
        supplier_id: barang.supplier_id || "",
        harga_beli: barang.harga_beli || "",
        harga_eceran: barang.harga_eceran || "",
        harga_grosir: barang.harga_grosir || "",
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

  const handleSave = async () => {
  try {
    const res = await api.put(`/produk/${barang.id}`, {
      ...form,
      stok: Number(form.stok),
    });

    console.log(res.data);

    alert("Produk berhasil diupdate");

    onSave({
      ...barang,
      ...form,
      stok: Number(form.stok),
    });

    onClose();
  } catch (err) {
    console.log(err.response);
    alert("Gagal update produk");
  }
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
          <input className="modal-input" name="nama_produk" value={form.nama_produk} onChange={handleChange} placeholder="Contoh: GS Astra MF NS40Z" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">SKU/Kode Barang</label>
          <input className="modal-input" name="kode_produk" value={form.kode_produk} onChange={handleChange} placeholder="AK-0001" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Kategori</label>
          <select
  className="modal-select"
  name="kategori_id"
  value={form.kategori_id}
  onChange={handleChange}
>
  <option value="1">Aki Kering</option>
  <option value="2">Aki Basah</option>
  <option value="3">Aki Motor</option>
  <option value="4">Kabel Aksesoris</option>
</select>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Stok</label>
          <input className="modal-input" name="stok" type="number" value={form.stok} onChange={handleChange} placeholder="0" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Harga Eceran</label>
          <input className="modal-input" name="harga_eceran" value={form.harga_eceran} onChange={handleChange} placeholder="Rp0" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Harga Grosir</label>
          <input className="modal-input" name="harga_grosir" value={form.harga_grosir} onChange={handleChange} placeholder="Rp0" />
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