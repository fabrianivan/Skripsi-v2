"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Layers,
  Activity,
  FileSpreadsheet,
  Network,
  Plus,
  Trash2,
  Edit2,
  KeyRound,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  LogOut,
  Stethoscope,
  Eye,
} from "lucide-react";
import {
  api,
  getAuthToken,
  getSavedAdmin,
  removeAuthToken,
  AdminUser,
  Kategori,
  Penyakit,
  Gejala,
  RekamMedikGrouped,
  RuleItem,
} from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("penyakit");
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Data states
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [penyakits, setPenyakits] = useState<Penyakit[]>([]);
  const [gejalas, setGejalas] = useState<Gejala[]>([]);
  const [rekamMediks, setRekamMediks] = useState<RekamMedikGrouped[]>([]);
  const [rules, setRules] = useState<RuleItem[]>([]);

  // Notifications
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for modals or inline inserts
  const [adminForm, setAdminForm] = useState({ name: "", username: "", password: "" });
  const [kategoriForm, setKategoriForm] = useState({ nama: "" });
  const [penyakitForm, setPenyakitForm] = useState({ kategori_id: 1, nama_penyakit: "", solusi: "" });
  const [gejalaForm, setGejalaForm] = useState({
    kategori_id: 1,
    parent_id: 0,
    nama_gejala: "",
    gambar_gejala: "notfound.jpg",
    interval: 0.5,
  });
  const [rmForm, setRmForm] = useState<{ kategori_id: number; id_penyakit: number; list_gejala: number[] }>({
    kategori_id: 1,
    id_penyakit: 1,
    list_gejala: [],
  });

  // Check auth on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setCurrentUser(getSavedAdmin());
    loadAllData();
  }, [router]);

  const loadAllData = async () => {
    try {
      const [adm, kat, pen, gej, rm, r] = await Promise.all([
        api.getAdmins().catch(() => []),
        api.getKategori().catch(() => []),
        api.getPenyakit().catch(() => []),
        api.getAllGejala().catch(() => []),
        api.getRekamMedik().catch(() => []),
        api.getRules().catch(() => []),
      ]);
      setAdmins(adm);
      setKategoris(kat);
      setPenyakits(pen);
      setGejalas(gej);
      setRekamMediks(rm);
      setRules(r);
    } catch (err) {
      console.error(err);
    }
  };

  const showMsg = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // ADMIN ACTIONS
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdmin(adminForm);
      showMsg("Admin baru berhasil ditambahkan!");
      setAdminForm({ name: "", username: "", password: "" });
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm("Hapus admin ini?")) return;
    try {
      await api.deleteAdmin(id);
      showMsg("Admin berhasil dihapus");
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  // KATEGORI ACTIONS
  const handleCreateKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createKategori(kategoriForm.nama);
      showMsg("Kategori berhasil ditambahkan!");
      setKategoriForm({ nama: "" });
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  const handleDeleteKategori = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      await api.deleteKategori(id);
      showMsg("Kategori berhasil dihapus");
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  // PENYAKIT ACTIONS
  const handleCreatePenyakit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPenyakit(penyakitForm);
      showMsg("Penyakit baru berhasil ditambahkan!");
      setPenyakitForm({ kategori_id: 1, nama_penyakit: "", solusi: "" });
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  const handleDeletePenyakit = async (id: number) => {
    if (!confirm("Hapus penyakit ini?")) return;
    try {
      await api.deletePenyakit(id);
      showMsg("Penyakit berhasil dihapus");
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  // GEJALA ACTIONS
  const handleCreateGejala = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createGejala(gejalaForm);
      showMsg("Gejala baru berhasil ditambahkan!");
      setGejalaForm({
        kategori_id: 1,
        parent_id: 0,
        nama_gejala: "",
        gambar_gejala: "notfound.jpg",
        interval: 0.5,
      });
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  const handleDeleteGejala = async (id: number) => {
    if (!confirm("Hapus gejala ini?")) return;
    try {
      await api.deleteGejala(id);
      showMsg("Gejala berhasil dihapus");
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  // REKAM MEDIK ACTIONS
  const handleCreateRekamMedik = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rmForm.list_gejala.length === 0) {
      showMsg("Pilih minimal 1 gejala untuk rekam medik", "error");
      return;
    }
    try {
      await api.createRekamMedik(rmForm);
      showMsg("Rekam medik baru tersimpan & rules otomatis diperbarui!");
      setRmForm({ kategori_id: 1, id_penyakit: 1, list_gejala: [] });
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  const handleDeleteRekamMedik = async (kode: string) => {
    if (!confirm(`Hapus seluruh rekam medik Kode RM-${kode}?`)) return;
    try {
      await api.deleteRekamMedik(kode);
      showMsg("Rekam medik terhapus");
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  const handleRecalculateRules = async () => {
    try {
      await api.recalculateRules();
      showMsg("Aturan (Rules) berhasil direkalkulasi dari basis rekam medik!");
      loadAllData();
    } catch (err: unknown) {
      showMsg((err as Error).message, "error");
    }
  };

  const tabs = [
    { id: "penyakit", label: "Penyakit & Solusi", icon: Stethoscope, count: penyakits.length },
    { id: "gejala", label: "Gejala & Interval", icon: Activity, count: gejalas.length },
    { id: "rekammedik", label: "Rekam Medik", icon: FileSpreadsheet, count: rekamMediks.length },
    { id: "rules", label: "Basis Aturan (Rules)", icon: Network, count: rules.length },
    { id: "kategori", label: "Kategori", icon: Layers, count: kategoris.length },
    { id: "users", label: "Admin Users", icon: Users, count: admins.length },
  ];

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {/* Top Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: "6px" }}>
            Pusat Kendali Pakar
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
            Dashboard Manajemen Sistem Pakar
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Selamat datang, <strong>{currentUser?.name || "Admin"}</strong> ({currentUser?.username_admin}).
          </p>
        </div>

        <button
          onClick={() => {
            removeAuthToken();
            router.push("/");
          }}
          className="btn-secondary btn-sm"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <LogOut size={14} /> Keluar
        </button>
      </div>

      {/* Notification Toast */}
      {feedback && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 18px",
          borderRadius: "var(--radius-sm)",
          background: feedback.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
          border: feedback.type === "success" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(244, 63, 94, 0.3)",
          color: feedback.type === "success" ? "#34d399" : "#fb7185",
          fontSize: "0.9rem",
          fontWeight: 600,
          marginBottom: "24px",
        }}>
          {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {feedback.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        borderBottom: "1px solid var(--border-subtle)",
        paddingBottom: "12px",
        marginBottom: "32px",
        overflowX: "auto"
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: isActive ? "rgba(14, 165, 233, 0.15)" : "transparent",
                color: isActive ? "#38bdf8" : "var(--text-muted)",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap"
              }}
            >
              <Icon size={16} />
              {tab.label}
              <span style={{
                background: isActive ? "#0ea5e9" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                padding: "2px 7px",
                borderRadius: "999px",
                fontSize: "0.72rem"
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PENYAKIT & SOLUSI */}
      {activeTab === "penyakit" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          {/* Add form */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} color="#38bdf8" /> Tambah Penyakit Baru
            </h3>
            <form onSubmit={handleCreatePenyakit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Kategori:
                </label>
                <select
                  value={penyakitForm.kategori_id}
                  onChange={(e) => setPenyakitForm({ ...penyakitForm, kategori_id: Number(e.target.value) })}
                >
                  {kategoris.map((k) => (
                    <option key={k.kategori_penyakit} value={k.kategori_penyakit}>
                      {k.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Nama Penyakit:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Katarak Senilis"
                  value={penyakitForm.nama_penyakit}
                  onChange={(e) => setPenyakitForm({ ...penyakitForm, nama_penyakit: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Solusi &amp; Saran Medis:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tindakan medis / pengobatan yang direkomendasikan..."
                  value={penyakitForm.solusi}
                  onChange={(e) => setPenyakitForm({ ...penyakitForm, solusi: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: "8px" }}>
                Simpan Penyakit
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="glass-card" style={{ padding: "24px", overflowX: "auto" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
              Daftar Penyakit Mata ({penyakits.length})
            </h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Penyakit</th>
                  <th>Kategori</th>
                  <th>Solusi Medis</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {penyakits.map((p) => (
                  <tr key={p.id_penyakit}>
                    <td>#{p.id_penyakit}</td>
                    <td style={{ fontWeight: 600 }}>{p.nama_penyakit}</td>
                    <td>{p.kategori ? p.kategori.nama_kategori : "Penyakit Mata"}</td>
                    <td style={{ maxWidth: "260px", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      {p.solusi}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeletePenyakit(p.id_penyakit)}
                        className="btn-danger btn-sm"
                        style={{ cursor: "pointer", border: "none", borderRadius: "6px" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GEJALA & INTERVAL */}
      {activeTab === "gejala" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          {/* Add form */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} color="#38bdf8" /> Tambah Gejala Baru
            </h3>
            <form onSubmit={handleCreateGejala} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Tipe Induk / Parent:
                </label>
                <select
                  value={gejalaForm.parent_id}
                  onChange={(e) => setGejalaForm({ ...gejalaForm, parent_id: Number(e.target.value) })}
                >
                  <option value={0}>- Jadikan Sebagai Gejala Induk (Parent) -</option>
                  {gejalas
                    .filter((g) => g.parent_id === 0)
                    .map((p) => (
                      <option key={p.id_gejala} value={p.id_gejala}>
                        Induk: {p.nama_gejala}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Nama Gejala:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mata kiri sangat berbayang"
                  value={gejalaForm.nama_gejala}
                  onChange={(e) => setGejalaForm({ ...gejalaForm, nama_gejala: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Interval Default ({gejalaForm.interval}):
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={gejalaForm.interval}
                  onChange={(e) => setGejalaForm({ ...gejalaForm, interval: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Nama File Gambar:
                </label>
                <input
                  type="text"
                  placeholder="notfound.jpg atau mata-kiri-merah.jpg"
                  value={gejalaForm.gambar_gejala}
                  onChange={(e) => setGejalaForm({ ...gejalaForm, gambar_gejala: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: "8px" }}>
                Simpan Gejala
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="glass-card" style={{ padding: "24px", overflowX: "auto" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
              Daftar Gejala &amp; Konfigurasi Interval ({gejalas.length})
            </h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto Klinis</th>
                  <th>Nama Gejala</th>
                  <th>Hierarki</th>
                  <th>Interval</th>
                  <th>Min - Max</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {gejalas.map((g) => {
                  const parent = gejalas.find((p) => p.id_gejala === g.parent_id);
                  const img = g.gambar_gejala && g.gambar_gejala !== "notfound.jpg"
                    ? g.gambar_gejala
                    : parent?.gambar_gejala || "mata-berbayang.jpg";

                  return (
                    <tr key={g.id_gejala}>
                      <td>#{g.id_gejala}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            position: "relative",
                            border: "1px solid var(--border-subtle)",
                            background: "#090d16",
                            flexShrink: 0
                          }}>
                            <Image
                              src={`/images/${img}`}
                              alt={g.nama_gejala}
                              fill
                              sizes="40px"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", fontFamily: "monospace" }}>
                            {g.gambar_gejala || "default"}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{g.nama_gejala}</td>
                      <td>
                        {g.parent_id === 0 ? (
                          <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>Induk</span>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Anak dari: {parent?.nama_gejala}
                          </span>
                        )}
                      </td>
                      <td>{g.interval ? g.interval.toFixed(2) : "0.00"}</td>
                      <td>{g.min?.toFixed(1)} - {g.max?.toFixed(1)}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteGejala(g.id_gejala)}
                          className="btn-danger btn-sm"
                          style={{ cursor: "pointer", border: "none", borderRadius: "6px" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REKAM MEDIK */}
      {activeTab === "rekammedik" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          {/* Add form */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} color="#38bdf8" /> Input Kasus Rekam Medik Baru
            </h3>
            <form onSubmit={handleCreateRekamMedik} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Diagnosis Penyakit Terkonfirmasi:
                </label>
                <select
                  value={rmForm.id_penyakit}
                  onChange={(e) => setRmForm({ ...rmForm, id_penyakit: Number(e.target.value) })}
                >
                  {penyakits.map((p) => (
                    <option key={p.id_penyakit} value={p.id_penyakit}>
                      {p.nama_penyakit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Pilih Gejala Kasus Pasien ({rmForm.list_gejala.length} dipilih):
                </label>
                <div style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "10px",
                  background: "var(--bg-input)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                  {gejalas
                    .filter((g) => g.parent_id > 0)
                    .map((g) => {
                      const isChecked = rmForm.list_gejala.includes(g.id_gejala);
                      return (
                        <label key={g.id_gejala} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setRmForm((prev) => {
                                const exists = prev.list_gejala.includes(g.id_gejala);
                                return {
                                  ...prev,
                                  list_gejala: exists
                                    ? prev.list_gejala.filter((x) => x !== g.id_gejala)
                                    : [...prev.list_gejala, g.id_gejala],
                                };
                              });
                            }}
                          />
                          <span>{g.nama_gejala}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: "8px" }}>
                Simpan &amp; Sync Aturan
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="glass-card" style={{ padding: "24px", overflowX: "auto" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
              Riwayat Kasus Rekam Medik Pasien ({rekamMediks.length})
            </h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Kode Kasus</th>
                  <th>Diagnosis Penyakit</th>
                  <th>Gejala-Gejala Terdokumentasi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rekamMediks.map((rm) => (
                  <tr key={rm.kode}>
                    <td>
                      <span className="badge badge-blue">RM-{rm.kode}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{rm.nama_penyakit}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                      {rm.gejala_teks}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteRekamMedik(rm.kode)}
                        className="btn-danger btn-sm"
                        style={{ cursor: "pointer", border: "none", borderRadius: "6px" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RULES */}
      {activeTab === "rules" && (
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                Matriks Aturan Inferensi Fuzzy ({rules.length} Rule)
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Aturan dihasilkan secara otomatis dari pemetaan kasus rekam medik yang telah tervalidasi.
              </p>
            </div>
            <button
              onClick={handleRecalculateRules}
              className="btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <RotateCcw size={16} />
              Rekalkulasi Rules Otomatis
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>ID Rule</th>
                <th>Penyakit Terkait</th>
                <th>Gejala Penentu</th>
                <th>Kategori</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id_rule}>
                  <td>
                    <span className="badge badge-cyan">R-{r.id_rule}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{r.penyakit?.nama_penyakit}</td>
                  <td style={{ color: "var(--text-muted)" }}>{r.gejala?.nama_gejala}</td>
                  <td>{r.kategori?.nama_kategori || "Penyakit Mata"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: KATEGORI */}
      {activeTab === "kategori" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} color="#38bdf8" /> Tambah Kategori
            </h3>
            <form onSubmit={handleCreateKategori} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Nama Kategori:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penyakit Mata"
                  value={kategoriForm.nama}
                  onChange={(e) => setKategoriForm({ nama: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary">Simpan Kategori</button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
              Daftar Kategori ({kategoris.length})
            </h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Kategori</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kategoris.map((k) => (
                  <tr key={k.kategori_penyakit}>
                    <td>#{k.kategori_penyakit}</td>
                    <td style={{ fontWeight: 600 }}>{k.nama_kategori}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteKategori(k.kategori_penyakit)}
                        className="btn-danger btn-sm"
                        style={{ cursor: "pointer", border: "none", borderRadius: "6px" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: USERS */}
      {activeTab === "users" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} color="#38bdf8" /> Tambah Akun Admin
            </h3>
            <form onSubmit={handleCreateAdmin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Tenaga Medis / Admin"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Username:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Username login"
                  value={adminForm.username}
                  onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary">Buat Akun</button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
              Daftar Administrator ({admins.length})
            </h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Lengkap</th>
                  <th>Username</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((adm) => (
                  <tr key={adm.id_admin}>
                    <td>#{adm.id_admin}</td>
                    <td style={{ fontWeight: 600 }}>{adm.name}</td>
                    <td><code>{adm.username_admin}</code></td>
                    <td>
                      {admins.length > 1 && (
                        <button
                          onClick={() => handleDeleteAdmin(adm.id_admin)}
                          className="btn-danger btn-sm"
                          style={{ cursor: "pointer", border: "none", borderRadius: "6px" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
