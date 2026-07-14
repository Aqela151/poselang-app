import { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";
import { Check, CloudUpload } from "lucide-react";
import api from "../../services/api";

export default function EditBarangModal({ isOpen, onClose, barang, onSave, onSuccess }) {
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    nama_produk: "",
    kode_produk: "",
    kategori_id: "",
    supplier_id: "",
    harga_beli: "",
    harga_eceran: "",
    harga_grosir: "",
    stok: "",
    status: "",
    sub: "",
  });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const getProductImageUrl = (product) => {
    if (!product) return null;
    if (product.gambar_url) return product.gambar_url;
    const raw = product.gambar || product.foto || product.image || "";
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw) || raw.startsWith("blob:") || raw.startsWith("data:")) {
      return raw;
    }
    const baseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
    return `${baseUrl}/uploads/${raw}`;
  };

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
        sub: barang.sub || "",
      });
      setPreview(getProductImageUrl(barang));
    }
  }, [barang]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const appendImageToFormData = (formData, file) => {
    if (!file) return;
    ["gambar", "foto", "foto_produk", "image", "file", "photo"].forEach((fieldName) => {
      formData.append(fieldName, file, file.name);
    });
  };

  const handleSave = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      if (imageFile) {
        appendImageToFormData(formData, imageFile);
      }

      // Laravel file upload with method override is safer via POST + _method=PUT
      formData.append("_method", "PUT");

      const res = await api.post(`/produk/${barang.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("[EditBarangModal] update response:", res.data);
      alert("Produk berhasil diupdate");

      const updatedItem = res.data?.data || res.data || {
        ...barang,
        ...form,
        stok: Number(form.stok),
      };

      onSave(updatedItem);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Gagal update produk:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Gagal update produk");
      }
    } finally {
      setSubmitting(false);
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
          <button type="button" className="modal-btn-cancel" onClick={onClose}>Batal</button>
          <button type="button" className="modal-btn-save" onClick={handleSave} disabled={submitting}>
            <Check size={14} />{submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </Modal>
  );
}