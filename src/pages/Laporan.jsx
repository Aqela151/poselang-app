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
  const [produkList, setProdukList] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [branch, setBranch] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("daily"); // daily | weekly | monthly | yearly
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [chartTab, setChartTab] = useState("omset"); // omset | transaksi | item
  const [page, setPage] = useState(1);
  const pageSize = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produkRes, transaksiRes] = await Promise.all([
          api.get("/produk"),
          api.get("/transaksi/histori"),
        ]);
        setProdukList(produkRes.data || []);
        setTransaksi(transaksiRes.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const getDetail = (trx) => trx?.detail_transaksi || trx?.items || [];

  const categoryLabelMap = {
    1: "Aki Kering",
    2: "Aki Basah",
    3: "Aki Motor",
    4: "Kabel Aksesoris",
  };

  const getCategoryLabel = (item = {}) => {
    const rawValue =
      item?.produk?.kategori ||
      item?.kategori ||
      item?.produk?.kategori_name ||
      item?.kategori_name ||
      item?.produk?.category ||
      item?.category ||
      item?.produk?.kategori_id ||
      item?.kategori_id;

    if (typeof rawValue === "string" && rawValue.trim()) {
      return categoryLabelMap[Number(rawValue)] ?? rawValue;
    }

    const id = Number(item?.produk?.kategori_id ?? item?.kategori_id ?? item?.produk?.kategori ?? item?.kategori ?? 0);
    return categoryLabelMap[id] || "Lainnya";
  };

  const getProdukInfo = (item = {}) => {
    const productId = item?.produk_id ?? item?.produk?.id ?? item?.id_produk ?? item?.product_id;
    const matchedProduct =
      (productId && produkList.find((p) => Number(p.id) === Number(productId))) ||
      (item?.produk?.id && produkList.find((p) => Number(p.id) === Number(item.produk.id))) ||
      null;

    const nama =
      matchedProduct?.nama_produk ||
      item?.produk?.nama_produk ||
      item?.nama_produk ||
      item?.nama ||
      item?.produk?.name ||
      item?.name ||
      "-";

    const kategori =
      matchedProduct?.kategori_name ||
      matchedProduct?.kategori ||
      item?.produk?.kategori ||
      item?.kategori ||
      getCategoryLabel(item);

    const harga = Number(
      item?.harga ??
        item?.harga_eceran ??
        matchedProduct?.harga_eceran ??
        item?.produk?.harga_eceran ??
        0
    );

    const hargaGrosir = Number(
      matchedProduct?.harga_grosir ??
        item?.harga_grosir ??
        item?.produk?.harga_grosir ??
        0
    );

    const kode = matchedProduct?.kode_produk || item?.produk?.kode_produk || item?.kode_produk || "";

    return { nama, kategori, harga, hargaGrosir, kode, matchedProduct };
  };

  const filteredTransaksi = transaksi.filter((t) => {
    const keyword = search.toLowerCase();
    const detail = getDetail(t);
    const productNames = detail.map((item) => getProdukInfo(item).nama).join(" ").toLowerCase();
    // basic keyword match
    const matchesKeyword = (
      (t.kode_transaksi || "") + " " +
      (t.kasir?.nama || t.nama_kasir || "") + " " +
      (t.tipe_harga || t.metode_bayar || "") + " " +
      productNames
    ).toLowerCase().includes(keyword);

    // date range filter
    const raw = t.tanggal || t.created_at || t.updated_at;
    let matchesDate = true;
    if (raw && (dateFrom || dateTo)) {
      const d = new Date(raw);
      if (dateFrom) matchesDate = matchesDate && d >= new Date(dateFrom + "T00:00:00");
      if (dateTo) matchesDate = matchesDate && d <= new Date(dateTo + "T23:59:59");
    }

    // branch filter
    const branchName = (t.cabang?.nama || t.cabang || t.cabang_name || t.branch || t.branch_name || "").toString();
    const matchesBranch = branch === "all" ? true : branchName === branch;

    return matchesKeyword && matchesDate && matchesBranch;
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
    // group by periodFilter (daily, weekly, monthly, yearly)
    const getKey = (d) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      if (periodFilter === "monthly") return `${yyyy}-${mm}`;
      if (periodFilter === "yearly") return `${yyyy}`;
      if (periodFilter === "weekly") {
        // approximate week label by the Monday of that week
        const tmp = new Date(d.valueOf());
        const day = (d.getDay() + 6) % 7; // Mon=0
        tmp.setDate(d.getDate() - day);
        return tmp.toISOString().slice(0, 10);
      }
      return `${yyyy}-${mm}-${dd}`;
    };

    transaksi.forEach((trx) => {
      const raw = trx.tanggal || trx.created_at || trx.updated_at;
      if (!raw) return;
      const d = new Date(raw);
      const key = getKey(d);
      if (!map[key]) map[key] = { date: d, omset: 0, transaksi: 0, item: 0, label: key };
      map[key].omset += Number(trx.total || 0);
      map[key].transaksi += 1;
      map[key].item += getDetail(trx).reduce((s, it) => s + Number(it.qty || 0), 0);
    });
    return Object.values(map).sort((a, b) => a.date - b.date);
  }, [transaksi, periodFilter]);
  
  // compute branch options from transaksi
  const branchOptions = useMemo(() => {
    const set = new Set();
    transaksi.forEach((t) => {
      const name = (t.cabang?.nama || t.cabang || t.cabang_name || t.branch || t.branch_name || "").toString();
      if (name) set.add(name);
    });
    return ["all", ...Array.from(set)];
  }, [transaksi]);

  // Export CSV of filteredTransaksi (full filtered set, not paginated)
  const exportCSV = () => {
    const rows = [];
    rows.push(["Kode","Tanggal","Kasir","Jumlah","Total","Tipe Harga"]); 
    filteredTransaksi.forEach((t) => {
      const detail = getDetail(t);
      const jumlah = detail.reduce((s, it) => s + Number(it.qty || 0), 0);
      rows.push([
        t.kode_transaksi || t.kode || "",
        formatDateTime(t.tanggal || t.created_at || t.updated_at),
        t.kasir?.nama || t.nama_kasir || "",
        jumlah,
        Number(t.total || 0),
        t.tipe_harga || t.metode_bayar || "",
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildPrintHTML = (title = "Laporan") => {
    const rows = filteredTransaksi.map((t) => {
      const detail = getDetail(t);
      const jumlah = detail.reduce((s, it) => s + Number(it.qty || 0), 0);
      return `
        <tr>
          <td>${t.kode_transaksi || t.kode || ""}</td>
          <td>${formatDateTime(t.tanggal || t.created_at || t.updated_at)}</td>
          <td>${t.kasir?.nama || t.nama_kasir || ""}</td>
          <td>${jumlah}</td>
          <td>${fmt(Number(t.total || 0))}</td>
        </tr>`;
    }).join("");

    return `
      <html>
      <head>
        <title>${title}</title>
        <style>
          body{font-family: Arial, Helvetica, sans-serif; padding:20px; color:#111}
          h1{font-size:18px}
          table{width:100%; border-collapse:collapse; margin-top:12px}
          th,td{border:1px solid #ddd; padding:8px; text-align:left}
          th{background:#f5f5f5}
        </style>
      </head>
      <body onload="window.focus(); window.print();">
        <h1>${title}</h1>
        <table>
          <thead>
            <tr><th>Kode</th><th>Tanggal</th><th>Kasir</th><th>Jumlah</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
      </html>`;
  };

  const printData = () => {
  const html = buildPrintHTML("Laporan - Cetak");
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank", "noopener,noreferrer,width=900,height=700");
  if (!w) {
    alert("Popup diblokir browser. Izinkan popup untuk situs ini lalu coba lagi.");
    return;
  }
  // bersihin url setelah window kebuka & selesai print
  w.addEventListener("load", () => {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
};
  const exportPDF = () => {
    // generate PDF using pdf-lib loaded from CDN and download directly
    const loadPdfLib = () =>
      new Promise((resolve, reject) => {
        if (window.PDFLib) return resolve(window.PDFLib);
        const s = document.createElement("script");
        s.src = "https://unpkg.com/pdf-lib/dist/pdf-lib.min.js";
        s.async = true;
        s.onload = () => (window.PDFLib ? resolve(window.PDFLib) : reject(new Error("pdf-lib failed to load")));
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });

    (async () => {
      try {
        const PDFLib = await loadPdfLib();
        const { PDFDocument, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pageSize = [595.28, 841.89]; // A4

        const rows = filteredTransaksi.map((t) => {
          const detail = getDetail(t);
          const jumlah = detail.reduce((s, it) => s + Number(it.qty || 0), 0);
          return [t.kode_transaksi || t.kode || "", formatDateTime(t.tanggal || t.created_at || t.updated_at), t.kasir?.nama || t.nama_kasir || "", String(jumlah), fmt(Number(t.total || 0))];
        });

        const perPage = 40;
        const totalPagesPdf = Math.max(1, Math.ceil(rows.length / perPage));
        for (let p = 0; p < totalPagesPdf; p++) {
          const page = pdfDoc.addPage(pageSize);
          const { width, height } = page.getSize();
          let y = height - 50;
          page.drawText("Laporan", { x: 50, y, size: 16, font });
          y -= 22;
          // header
          const header = ["Kode", "Tanggal", "Kasir", "Jumlah", "Total"];
          const xs = [50, 160, 300, 430, 490];
          header.forEach((h, i) => page.drawText(h, { x: xs[i], y, size: 10, font }));
          y -= 14;
          const start = p * perPage;
          const end = Math.min(rows.length, start + perPage);
          for (let i = start; i < end; i++) {
            const r = rows[i];
            page.drawText(r[0], { x: xs[0], y, size: 10, font });
            page.drawText(r[1], { x: xs[1], y, size: 10, font });
            page.drawText(r[2], { x: xs[2], y, size: 10, font });
            page.drawText(r[3], { x: xs[3], y, size: 10, font });
            page.drawText(r[4], { x: xs[4], y, size: 10, font });
            y -= 14;
            if (y < 40) break;
          }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `laporan_${new Date().toISOString().slice(0,10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Export PDF failed", err);
        // fallback to print dialog
        printData();
      }
    })();
  };

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

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setBranch("all");
    setPeriodFilter("daily");
    setSearch("");
    setPage(1);
    setChartTab("omset");
  };

  /* ── Produk Terlaris ── */
  const produkTerlaris = useMemo(() => {
    const map = {};
    transaksi.forEach((trx) => {
      getDetail(trx).forEach((item) => {
        const itemInfo = getProdukInfo(item);
        const nama = itemInfo.nama;
        const kategori = itemInfo.kategori;
        const qty = Number(item.qty || 0);
        if (!map[nama]) map[nama] = { nama, kategori, qty: 0 };
        map[nama].qty += qty;
      });
    });
    const list = Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const maxQty = Math.max(1, ...list.map((p) => p.qty));
    return list.map((p) => ({ ...p, percent: Math.round((p.qty / maxQty) * 100) }));
  }, [transaksi, produkList]);

  return (
    <div className="lap-wrap">
      <div className="lap-header">
        <h2 className="lap-title">Laporan</h2>
        <div className="lap-header-btns">
          <button className="lap-btn-outline" onClick={printData}>
            <Printer size={14} /> Print
          </button>
          <button className="lap-btn-outline" onClick={exportCSV}>
            <FileSpreadsheet size={14} /> Excel
          </button>
          <button className="lap-btn-export" onClick={exportPDF}>
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="lap-filterbar">
        <span className="lap-flabel">Dari</span>
        <input className="lap-dateinput" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <span className="lap-flabel">s/d</span>
        <input className="lap-dateinput" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <span className="lap-flabel">Cabang</span>
        <select className="lap-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
          {branchOptions.map((b, i) => (
            <option key={i} value={b}>{b === "all" ? "Semua Cabang" : b}</option>
          ))}
        </select>
        <div className="lap-period">
          <button type="button" className={`lap-periodb ${periodFilter === "daily" ? "active" : ""}`} onClick={() => setPeriodFilter("daily")}>Harian</button>
          <button type="button" className={`lap-periodb ${periodFilter === "weekly" ? "active" : ""}`} onClick={() => setPeriodFilter("weekly")}>Mingguan</button>
          <button type="button" className={`lap-periodb ${periodFilter === "monthly" ? "active" : ""}`} onClick={() => setPeriodFilter("monthly")}>Bulanan</button>
          <button type="button" className={`lap-periodb ${periodFilter === "yearly" ? "active" : ""}`} onClick={() => setPeriodFilter("yearly")}>Tahunan</button>
        </div>
        <button type="button" className="lap-resetbtn" onClick={resetFilters}><RefreshCw size={13} /> Reset</button>
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
              const firstItemInfo = detail.length > 0 ? getProdukInfo(detail[0]) : { harga: 0 };
              return (
                <tr key={trx.id || index} onClick={() => openDetail(trx)} style={{ cursor: "pointer" }}>
                  <td className="td-gray">{trx.kode_transaksi || trx.kode}</td>
                  <td>{formatWaktu(trx.tanggal || trx.created_at || trx.updated_at)}</td>
                  <td>{trx.kasir?.nama || trx.nama_kasir || "-"}</td>
                  <td>{jumlah}</td>
                  <td>{detail.length > 0 ? fmt(firstItemInfo.harga) : "-"}</td>
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
                const itemInfo = getProdukInfo(item);
                const harga = Number(itemInfo.harga);
                const subtotalItem = Number(item.subtotal ?? ((item.qty || 0) * harga) ?? 0);
                return (
                  <tr key={idx}>
                    <td>{itemInfo.nama}</td>
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