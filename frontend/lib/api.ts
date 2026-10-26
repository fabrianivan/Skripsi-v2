// API client for Golang backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface Kategori {
  kategori_penyakit: number;
  nama_kategori: string;
}

export interface Penyakit {
  id_penyakit: number;
  kategori_id: number;
  nama_penyakit: string;
  solusi: string;
  kategori?: Kategori;
}

export interface Gejala {
  id_gejala: number;
  kategori_id: number;
  parent_id: number;
  nama_gejala: string;
  gambar_gejala: string;
  interval: number;
  min: number;
  max: number;
  has_child?: boolean;
  children?: Gejala[];
}

export interface GejalaTerpicuInfo {
  id_gejala: number;
  nama_gejala: string;
  gambar_gejala: string;
  interval: number;
  derajat: number;
  kategori_teks: string;
}

export interface RuleTerpicuInfo {
  id_penyakit: number;
  nama_penyakit: string;
  total_gejala_rule: number;
  gejala_cocok: number;
  gejala_list: string[];
}

export interface HasilDiagnosaPenyakit {
  id_penyakit: number;
  nama_penyakit: string;
  persentase: number;
  tingkat_parah: string;
  keterangan: string;
  solusi: string;
  gejala_cocok: number;
  total_gejala_rule: number;
}

export interface KonsultasiResponse {
  error: boolean;
  error_msg?: string;
  metode_nama: string;
  gejala_terpicu: GejalaTerpicuInfo[];
  rule_terpicu: RuleTerpicuInfo[];
  hasil_diagnosa: HasilDiagnosaPenyakit[];
  penyakit_terpilih?: HasilDiagnosaPenyakit;
  solusi_rekomendasi: string;
}

export interface RekamMedikGrouped {
  kode: string;
  kategori_id: number;
  nama_kategori: string;
  id_penyakit: number;
  nama_penyakit: string;
  gejala_ids: number[];
  gejala_nama: string[];
  gejala_teks: string;
}

export interface RuleItem {
  id_rule: number;
  kategori_id: number;
  id_penyakit: number;
  id_gejala: number;
  penyakit?: Penyakit;
  gejala?: Gejala;
  kategori?: Kategori;
}

export interface AdminUser {
  id_admin: number;
  name: string;
  username_admin: string;
}

// Token helper
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("skripsi_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("skripsi_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("skripsi_token");
    localStorage.removeItem("skripsi_admin");
  }
}

export function getSavedAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("skripsi_admin");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSavedAdmin(admin: AdminUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem("skripsi_admin", JSON.stringify(admin));
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_msg || `Error HTTP ${res.status}`);
  }
  return data;
}

export const api = {
  // Public
  getKategori: async (): Promise<Kategori[]> => {
    const res = await fetch(`${API_BASE_URL}/kategori`);
    const data = await res.json();
    return data.data || [];
  },

  getPenyakit: async (kategoriId?: number): Promise<Penyakit[]> => {
    const query = kategoriId ? `?kategori_id=${kategoriId}` : "";
    const res = await fetch(`${API_BASE_URL}/penyakit${query}`);
    const data = await res.json();
    return data.data || [];
  },

  getGejalaTree: async (kategoriId?: number): Promise<Gejala[]> => {
    const query = kategoriId ? `?kategori_id=${kategoriId}` : "?kategori_id=1";
    const res = await fetch(`${API_BASE_URL}/gejala/tree${query}`);
    const data = await res.json();
    return data.data || [];
  },

  getAllGejala: async (kategoriId?: number): Promise<Gejala[]> => {
    const query = kategoriId ? `?kategori_id=${kategoriId}` : "";
    const res = await fetch(`${API_BASE_URL}/gejala${query}`);
    const data = await res.json();
    return data.data || [];
  },

  getRules: async (kategoriId?: number): Promise<RuleItem[]> => {
    const query = kategoriId ? `?kategori_id=${kategoriId}` : "";
    const res = await fetch(`${API_BASE_URL}/rules${query}`);
    const data = await res.json();
    return data.data || [];
  },

  konsultasi: async (
    kategoriId: number,
    metode: number,
    gejala: { id_gejala: number; interval: number }[]
  ): Promise<KonsultasiResponse> => {
    const res = await fetch(`${API_BASE_URL}/konsultasi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategori_id: kategoriId,
        metode,
        gejala,
      }),
    });
    return await res.json();
  },

  // Auth
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error_msg || "Gagal masuk");
    }
    setAuthToken(data.token);
    setSavedAdmin(data.admin);
    return data;
  },

  // Admin Protected
  getAdmins: async (): Promise<AdminUser[]> => {
    const data = await fetchWithAuth("/admin/users");
    return data.data || [];
  },

  createAdmin: async (payload: { name: string; username: string; password: string }) => {
    return await fetchWithAuth("/admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateAdmin: async (id: number, payload: { name: string; username: string }) => {
    return await fetchWithAuth(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  resetAdminPassword: async (id: number, newPassword: string) => {
    return await fetchWithAuth(`/admin/users/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ new_password: newPassword }),
    });
  },

  deleteAdmin: async (id: number) => {
    return await fetchWithAuth(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  // Kategori CRUD
  createKategori: async (nama: string) => {
    return await fetchWithAuth("/admin/kategori", {
      method: "POST",
      body: JSON.stringify({ nama_kategori: nama }),
    });
  },

  updateKategori: async (id: number, nama: string) => {
    return await fetchWithAuth(`/admin/kategori/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nama_kategori: nama }),
    });
  },

  deleteKategori: async (id: number) => {
    return await fetchWithAuth(`/admin/kategori/${id}`, {
      method: "DELETE",
    });
  },

  // Penyakit CRUD
  createPenyakit: async (payload: { kategori_id: number; nama_penyakit: string; solusi: string }) => {
    return await fetchWithAuth("/admin/penyakit", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updatePenyakit: async (id: number, payload: { kategori_id: number; nama_penyakit: string; solusi: string }) => {
    return await fetchWithAuth(`/admin/penyakit/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deletePenyakit: async (id: number) => {
    return await fetchWithAuth(`/admin/penyakit/${id}`, {
      method: "DELETE",
    });
  },

  // Gejala CRUD
  createGejala: async (payload: {
    kategori_id: number;
    parent_id: number;
    nama_gejala: string;
    gambar_gejala: string;
    interval: number;
  }) => {
    return await fetchWithAuth("/admin/gejala", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateGejala: async (
    id: number,
    payload: {
      kategori_id: number;
      parent_id: number;
      nama_gejala: string;
      gambar_gejala: string;
      interval: number;
    }
  ) => {
    return await fetchWithAuth(`/admin/gejala/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteGejala: async (id: number) => {
    return await fetchWithAuth(`/admin/gejala/${id}`, {
      method: "DELETE",
    });
  },

  // Rekam Medik
  getRekamMedik: async (): Promise<RekamMedikGrouped[]> => {
    const data = await fetchWithAuth("/admin/rekammedik");
    return data.data || [];
  },

  createRekamMedik: async (payload: {
    kategori_id: number;
    id_penyakit: number;
    list_gejala: number[];
  }) => {
    return await fetchWithAuth("/admin/rekammedik", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteRekamMedik: async (kode: string) => {
    return await fetchWithAuth(`/admin/rekammedik/${kode}`, {
      method: "DELETE",
    });
  },

  recalculateRules: async () => {
    return await fetchWithAuth("/admin/rules/recalculate", {
      method: "POST",
    });
  },
};
