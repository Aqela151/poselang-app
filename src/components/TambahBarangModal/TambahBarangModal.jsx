import { useState, useRef } from "react";
import Modal from "../Modal/Modal";
import { CloudUpload, Check } from "lucide-react";
import api from "../../services/api";

export default function TambahBarangModal({ isOpen, onClose, onSuccess }) {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
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
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      nama_produk: "",
      kode_produk: "",
      kategori_id: "",
      supplier_id: "",
      harga_beli: "",
      harga_eceran: "",
      harga_grosir: "",
      stok: "",
    });
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      // hanya kirim 1 nama field yang jelas, sesuai yang dibaca controller
      if (imageFile) {
        formData.append("gambar", imageFile, imageFile.name);
      }

      const response = await api.post("/produk", formData);

      console.log("Produk tersimpan:", response.data);
      alert("Produk berhasil ditambahkan");

      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Gagal simpan produk:", error);
      if (error.response) {
        console.error("Detail error:", error.response.data);
      }
      alert("Gagal menambahkan produk. Cek console untuk detail.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Barang Baru">
      <div className="modal-form-grid">
        <div className="modal-upload-box" onClick={() => inputRef.current.click()}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
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
            disabled={submitting}
          >
            <Check size={14} />
            {submitting ? "Menyimpan..." : "Simpan Barang"}
          </button>
        </div>
      </div>
    </Modal>
  );
}