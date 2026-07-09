import { useState, useMemo, useEffect } from "react";
import { Printer, FileSpreadsheet, FileText, Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../components/Card/Card";
import Modal from "../components/Modal/Modal";
import api from "../services/api";
import "./Laporan.css";

const fmt = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

const BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function Laporan() {
  const [transaksi, setTransaksi] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [chartTab, setChartTab] = useState("omset"); // omset | transaksi | item
  const [page, setPage] = useState(1);
  const pageSize = 7;

  useEffect(() => {
    getTransaksiHistory();
  }, []);

  const getTransaksiHistory = async () => {
    try {
      const res = await api.get("/transaksi/histori");
      setTransaksi(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getDetail = (trx) => trx.detail_transaksi || trx.items || [];

  const filteredTransaksi = transaksi.filter((t) => {
    const keyword = search.toLowerCase();
    return (
      (t.kode_transaksi || "").toLowerCase().includes(keyword) ||
      (t.kasir?.nama || t.nama_kasir || "").toLowerCase().includes(keyword) ||
      (t.tipe_harga || t.metode_bayar || "").toLowerCase().includes(keyword)
    );
  });

  // Reset ke halaman 1 setiap kali pencarian berubah
  useEffect(() => setPage(1), [search]);

  const openDetail = (trx) => {
    setSelectedTransaction(trx);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedTransaction(null);
    setDetailOpen(false);
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID");
  };

  const formatWaktu = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}.${mm} WIB`;
  };

  const detailItems = getDetail(selectedTransaction || {});

  /* ── Statistik ── */
  const totalTransactions = transaksi.length;
  const totalOmset = transaksi.reduce((sum, trx) => sum + Number(trx.total || 0), 0);
  const totalItems = transaksi.reduce((sum, trx) => {
    const detail = getDetail(trx);
    return sum + detail.reduce((sub, item) => sub + Number(item.qty || 0), 0);
  }, 0);
  const average = totalTransactions ? Math.round(totalOmset / totalTransactions) : 0;

  /* ── Data Chart: group by tanggal ── */
  const chartData = useMemo(() => {
    const map = {};
    transaksi.forEach((trx) => {
      const raw = trx.tanggal || trx.created_at || trx.updated_at;
      if (!raw) return;
      const d = new Date(raw);
      const key = d.toISOString().slice(0, 10);
      if (!map[key]) map[key] = { date: d, omset: 0, transaksi: 0, item: 0 };
      map[key].omset += Number(trx.total || 0);
      map[key].transaksi += 1;
      map[key].item += getDetail(trx).reduce((s, it) => s + Number(it.qty || 0), 0);
    });
    return Object.values(map).sort((a, b) => a.date - b.date);
  }, [transaksi]);

  const chartValues = chartData.map((d) => d[chartTab]);
  const maxVal = Math.max(1, ...chartValues);

  /* ── Bangun path SVG halus (smooth curve) ── */
  const CHART_W = 1000;
  const CHART_H = 150;
  const buildChartPath = () => {
    if (chartValues.length === 0) return { line: "", area: "", points: [] };
    const stepX = chartValues.length > 1 ? CHART_W / (chartValues.length - 1) : 0;
    const points = chartValues.map((v, i) => ({
      x: i * stepX,
      y: CHART_H - (v / maxVal) * (CHART_H - 20) - 10,
    }));

    let line = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const xm = (points[i].x + points[i + 1].x) / 2;
      const ym = (points[i].y + points[i + 1].y) / 2;
      line += ` Q ${points[i].x},${points[i].y} ${xm},${ym}`;
    }
    line += ` L ${points[points.length - 1].x},${points[points.length - 1].y}`;

    const area = `${line} L ${points[points.length - 1].x},${CHART_H} L ${points[0].x},${CHART_H} Z`;
    return { line, area, points };
  };
  const { line, area, points } = buildChartPath();

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredTransaksi.length / pageSize));
  const pagedTransaksi = filteredTransaksi.slice((page - 1) * pageSize, page * pageSize);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const pageNumbers = useMemo(() => {
    const nums = [];
    const windowSize = 3;
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  /* ── Produk Terlaris ── */
  const produkTerlaris = useMemo(() => {
    const map = {};
    transaksi.forEach((trx) => {
      getDetail(trx).forEach((item) => {
        const nama = item.produk?.nama_produk || item.nama_produk || item.nama || "-";
        const kategori = item.produk?.kategori || item.kategori || "";
        const qty = Number(item.qty || 0);
        if (!map[nama]) map[nama] = { nama, kategori, qty: 0 };
        map[nama].qty += qty;
      });
    });
    const list = Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const maxQty = Math.max(1, ...list.map((p) => p.qty));
    return list.map((p) => ({ ...p, percent: Math.round((p.qty / maxQty) * 100) }));
  }, [transaksi]);

  return (
    <div className="lap-wrap">
      <div className="lap-header">
        <h2 className="lap-title">Laporan</h2>
        <div className="lap-header-btns">
          <button className="lap-btn-outline" onClick={() => window.print()}>
            <Printer size={14} /> Print
          </button>
          <button className="lap-btn-outline">
            <FileSpreadsheet size={14} /> Excel
          </button>
          <button className="lap-btn-export">
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="lap-filterbar">
        <span className="lap-flabel">Dari</span>
        <input className="lap-dateinput" type="date" defaultValue="2026-05-01" />
        <span className="lap-flabel">s/d</span>
        <input className="lap-dateinput" type="date" defaultValue="2026-05-15" />
        <span className="lap-flabel">Cabang</span>
        <div className="lap-select">Semua Cabang <ChevronDown size={13} /></div>
        <div className="lap-period">
          <button className="lap-periodb active">Harian</button>
          <button className="lap-periodb">Mingguan</button>
          <button className="lap-periodb">Bulanan</button>
          <button className="lap-periodb">Tahunan</button>
        </div>
        <button className="lap-resetbtn"><RefreshCw size={13} /> Reset</button>
      </div>

      <div className="lap-stats">
        <Card title="Omset" value={fmt(totalOmset)} description="Omset total" />
        <Card title="Total Transaksi" value={totalTransactions} description="Transaksi tersimpan" />
        <Card title="Item Terjual" value={totalItems} description="Semua item" />
        <Card title="Rata-rata Transaksi" value={fmt(average)} description="Per transaksi" />
      </div>

      {/* ── Chart ── */}
      <div className="lap-card">
        <div className="lap-chart-header">
          <span className="lap-card-title">
            {chartTab === "omset" ? "Omset" : chartTab === "transaksi" ? "Transaksi" : "Item Terjual"}
          </span>
          <div className="lap-chart-tabs">
            <button
              className={`lap-charttab ${chartTab === "omset" ? "active" : ""}`}
              onClick={() => setChartTab("omset")}
            >
              Omset
            </button>
            <button
              className={`lap-charttab ${chartTab === "transaksi" ? "active" : ""}`}
              onClick={() => setChartTab("transaksi")}
            >
              Transaksi
            </button>
            <button
              className={`lap-charttab ${chartTab === "item" ? "active" : ""}`}
              onClick={() => setChartTab("item")}
            >
              Item Terjual
            </button>
          </div>
        </div>

        <div className="lap-chart-body">
          {chartData.length > 0 ? (
            <>
              <svg
                className="lap-svg"
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="lapAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5a300" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f5a300" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={area} fill="url(#lapAreaFill)" stroke="none" />
                <path d={line} fill="none" stroke="#f5a300" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#f5a300" strokeWidth="2" />
                ))}
              </svg>
              <div className="lap-xlabels">
                {chartData.map((d, i) => (
                  <span key={i}>
                    {d.date.getDate()} {BULAN[d.date.getMonth()]}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: "#bbb", fontSize: 13, textAlign: "center", padding: "24px 0" }}>
              Belum ada data untuk periode ini
            </p>
          )}
        </div>
      </div>

      {/* ── Tabel Transaksi ── */}
      <div className="lap-card">
        <div className="lap-table-header">
          <span className="lap-card-title">Transaksi</span>
          <div className="lap-searchbox">
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={14} color="#aaa" />
          </div>
        </div>

        <table className="lap-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Waktu</th>
              <th>Kasir</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th className="th-orange">Total</th>
            </tr>
          </thead>
          <tbody>
            {pagedTransaksi.map((trx, index) => {
              const detail = getDetail(trx);
              const jumlah = detail.reduce((s, it) => s + Number(it.qty || 0), 0);
              return (
                <tr key={trx.id || index} onClick={() => openDetail(trx)} style={{ cursor: "pointer" }}>
                  <td className="td-gray">{trx.kode_transaksi || trx.kode}</td>
                  <td>{formatWaktu(trx.tanggal || trx.created_at || trx.updated_at)}</td>
                  <td>{trx.kasir?.nama || trx.nama_kasir || "-"}</td>
                  <td>{jumlah}</td>
                  <td>{trx.tipe_harga || trx.metode_bayar || "-"}</td>
                  <td className="td-bold">{fmt(Number(trx.total || 0))}</td>
                </tr>
              );
            })}
            {pagedTransaksi.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px 0", color: "#bbb" }}>
                  Tidak ada transaksi ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="lap-pagination">
          <div className="lap-pages">
            <button className="lap-pgbtn arrow" onClick={() => goToPage(page - 1)} disabled={page === 1}>
              <ChevronLeft size={14} />
            </button>
            {pageNumbers.map((p) => (
              <button
                key={p}
                className={`lap-pgbtn ${p === page ? "active" : ""}`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}
            <button className="lap-pgbtn arrow" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Produk Terlaris ── */}
      <div className="lap-card">
        <span className="lap-card-title">Produk Terlaris</span>
        <div className="lap-produk-list">
          {produkTerlaris.map((p, i) => (
            <div className="lap-produk-row" key={i}>
              <div className="lap-produk-info">
                <div className="lap-produk-name">{p.nama}</div>
                <div className="lap-produk-sub">{p.kategori || "-"}</div>
              </div>
              <div className="lap-bar-wrap">
                <div className="lap-bar-track">
                  <div className="lap-bar-fill" style={{ width: `${p.percent}%` }} />
                </div>
              </div>
              <div className="lap-pcs">{p.qty} pcs</div>
            </div>
          ))}
          {produkTerlaris.length === 0 && (
            <p style={{ color: "#bbb", fontSize: 13 }}>Belum ada data produk terjual</p>
          )}
        </div>
      </div>

      <Modal isOpen={detailOpen} onClose={closeDetail} title={`Detail ${selectedTransaction?.kode_transaksi || ""}`}>
        <div style={{ padding: "12px 0" }}>
          <div style={{ marginBottom: 12 }}><strong>Kode:</strong> {selectedTransaction?.kode_transaksi || "-"}</div>
          <div style={{ marginBottom: 12 }}><strong>Tanggal:</strong> {formatDateTime(selectedTransaction?.tanggal || selectedTransaction?.created_at)}</div>
          <div style={{ marginBottom: 12 }}><strong>Kasir:</strong> {selectedTransaction?.kasir?.nama || selectedTransaction?.nama_kasir || "-"}</div>
          <div style={{ marginBottom: 12 }}><strong>Tipe Harga:</strong> {selectedTransaction?.tipe_harga || selectedTransaction?.metode_bayar || "-"}</div>
          <table className="lap-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Qty</th>
                <th>Harga</th>
                <th className="th-orange">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detailItems.map((item, idx) => {
                const name = item.produk?.nama_produk || item.nama_produk || item.nama || "-";
                const harga = Number(item.harga || item.harga_eceran || 0);
                const subtotalItem = Number(item.subtotal ?? ((item.qty || 0) * harga) ?? 0);
                return (
                  <tr key={idx}>
                    <td>{name}</td>
                    <td>{item.qty || 0}</td>
                    <td>{fmt(harga)}</td>
                    <td className="td-bold">{fmt(subtotalItem)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

export default Laporan;