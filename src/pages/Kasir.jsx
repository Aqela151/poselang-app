import { useState } from "react";
import { Search, Plus, Minus, Trash2, QrCode, Banknote, ChevronDown, User, Package, Wrench, RefreshCw } from "lucide-react";
import akiImg from "../assets/images/image1.png";
import "./Kasir.css";

const produkList = [
  { id: 1, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
  { id: 2, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
  { id: 3, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
  { id: 4, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
  { id: 5, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
  { id: 6, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
  { id: 7, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
  { id: 8, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
  { id: 9, nama: "GS Astra Maintenance Free (MF)", sub: "Kering", stok: 12, eceran: 1000000, grosir: 900000 },
];

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

function Kasir() {
  const [kategori, setKategori] = useState("Produk");
  const [search, setSearch] = useState("");
  const [keranjang, setKeranjang] = useState([]);
  const [metodeBayar, setMetodeBayar] = useState("tunai");
  const [bayar, setBayar] = useState("");

  const filtered = produkList.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (produk) => {
    setKeranjang(prev => {
      const exist = prev.find(k => k.id === produk.id);
      if (exist) return prev.map(k => k.id === produk.id ? { ...k, qty: k.qty + 1 } : k);
      return [...prev, { ...produk, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setKeranjang(prev =>
      prev.map(k => k.id === id ? { ...k, qty: Math.max(1, k.qty + delta) } : k)
    );
  };

  const removeItem = (id) => setKeranjang(prev => prev.filter(k => k.id !== id));
  const clearCart = () => setKeranjang([]);

  const totalItems = keranjang.reduce((s, k) => s + k.qty, 0);
  const subtotal = keranjang.reduce((s, k) => s + k.eceran * k.qty, 0);
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + tax;
  const bayarNum = parseInt(bayar.replace(/\D/g, "")) || 0;
  const kembali = bayarNum - total;

  const hasCart = keranjang.length > 0;

  return (
    <div className="kasir-wrap">

      {/* ── KIRI ── */}
      <div className="kasir-left">

        <div className="kasir-section-title">Kategori Produk/Jasa</div>

        <div className="kasir-kategori">
          <button
            className={`kasir-kat-btn ${kategori === "Produk" ? "active" : ""}`}
            onClick={() => setKategori("Produk")}
          >
            <Package size={18} strokeWidth={1.5} />
            <span>Produk</span>
          </button>
          <button
            className={`kasir-kat-btn ${kategori === "Jasa" ? "active" : ""}`}
            onClick={() => setKategori("Jasa")}
          >
            <Wrench size={18} strokeWidth={1.5} />
            <span>Jasa</span>
          </button>
        </div>

        <div className="kasir-produk-header">
          <div className="kasir-section-title">Pilih Produk</div>
          <span className="kasir-showing">Showing {filtered.length} Items</span>
        </div>

        <div className="kasir-search-wrap">
          <Search size={14} color="#bbb" />
          <input
            placeholder="Cari produk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="kasir-grid">
          {filtered.map(p => (
            <div key={p.id} className="kasir-prod-card" onClick={() => addToCart(p)}>
              <div className="kasir-prod-badge">{p.stok} Tersedia</div>
              <div className="kasir-prod-img">
                <img src={akiImg} alt={p.nama} />
              </div>
              <div className="kasir-prod-name">{p.nama}</div>
              <div className="kasir-prod-sub">{p.sub}</div>
              <div className="kasir-prod-harga">
                <span className="kasir-tag eceran">Eceran</span>
                <span className="kasir-price-eceran">{fmt(p.eceran)}</span>
                <span className="kasir-tag grosir">Grosir</span>
                <span className="kasir-price-grosir">{fmt(p.grosir)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── KANAN ── */}
      <div className="kasir-right">

        {/* Header */}
        <div className="kasir-right-header">
          <span className="kasir-right-title">Transaksi Detail</span>
          <span className="kasir-trx-no">#TRX-001</span>
        </div>

        {/* Pelanggan */}
        <div className="kasir-pelanggan">
          <div className="kasir-pelanggan-avatar">
            <User size={14} color="#aaa" />
          </div>
          <div className="kasir-pelanggan-info">
            <div className="kasir-pelanggan-name">Pelanggan Umum</div>
            <div className="kasir-pelanggan-sub">Harga Eceran Normal</div>
          </div>
          <div className="kasir-pelanggan-radio" />
        </div>

        {/* Keranjang header */}
        <div className="kasir-keranjang-header">
          <div className="kasir-keranjang-left">
            <span className="kasir-keranjang-title">Keranjang</span>
            <span className="kasir-keranjang-count">{totalItems} Items</span>
          </div>
          <button className="kasir-clear-btn" onClick={clearCart}>Clear</button>
        </div>

        {/* Keranjang list */}
        <div className="kasir-keranjang-list">
          {!hasCart && (
            <div className="kasir-empty">Belum ada produk dipilih</div>
          )}
          {keranjang.map(k => (
            <div className="kasir-keranjang-item" key={k.id}>
              <div className="kasir-item-img">
                <img src={akiImg} alt={k.nama} />
              </div>
              <div className="kasir-item-body">
                <div className="kasir-item-name">{k.nama}</div>
                <div className="kasir-item-sub">{k.sub}</div>
                <div className="kasir-item-row">
                  <span className="kasir-item-price">{k.qty} × {fmt(k.eceran)}</span>
                  <div className="kasir-item-qty">
                    <button className="kasir-qty-btn minus" onClick={() => changeQty(k.id, -1)}><Minus size={10} /></button>
                    <span>{k.qty}</span>
                    <button className="kasir-qty-btn plus" onClick={() => changeQty(k.id, 1)}><Plus size={10} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="kasir-bottom">
          <div className="kasir-metode-title">Metode Pembayaran</div>
          <div className="kasir-metode">
            <button
              className={`kasir-metode-btn ${metodeBayar === "tunai" ? "active" : ""}`}
              onClick={() => setMetodeBayar("tunai")}
            >
              <Banknote size={16} />
              <span>Uang Tunai</span>
            </button>
            <button
              className={`kasir-metode-btn ${metodeBayar === "qris" ? "active" : ""}`}
              onClick={() => setMetodeBayar("qris")}
            >
              <QrCode size={16} />
              <span>QRIS</span>
            </button>
          </div>

          <div className="kasir-bayar-label">Total Dibayar</div>
          <input
            className="kasir-bayar-input"
            placeholder="Rp 0"
            value={bayar}
            onChange={e => setBayar(e.target.value)}
          />

          <div className="kasir-rincian">
            <div className="kasir-rincian-row"><span>Amount</span><span>{totalItems} Items</span></div>
            <div className="kasir-rincian-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="kasir-rincian-row"><span>Tax (3%)</span><span>{fmt(tax)}</span></div>
            <div className="kasir-rincian-row total"><span>Total</span><span className="kasir-total-val">{fmt(total)}</span></div>
            <div className="kasir-rincian-row"><span>Bayar</span><span>{fmt(bayarNum)}</span></div>
            <div className="kasir-rincian-row"><span>Kembali</span><span>{kembali >= 0 ? fmt(kembali) : "-"}</span></div>
          </div>

          <button className="kasir-proses-btn">Proses Transaksi!</button>
        </div>
      </div>
    </div>
  );
}

export default Kasir;