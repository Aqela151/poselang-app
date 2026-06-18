import "./Dashboard.css";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const omsetData = [
  { year: "2016", value: 8000 },
  { year: "2017", value: 15000 },
  { year: "2018", value: 28000 },
  { year: "2019", value: 52000 },
  { year: "2020", value: 32000 },
  { year: "2021", value: 44000 },
  { year: "2022", value: 58000 },
  { year: "2023", value: 95000 },
];

function Dashboard() {
  return (
    <div className="dashboard-content">

      {/* ── Stat cards ── */}
      <div className="cards">
        <div className="card">
          <span>Omset</span>
          <h2>2.000.000</h2>
          <p>Total semua cabang</p>
        </div>
        <div className="card">
          <span>Total Transaksi</span>
          <h2>123</h2>
          <p>Struk tercetak hari ini</p>
        </div>
        <div className="card">
          <span>Member Aktif</span>
          <h2>234</h2>
          <p>+6 Member bulan ini</p>
        </div>
        <div className="card">
          <span>Stok Kritis</span>
          <h2>4 Item</h2>
          <p>Perlu restock segera</p>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Omset</h3>
          <span className="chart-filter">Yearly ▾</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={omsetData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="omsetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#FFCD71" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#FFCD71" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#bbb" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#bbb" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #ececec" }}
              formatter={(v) => [`${v.toLocaleString()}`, "Omset"]}
            />
            <Area
              type="monotone" dataKey="value"
              stroke="#FFCD71" strokeWidth={2.5}
              fill="url(#omsetGrad)" dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom section ── */}
      <div className="bottom-section">

        {/* Performa Cabang */}
        <div className="table-box">
          <h3>Performa Cabang</h3>
          {[
            { name: "Blimbing",  val: "120 JT", w: "100%" },
            { name: "Kepanjen",  val: "80 JT",  w: "80%"  },
            { name: "Turen",     val: "70 JT",  w: "65%"  },
            { name: "Singosari", val: "50 JT",  w: "48%"  },
          ].map((b) => (
            <div className="branch-row" key={b.name}>
              <div className="branch-bar" style={{ width: b.w }}>
                <span>{b.name}</span>
                <strong>{b.val}</strong>
              </div>
            </div>
          ))}
        </div>

      {/* Stok Menipis */}
<div className="stock-box">
  <h3>Stok Menipis</h3>
  {[
    { name: "Aki Incoe N50", sub: "Aki Kering", qty: "5 pcs", min: "Min: 15 pcs" },
    { name: "Aki Incoe N50", sub: "Aki Kering", qty: "5 pcs", min: "Min: 15 pcs" },
    { name: "Aki GS NS40Z", sub: "Aki Basah", qty: "5 pcs", min: "Min: 15 pcs" },
  ].map((s, i) => (
    <div className="stock-item" key={`${s.name}-${s.sub}-${i}`}>
      <div className="stock-left">
        <div>
          <h4>{s.name}</h4>
          <p>{s.sub}</p>
        </div>
      </div>

      <div className="stock-right">
        <strong>{s.qty}</strong>
        <span>{s.min}</span>
      </div>
    </div>
  ))}
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
            {[
              { no: "#TRX-2026-00847", waktu: "10:42 WIB", jml: 2, tipe: "Grosir",  total: "Rp. 1.000.000" },
              { no: "#TRX-2026-00847", waktu: "10:42 WIB", jml: 2, tipe: "Eceran",  total: "Rp. 1.000.000" },
              { no: "#TRX-2026-00847", waktu: "10:42 WIB", jml: 2, tipe: "Eceran",  total: "Rp. 1.000.000" },
              { no: "#TRX-2026-00847", waktu: "10:42 WIB", jml: 2, tipe: "Eceran",  total: "Rp. 1.000.000" },
            ].map((t, i) => (
              <tr key={i}>
                <td>{t.no}</td>
                <td>{t.waktu}</td>
                <td>{t.jml}</td>
                <td>{t.tipe}</td>
                <td>{t.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;