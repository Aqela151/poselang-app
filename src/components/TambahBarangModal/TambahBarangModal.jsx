import { useState, useRef } from "react";
import Modal from "../Modal/Modal";
import { CloudUpload, Check } from "lucide-react";
import api from "../../services/api";

export default function TambahBarangModal({ isOpen, onClose }) {
  const [preview, setPreview] = useState(null);
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
  const inputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async () => {
  console.log("MASUK HANDLE SUBMIT");
  console.log(form);

  try {
    const response = await api.post("/produk", form);

    console.log("BERHASIL");
    console.log(response.data);

    alert("Produk berhasil ditambahkan");
    onClose();
  } catch (error) {
    console.log("ERROR NIH");
    console.log(error);

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
    }
  }
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
          <input
  className="modal-input"
  name="nama_produk"
  value={form.nama_produk}
  onChange={handleChange}
  placeholder="Contoh: GS Astra MF NS40Z"
/>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">SKU/Kode Barang</label>
          <input
            className="modal-input"
            name="kode_produk"
            value={form.kode_produk}
            onChange={handleChange}
            placeholder="AK-0001"
          />
        </div>

        

        <div className="modal-form-group">
  <label className="modal-label">Kategori</label>

  <select
    className="modal-select"
    name="kategori_id"
    value={form.kategori_id}
    onChange={handleChange}
  >
    <option value="">Pilih Kategori</option>
    <option value="1">Aki Kering</option>
    <option value="2">Aki Basah</option>
    <option value="3">Aki Motor</option>
    <option value="4">Kabel Aksesoris</option>
  </select>
</div>

<div className="modal-form-group">
  <label className="modal-label">Supplier</label>

  <select
    className="modal-select"
    name="supplier_id"
    value={form.supplier_id}
    onChange={handleChange}
  >
    <option value="">Pilih Supplier</option>
    <option value="1">Supplier 1</option>
  </select>
</div>
        <div className="modal-form-group">
          <label className="modal-label">Stok Awal</label>
          <input
  className="modal-input"
  type="number"
  name="stok"
  value={form.stok}
  onChange={handleChange}
  placeholder="0"
/>
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Harga Eceran</label>
          <input
            className="modal-input"
            name="harga_eceran"
            value={form.harga_eceran}
            onChange={handleChange}
            placeholder="Rp0"
          />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Harga Grosir</label>
          <input
            className="modal-input"
            name="harga_grosir"
            value={form.harga_grosir}
            onChange={handleChange}
            placeholder="Rp0"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Harga Modal</label>
          <input
            className="modal-input"
            name="harga_beli"
            value={form.harga_beli}
            onChange={handleChange}
            placeholder="Rp0"
          />
        </div>
        
        <div className="modal-form-group full">
          <label className="modal-label">Deskripsi (opsional)</label>
          <textarea className="modal-textarea" placeholder="Deskripsi singkat produk..." />
        </div>

        <div className="modal-footer">
         <button
  type="button"
  className="modal-btn-save"
  onClick={handleSubmit}
>
  <Check size={14} />
  Simpan Barang
</button>
        </div>
      </div>
    </Modal>
  );
}