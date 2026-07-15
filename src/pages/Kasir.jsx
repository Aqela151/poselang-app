import { useState, useEffect } from "react";
import { Search, Plus, Minus, QrCode, Banknote, User, Package, Wrench } from "lucide-react";
import akiImg from "../assets/images/image1.png";
import "./Kasir.css";
import api from "../services/api";

const fmt = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

const categoryLabelMap = {
  1: "Aki Kering",
  2: "Aki Basah",
  3: "Aki Motor",
  4: "Kabel Aksesoris",
  5: "Jasa",
  6: "Jasa",
};

const generateTrxCode = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `TRX-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

const getProductImageCandidates = (p) => {
  const extractStrings = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.flatMap(v => extractStrings(v));
    if (typeof val === 'object') {
      return [val.url, val.path, val.src, val.file, val.filename, val.file_name].filter(Boolean);
    }
    if (typeof val === 'string') return [val];
    return [];
  };

  const candidatesRaw = [];
  // common properties where backend might store image info
  const props = ['gambar_url','gambar','image_url','image','foto','img','foto_produk','file','filename','foto_url'];
  for (const prop of props) {
    if (p?.[prop]) candidatesRaw.push(...extractStrings(p[prop]));
  }

  // also check nested 'produk' or first media array
  if (p?.produk?.gambar) candidatesRaw.push(...extractStrings(p.produk.gambar));
  if (p?.media) candidatesRaw.push(...extractStrings(p.media));

  // fallback to any value that looks like a path in object
  if (candidatesRaw.length === 0 && p) {
    if (p?.path) candidatesRaw.push(p.path);
  }

  const normalized = candidatesRaw
    .map(s => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean);

  const base = (api.defaults.baseURL || '').replace(/\/?api\/?$/i, '').replace(/\/$/, '');
  const prefixes = [
    '',
    base + '/storage/',
    base + '/uploads/',
    base + '/storage/app/public/',
    base + '/',
  ].filter(Boolean);

  const urls = [];
  for (const raw of normalized) {
    if (raw.startsWith('http') || raw.startsWith('data:') || raw.startsWith('blob:')) {
      urls.push(raw);
      continue;
    }
    // if raw already contains storage/uploads or starts with slash, join with base
    if (/^\/?(storage|uploads|images)\//i.test(raw)) {
      urls.push(base + '/' + raw.replace(/^\//, ''));
      continue;
    }
    for (const pref of prefixes) {
      const candidate = pref.endsWith('/') ? pref + raw.replace(/^\//, '') : pref + '/' + raw.replace(/^\//, '');
      urls.push(candidate.replace(/([^:]\/)\//g, '$1'));
    }
  }

  // remove duplicates while preserving order
  return Array.from(new Set(urls));
};

const getProductImage = (p) => {
  const c = getProductImageCandidates(p);
  return c.length ? c[0] : akiImg;
};

function Kasir() {
  const [kategori, setKategori] = useState("Produk");
  const [search, setSearch] = useState("");
  const [keranjang, setKeranjang] = useState([]);
  const [metodeBayar, setMetodeBayar] = useState("tunai");
  const [bayar, setBayar] = useState("");
  const [produkList, setProdukList] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [trxCode, setTrxCode] = useState("TRX-000000");
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    getProduk();
    getMembers();
  }, []);

  const getProduk = async () => {
    try {
      const res = await api.get("/produk");
      console.log("[Kasir] produk response:", res.data);
      setProdukList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMembers = async () => {
    try {
      const res = await api.get("/member");
      setMembers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getKasirCategoryLabel = (p) => {
    return categoryLabelMap[p.kategori_id] || p.kategori_name || p.kategori || p.category_name || p.category || "Lainnya";
  };

  const isJasaItem = (p) => {
    const raw = `${p.kategori_name || p.kategori || p.category_name || p.category || p.kategori_id || ""}`.toLowerCase();
    if (raw.includes("jasa") || raw.includes("service") || raw.includes("servis")) return true;
    const id = Number(p.kategori_id ?? p.kategori ?? 0);
    return id > 4;
  };

  const isProdukItem = (p) => {
    const id = Number(p.kategori_id ?? p.kategori ?? 0);
    if (id >= 1 && id <= 4) return true;
    return !isJasaItem(p);
  };

  const filtered = produkList.filter((p) => {
    const matchesSearch = (p.nama_produk || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = kategori === "Produk" ? isProdukItem(p) : isJasaItem(p);
    return matchesSearch && matchesCategory;
  });

  const addToCart = (produk) => {
    setKeranjang(prev => {
      const exist = prev.find(k => k.id === produk.id);
      const others = prev.filter(k => k.id !== produk.id);
      const isHabis = Number(produk.stok) === 0;

      const habisOthers = others.filter(k => Number(k.stok) === 0);
      const nonHabisOthers = others.filter(k => Number(k.stok) !== 0);

      if (exist) {
        const updated = { ...exist, qty: exist.qty + 1 };
        if (isHabis) {
          // updated habis item goes to very top
          return [updated, ...habisOthers, ...nonHabisOthers];
        }
        // non-habis item goes after any habis items
        return [...habisOthers, updated, ...nonHabisOthers];
      }

      const newItem = { ...produk, qty: 1 };
      if (isHabis) {
        // new habis item at very top
        return [newItem, ...habisOthers, ...nonHabisOthers];
      }
      // new non-habis item goes after existing habis items
      return [...habisOthers, newItem, ...nonHabisOthers];
    });
  };

  const changeQty = (id, delta) => {
    setKeranjang(prev =>
      prev.map(k => k.id === id ? { ...k, qty: Math.max(1, k.qty + delta) } : k)
    );
  };

  const removeItem = (id) => setKeranjang((prev) => prev.filter((k) => k.id !== id));
  const clearCart = () => setKeranjang([]);

  const totalItems = keranjang.reduce((s, k) => s + k.qty, 0);
  const subtotal = keranjang.reduce((s, k) => s + Number(k.harga_eceran) * k.qty, 0);
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + tax;
  const bayarNum = parseInt(bayar.replace(/\D/g, "")) || 0;
  const kembali = Math.max(0, bayarNum - total);

  const hasCart = keranjang.length > 0;

  const handleMemberSelect = (e) => {
    const memberId = e.target.value;
    const member = members.find((m) => String(m.id) === memberId) || null;
    setSelectedMember(member);
  };

  const printReceipt = (txParam) => {
    const tx = txParam || lastTransaction;
    if (!tx) return;

    const date = new Date(tx.tanggal || new Date()).toLocaleString("id-ID");
    const items = tx.items || [];
    const rows = items
      .map((item) => {
        const name = item.nama_produk || item.nama || item.produk?.nama_produk || "-";
        const qty = item.qty || 0;
        const price = Number(item.harga || item.harga_eceran || 0);
        const subtotalRow = Number(item.subtotal ?? (qty * price) ?? 0);
        return `
          <tr>
            <td>${name}</td>
            <td style="text-align:right;">${qty}</td>
            <td style="text-align:right;">Rp ${price.toLocaleString("id-ID")}</td>
            <td style="text-align:right;">Rp ${subtotalRow.toLocaleString("id-ID")}</td>
          </tr>`;
      })
      .join("");

    const html = `
      <html>
        <head>
          <title>Struk ${tx.kode_transaksi || trxCode}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #000; }
            h2 { margin-bottom: 8px; }
            .section { margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { padding: 8px 4px; border-bottom: 1px solid #ddd; }
            th { text-align: left; }
            .right { text-align: right; }
          </style>
        </head>
        <body>
          <h2>Nama Toko</h2>
          <div>Nomor: ${tx.kode_transaksi || trxCode}</div>
          <div>Tanggal: ${date}</div>
          <div>Member: ${selectedMember?.nama || "Umum"}</div>
          <div class="section">
            <table>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th class="right">Qty</th>
                  <th class="right">Harga</th>
                  <th class="right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
          <div class="section">
            <div>Total: Rp ${Number(tx.total).toLocaleString("id-ID")}</div>
            <div>Bayar: Rp ${Number(tx.bayar).toLocaleString("id-ID")}</div>
            <div>Kembali: Rp ${Number(tx.kembali).toLocaleString("id-ID")}</div>
          </div>
          <div>Terima kasih.</div>
        </body>
      </html>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Tidak dapat membuka jendela cetak");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const prosesTransaksi = async () => {
    if (keranjang.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }

    try {
      const payload = {
        cabang_id: 1,
        kasir_id: 1,
        member_id: selectedMember?.id || null,
        total: total,
        metode_bayar: metodeBayar,
        bayar: bayarNum,
        tanggal: new Date().toISOString(),
        items: keranjang.map((item) => ({
          produk_id: item.id,
          qty: item.qty,
          harga: Number(item.harga_eceran),
        })),
      };

      const res = await api.post("/transaksi", payload);
      const kodeTransaksi = res.data?.kode_transaksi || generateTrxCode();
      const tanggal = res.data?.tanggal || new Date().toISOString();

      setTrxCode(kodeTransaksi);
      const tx = {
        kode_transaksi: kodeTransaksi,
        tanggal,
        total,
        bayar: bayarNum,
        kembali,
        items: keranjang.map((item) => ({
          ...item,
          harga: Number(item.harga_eceran),
          subtotal: Number(item.harga_eceran) * item.qty,
        })),
      };
      setLastTransaction(tx);
      printReceipt(tx);

      alert("Transaksi berhasil");
      setKeranjang([]);
      setBayar("");
      getProduk();
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      if (backendMessage === "Uang pembayaran kurang.") {
        alert("Transaksi gagal");
      } else {
        alert(backendMessage || "Transaksi gagal");
      }
    }
  };

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
          {filtered.map(p => {
            const candidates = getProductImageCandidates(p);
            const imgSrc = candidates[0] || akiImg;
            return (
            <div key={p.id} className="kasir-prod-card" onClick={() => addToCart(p)}>
              <div className="kasir-prod-badge">{p.stok} Tersedia</div>
              <div className="kasir-prod-img">
                <img
                  src={imgSrc}
                  alt={p.nama_produk}
                  data-candidates={JSON.stringify(candidates)}
                  data-idx={0}
                  onError={(e) => {
                    try {
                      const el = e.currentTarget;
                      const list = JSON.parse(el.dataset.candidates || '[]');
                      let idx = parseInt(el.dataset.idx || '0', 10) || 0;
                      idx += 1;
                      if (idx < list.length) {
                        el.dataset.idx = idx;
                        el.src = list[idx];
                        return;
                      }
                    } catch (err) {
                      // ignore
                    }
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = akiImg;
                  }}
                  onLoad={() => console.log('[Kasir] image loaded', imgSrc)}
                />
              </div>
              <div className="kasir-prod-name">{p.nama_produk}</div>
              <div className="kasir-prod-sub">{categoryLabelMap[p.kategori_id]}</div>
              <div className="kasir-prod-harga">
                <span className="kasir-tag eceran">Eceran</span>
                <span className="kasir-price-eceran">{fmt(Number(p.harga_eceran))}</span>
                <span className="kasir-tag grosir">Grosir</span>
                <span className="kasir-price-grosir">{fmt(Number(p.harga_grosir))}</span>
              </div>
            </div>
          );
          })}
        </div>
      </div>

      {/* ── KANAN ── */}
      <div className="kasir-right">

        {/* Header */}
        <div className="kasir-right-header">
          <span className="kasir-right-title">Transaksi Detail</span>
          <span className="kasir-trx-no">{trxCode}</span>
        </div>

        {/* Pelanggan */}
        <div className="kasir-pelanggan">
          <div className="kasir-pelanggan-avatar">
            <User size={14} color="#aaa" />
          </div>
          <div className="kasir-pelanggan-info">
            <div className="kasir-pelanggan-name">{selectedMember?.nama || "Pelanggan Umum"}</div>
            <div className="kasir-pelanggan-sub">
              {selectedMember ? `${selectedMember.level || ""} Member` : "Harga Eceran Normal"}
            </div>
            <select
              className="kasir-member-select"
              value={selectedMember?.id || ""}
              onChange={handleMemberSelect}
            >
              <option value="">Pelanggan Umum</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.nama} {member.level ? `(${member.level})` : ""}
                </option>
              ))}
            </select>
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
          {keranjang.map(k => {
            const candidatesK = getProductImageCandidates(k);
            const kImg = candidatesK[0] || akiImg;
            return (
            <div className="kasir-keranjang-item" key={k.id}>
              <div className="kasir-item-img">
                <img
                  src={kImg}
                  alt={k.nama_produk}
                  data-candidates={JSON.stringify(candidatesK)}
                  data-idx={0}
                  onError={(e) => {
                    try {
                      const el = e.currentTarget;
                      const list = JSON.parse(el.dataset.candidates || '[]');
                      let idx = parseInt(el.dataset.idx || '0', 10) || 0;
                      idx += 1;
                      if (idx < list.length) {
                        el.dataset.idx = idx;
                        el.src = list[idx];
                        return;
                      }
                    } catch (err) {
                      // ignore
                    }
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = akiImg;
                  }}
                  onLoad={() => console.log('[Kasir] cart image loaded', kImg)}
                />
              </div>
              <div className="kasir-item-body">
                <div className="kasir-item-name">{k.nama_produk}</div>
                <div className="kasir-item-sub">{categoryLabelMap[k.kategori_id]}</div>
                <div className="kasir-item-row">
                  <span className="kasir-item-price">{k.qty} × {fmt(Number(k.harga_eceran))}</span>
                  <div className="kasir-item-qty">
                    <button className="kasir-qty-btn minus" onClick={() => changeQty(k.id, -1)}><Minus size={10} /></button>
                    <span>{k.qty}</span>
                    <button className="kasir-qty-btn plus" onClick={() => changeQty(k.id, 1)}><Plus size={10} /></button>
                  </div>
                </div>
              </div>
            </div>
          );
          })}
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

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button className="kasir-proses-btn" onClick={prosesTransaksi}>Proses Transaksi!</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Kasir;