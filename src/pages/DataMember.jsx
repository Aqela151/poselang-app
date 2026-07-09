import { useState, useEffect } from "react";
import api from "../services/api";
import { Pencil, Trash2, Search, ChevronDown, Plus } from "lucide-react";
import Card from "../components/Card/Card";
import TambahMemberModal from "../components/TambahMemberModal/TambahMemberModal";
import EditMemberModal from "../components/EditMemberModal/EditMemberModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal/DeleteConfirmModal";
import "./DataMember.css";


const levelLabel = { silver: "Silver", gold: "Gold", platinum: "Platinum" };

function DataMember() {
  const [members, setMembers] = useState([]);
  const [tambahOpen, setTambahOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
  getMember();
}, []);

const getMember = async () => {
  try {
    const res = await api.get("/member");
    setMembers(res.data);
  } catch (err) {
    console.log(err);
  }
};

  const handleEdit = (member) => {
    setSelectedMember(member);
    setEditOpen(true);
  };

  const handleDelete = (member) => {
    setSelectedMember(member);
    setDeleteOpen(true);
  };

  const handleSaveEdit = (updated) => {
  setMembers((prev) =>
    prev.map((m) => (m.id === updated.id ? updated : m))
  );
};

  const handleConfirmDelete = async (target) => {
  try {
    await api.delete(`/member/${target.id}`);

    setMembers((prev) =>
      prev.filter((m) => m.id !== target.id)
    );

    alert("Member berhasil dihapus");
  } catch (err) {
    console.log(err);
    alert("Gagal menghapus member");
  }
};

  const silverCount = members.filter((m) => m.level.toLowerCase() === "silver").length;
  const goldCount = members.filter((m) => m.level.toLowerCase() === "gold").length;
  const platinumCount = members.filter((m) => m.level.toLowerCase() === "platinum").length;
  const totalMembers = members.length || 1;

  const silverPercent = ((silverCount / totalMembers) * 100).toFixed(1);
  const goldPercent = ((goldCount / totalMembers) * 100).toFixed(1);
  const platinumPercent = ((platinumCount / totalMembers) * 100).toFixed(1);

  return (
    <div className="member-container">
      <div className="stats-cards">
        <Card
  title="Total Member"
  value={members.length}
  description="Member terdaftar"
/>
        <Card title="Silver" value={silverCount} description={`${silverPercent}% dari total`} />
        <Card title="Gold" value={goldCount} description={`${goldPercent}% dari total`} />
        <Card title="Platinum" value={platinumCount} description={`${platinumPercent}% dari total`} />
      </div>

      <div className="filter-box">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Cari nama member, nomor HP" />
        </div>
        <div className="filter-select">
          Semua Level <ChevronDown size={14} />
        </div>
        <div className="filter-select">
          Terbaru <ChevronDown size={14} />
        </div>
        <button className="add-btn" onClick={() => setTambahOpen(true)}>
          <Plus size={16} />
          Tambah Member
        </button>
      </div>

      <div className="member-table-card">
        <h3>Daftar Member</h3>
        <table>
          <thead>
            <tr>
              <th>MEMBER</th>
              <th>No.HP</th>
              <th>LEVEL</th>
              <th>TOTAL TRANSAKSI</th>
              <th>BERGABUNG</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
  {members.map((m) => (
    <tr key={m.id}>
      <td>
        <div className="member-name">{m.nama}</div>
        <div className="member-email">{m.email}</div>
      </td>

      <td>{m.no_hp}</td>

      <td>
        <span className={`level-badge ${m.level.toLowerCase()}`}>
  {levelLabel[m.level.toLowerCase()]}
</span>
      </td>

      <td>
        Rp {Number(m.total_transaksi).toLocaleString("id-ID")}
      </td>

      <td>
        {new Date(m.created_at).toLocaleDateString("id-ID")}
      </td>

      <td>
        <div className="aksi-btns">
          <Pencil size={16} onClick={() => handleEdit(m)} />
          <Trash2 size={16} onClick={() => handleDelete(m)} />
        </div>
      </td>
    </tr>
  ))}
</tbody>
        </table>

        <div className="pagination">
          <span className="pag-info">Halaman 1 dari 24</span>
          <div className="pag-pages">
            <button className="pag-btn arrow">‹</button>
            <button className="pag-btn active">1</button>
            <button className="pag-btn">2</button>
            <button className="pag-btn">3</button>
            <button className="pag-btn arrow">›</button>
          </div>
        </div>
      </div>

      <TambahMemberModal
  isOpen={tambahOpen}
  onClose={() => setTambahOpen(false)}
  onSuccess={getMember}
/>
      <EditMemberModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        member={selectedMember}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        member={selectedMember}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default DataMember;