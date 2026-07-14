import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../services/api";

const fmt = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

const categoryLabelMap = {
  1: "Aki Kering",
  2: "Aki Basah",
  3: "Aki Motor",
  4: "Kabel Aksesoris",
};

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produkRes, memberRes, transaksiRes] = await Promise.all([
          api.get("/produk"),
          api.get("/member"),
          api.get("/transaksi/histori"),
        ]);

        setProducts(produkRes.data || []);
        setMembers(memberRes.data || []);
        setTransactions(transaksiRes.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const getCategoryLabel = (product) => {
    const rawValue = product.kategori_name || product.kategori || product.category_name || product.category || product.kategori_id;

    if (typeof rawValue === "string" && rawValue.trim()) {
      return categoryLabelMap[Number(rawValue)] ?? rawValue;
    }

    const id = Number(product.kategori_id ?? product.kategori ?? 0);
    return categoryLabelMap[id] || "Lainnya";
  };

  const getStockStatus = (stok) => {
    if (Number(stok) === 0) return "habis";
    if (Number(stok) < 10) return "menipis";
    return "aman";
  };

  const getDetail = (trx) => trx?.detail_transaksi || trx?.items || [];

  const totalOmset = useMemo(
    () => transactions.reduce((sum, trx) => sum + Number(trx.total || 0), 0),
    [transactions]
  );

  const totalTransactions = transactions.length;
  const activeMembers = members.length;
  const stockKritis = products.filter((p) => getStockStatus(p.stok) !== "aman").length;

  const omsetData = useMemo(() => {
    const map = {};

    transactions.forEach((trx) => {
      const raw = trx.tanggal || trx.created_at || trx.updated_at;
      if (!raw) return;

      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleString("id-ID", { month: "short", year: "2-digit" });

      if (!map[key]) {
        map[key] = { month: key, label, value: 0 };
      }

      map[key].value += Number(trx.total || 0);
    });

    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  }, [transactions]);

  const branchData = useMemo(() => {
    const map = {};

    transactions.forEach((trx) => {
      const branchName =
        trx.cabang?.nama ||
        trx.cabang_name ||
        trx.branch?.nama ||
        trx.branch_name ||
        "Cabang Utama";

      if (!map[branchName]) {
        map[branchName] = { name: branchName, value: 0 };
      }

      map[branchName].value += Number(trx.total || 0);
    });

    const list = Object.values(map).sort((a, b) => b.value - a.value).slice(0, 4);
    const maxValue = Math.max(1, ...list.map((item) => item.value));

    return list.map((item) => ({
      ...item,
      val: fmt(item.value),
      w: `${Math.max(25, Math.round((item.value / maxValue) * 100))}%`,
    }));
  }, [transactions]);

  const criticalStockItems = useMemo(() => {
    return products
      .filter((p) => getStockStatus(p.stok) !== "aman")
      .sort((a, b) => Number(a.stok) - Number(b.stok))
      .slice(0, 3);
  }, [products]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.tanggal || b.created_at || b.updated_at) - new Date(a.tanggal || a.created_at || a.updated_at))
      .slice(0, 4);
  }, [transactions]);

  const formatWaktu = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}.${mm} WIB`;
  };

  return (
    <div className="dashboard-content">
      {/* ── Stat cards ── */}
      <div className="cards">
        <div className="card">
          <span>Omset</span>
          <h2>{fmt(totalOmset)}</h2>
          <p>Total semua transaksi</p>
        </div>
        <div className="card">
          <span>Total Transaksi</span>
          <h2>{totalTransactions}</h2>
          <p>Transaksi tersimpan</p>
        </div>
        <div className="card">
          <span>Member Aktif</span>
          <h2>{activeMembers}</h2>
          <p>Member terdaftar</p>
        </div>
        <div className="card">
          <span>Stok Kritis</span>
          <h2>{stockKritis} Item</h2>
          <p>Perlu restock segera</p>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Omset</h3>
          <span className="chart-filter">Bulanan ▾</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={omsetData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="omsetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFCD71" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#FFCD71" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#bbb" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#bbb" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #ececec" }}
              formatter={(value) => [fmt(value), "Omset"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFCD71"
              strokeWidth={2.5}
              fill="url(#omsetGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom section ── */}
      <div className="bottom-section">
        {/* Performa Cabang */}
        <div className="table-box">
          <h3>Performa Cabang</h3>
          {branchData.length > 0 ? (
            branchData.map((b) => (
              <div className="branch-row" key={b.name}>
                <div className="branch-bar" style={{ width: b.w }}>
                  <span>{b.name}</span>
                  <strong>{b.val}</strong>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#888", fontSize: 13 }}>Belum ada data cabang</p>
          )}
        </div>

        {/* Stok Menipis */}
        <div className="stock-box">
          <h3>Stok Menipis</h3>
          {criticalStockItems.length > 0 ? (
            criticalStockItems.map((s, i) => (
              <div className="stock-item" key={`${s.id || i}`}>
                <div className="stock-left">
                  <div>
                    <h4>{s.nama_produk}</h4>
                    <p>{getCategoryLabel(s)}</p>
                  </div>
                </div>

                <div className="stock-right">
                  <strong>{s.stok} pcs</strong>
                  <span>{Number(s.stok) === 0 ? "Min: 0 pcs" : `Min: 10 pcs`}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#888", fontSize: 13 }}>Tidak ada stok kritis</p>
          )}
        </div>
      </div>

      {/* ── Transaksi Terakhir ── */}
      <div className="transaction-box">
        <h3>Transaksi Terakhir</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Waktu</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((t, i) => {
              const detail = getDetail(t);
              const jumlah = detail.reduce((sum, item) => sum + Number(item.qty || 0), 0);
              return (
                <tr key={t.id || i}>
                  <td>{t.kode_transaksi || `#TRX-${i + 1}`}</td>
                  <td>{formatWaktu(t.tanggal || t.created_at || t.updated_at)}</td>
                  <td>{jumlah}</td>
                  <td>{t.tipe_harga || t.metode_bayar || "-"}</td>
                  <td>{fmt(Number(t.total || 0))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;