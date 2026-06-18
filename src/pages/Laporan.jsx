import { Printer, FileSpreadsheet, FileText, Search, RefreshCw, ChevronDown } from "lucide-react";
import Card from "../components/Card/Card";
import "./Laporan.css";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const transaksi = [
  { no: "#TRX-2026-00847", waktu: "10:42 WIB", kasir: "Siti R.",   jumlah: 2, harga: "Grosir", total: "Rp.2.000.000" },
  { no: "#TRX-2026-00846", waktu: "09:30 WIB", kasir: "Ahmad P.", jumlah: 1, harga: "Eceran", total: "Rp.1.010.000" },
  { no: "#TRX-2026-00845", waktu: "09:15 WIB", kasir: "Alex B.",  jumlah: 3, harga: "Grosir", total: "Rp.1.030.000" },
  { no: "#TRX-2026-00845", waktu: "08:55 WIB", kasir: "Siti R.",  jumlah: 1, harga: "Eceran", total: "Rp.580.000"   },
  { no: "#TRX-2026-00844", waktu: "08:20 WIB", kasir: "Ahmad P.", jumlah: 4, harga: "Grosir", total: "Rp.4.040.000" },
  { no: "#TRX-2026-00843", waktu: "07:44 WIB", kasir: "Alex B.",  jumlah: 2, harga: "Eceran", total: "Rp.2.020.000" },
  { no: "#TRX-2026-00842", waktu: "07:10 WIB", kasir: "Siti R.",  jumlah: 1, harga: "Eceran", total: "Rp.245.000"   },
];

const produkTerlaris = [
  { name: "GS Astra MF NS40Z", sub: "Aki Kering", pcs: 48, persen: 100 },
  { name: "GS Astra MF NS60",  sub: "Aki Kering", pcs: 38, persen: 79  },
  { name: "Incoe N50",         sub: "Aki Basah",  pcs: 28, persen: 58  },
  { name: "Bosch S4 007",      sub: "Aki Kering", pcs: 20, persen: 42  },
  { name: "Yuasa YB5L-B",      sub: "Aki Motor",  pcs: 12, persen: 25  },
];

const omsetData = [
  { label: "1 Mei",  value: 10000 },
  { label: "3 Mei",  value: 18000 },
  { label: "5 Mei",  value: 15000 },
  { label: "7 Mei",  value: 25000 },
  { label: "9 Mei",  value: 22000 },
  { label: "11 Mei", value: 35000 },
  { label: "13 Mei", value: 30000 },
  { label: "15 Mei", value: 42000 },
];

function Laporan() {
  return (
    <div className="lap-wrap">

      {/* Header */}
      <div className="lap-header">
        <h2 className="lap-title">Laporan</h2>
        <div className="lap-header-btns">
          <button className="lap-btn-outline"><Printer size={14}/> Print</button>
          <button className="lap-btn-outline"><FileSpreadsheet size={14}/> Excel</button>
          <button className="lap-btn-export"><FileText size={14}/> Export PDF</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="lap-filterbar">
        <span className="lap-flabel">Dari</span>
        <input className="lap-dateinput" type="date" defaultValue="2026-05-01"/>
        <span className="lap-flabel">s/d</span>
        <input className="lap-dateinput" type="date" defaultValue="2026-05-15"/>
        <span className="lap-flabel">Cabang</span>
        <div className="lap-select">Semua Cabang <ChevronDown size={13}/></div>
        <div className="lap-period">
          <button className="lap-periodb active">Harian</button>
          <button className="lap-periodb">Mingguan</button>
          <button className="lap-periodb">Bulanan</button>
          <button className="lap-periodb">Tahunan</button>
        </div>
        <button className="lap-resetbtn"><RefreshCw size={13}/> Reset</button>
      </div>

      {/* Stats */}
      <div className="lap-stats">
        <Card title="Omset"            value="2.000.000" description="+12,4% dari kemarin"/>
        <Card title="Total Transaksi"  value="123"       description="Struk tercetak hari ini"/>
        <Card title="Item Terjual"     value="348"       description="+24 item dari kemarin"/>
        <Card title="Rata-rata Transaksi" value="16.260" description="Per transaksi"/>
      </div>

      {/* Chart — sama persis seperti Dashboard */}
      <div className="lap-card">
        <div className="lap-chart-header">
          <span className="lap-card-title">Omset</span>
          <div className="lap-chart-tabs">
            <button className="lap-charttab active">Omset</button>
            <button className="lap-charttab">Transaksi</button>
            <button className="lap-charttab">Item Terjual</button>
          </div>
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
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#bbb" }} axisLine={false} tickLine={false} />
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

      {/* Transaksi */}
      <div className="lap-card">
        <div className="lap-table-header">
          <span className="lap-card-title">Transaksi</span>
          <div className="lap-searchbox">
            <input type="text" placeholder="Cari transaksi..."/>
            <Search size={14} color="#aaa"/>
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
            {transaksi.map((t,i)=>(
              <tr key={i}>
                <td className="td-gray">{t.no}</td>
                <td>{t.waktu}</td>
                <td>{t.kasir}</td>
                <td>{t.jumlah}</td>
                <td>{t.harga}</td>
                <td className="td-bold">{t.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lap-pagination">
          <div className="lap-pages">
            <button className="lap-pgbtn arrow">‹</button>
            <button className="lap-pgbtn active">1</button>
            <button className="lap-pgbtn">2</button>
            <button className="lap-pgbtn">3</button>
            <button className="lap-pgbtn arrow">›</button>
          </div>
        </div>
      </div>

      {/* Produk Terlaris */}
      <div className="lap-card">
        <span className="lap-card-title">Produk Terlaris</span>
        <div className="lap-produk-list">
          {produkTerlaris.map((p,i)=>(
            <div className="lap-produk-row" key={i}>
              <div className="lap-produk-info">
                <div className="lap-produk-name">{p.name}</div>
                <div className="lap-produk-sub">{p.sub}</div>
              </div>
              <div className="lap-bar-wrap">
                <div className="lap-bar-track">
                  <div className="lap-bar-fill" style={{width:`${p.persen}%`}}/>
                </div>
              </div>
              <span className="lap-pcs">{p.pcs} pcs</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Laporan;