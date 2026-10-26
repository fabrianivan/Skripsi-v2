package models

import "time"

// Admin represents an administrator user
type Admin struct {
	IDAdmin       uint      `gorm:"primaryKey;column:ID_Admin" json:"id_admin"`
	Name          string    `gorm:"column:Name;type:varchar(50);not null" json:"name"`
	UsernameAdmin string    `gorm:"column:Username_Admin;type:varchar(30);uniqueIndex;not null" json:"username_admin"`
	PasswordAdmin string    `gorm:"column:Password_Admin;type:varchar(255);not null" json:"-"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// TableName sets table name for Admin
func (Admin) TableName() string {
	return "Admin"
}

// Kategori represents category of diseases
type Kategori struct {
	KategoriPenyakit uint       `gorm:"primaryKey;column:Kategori_Penyakit" json:"kategori_penyakit"`
	NamaKategori     string     `gorm:"column:Nama_Kategori;type:varchar(125);not null" json:"nama_kategori"`
	Penyakit         []Penyakit `gorm:"foreignKey:KategoriID;references:KategoriPenyakit" json:"penyakit,omitempty"`
	Gejala           []Gejala   `gorm:"foreignKey:KategoriID;references:KategoriPenyakit" json:"gejala,omitempty"`
}

func (Kategori) TableName() string {
	return "Kategori"
}

// Penyakit represents an eye disease
type Penyakit struct {
	IDPenyakit   uint      `gorm:"primaryKey;column:ID_Penyakit" json:"id_penyakit"`
	KategoriID   uint      `gorm:"column:Kategori_ID;default:0" json:"kategori_id"`
	NamaPenyakit string    `gorm:"column:Nama_Penyakit;type:varchar(125);not null" json:"nama_penyakit"`
	Solusi       string    `gorm:"column:Solusi;type:text;not null" json:"solusi"`
	Kategori     *Kategori `gorm:"foreignKey:KategoriID;references:KategoriPenyakit" json:"kategori,omitempty"`
}

func (Penyakit) TableName() string {
	return "Penyakit"
}

// Gejala represents a symptom or symptom parent group
type Gejala struct {
	IDGejala     uint      `gorm:"primaryKey;column:ID_Gejala" json:"id_gejala"`
	KategoriID   uint      `gorm:"column:Kategori_ID;default:0" json:"kategori_id"`
	ParentID     uint      `gorm:"column:Parent_ID;default:0" json:"parent_id"`
	NamaGejala   string    `gorm:"column:Nama_Gejala;type:varchar(125);not null" json:"nama_gejala"`
	GambarGejala string    `gorm:"column:GambarGejala;type:varchar(255);default:'notfound.jpg'" json:"gambar_gejala"`
	Interval     float64   `gorm:"column:Interval;default:0" json:"interval"`
	Min          float64   `gorm:"column:Min;default:0" json:"min"`
	Max          float64   `gorm:"column:Max;default:1" json:"max"`
	Kategori     *Kategori `gorm:"foreignKey:KategoriID;references:KategoriPenyakit" json:"kategori,omitempty"`
	Children     []Gejala  `gorm:"-" json:"children,omitempty"`
	HasChild     bool      `gorm:"-" json:"has_child"`
}

func (Gejala) TableName() string {
	return "Gejala"
}

// RekamMedik represents medical record case history
type RekamMedik struct {
	IDRekammedik uint      `gorm:"primaryKey;column:ID_Rekammedik" json:"id_rekammedik"`
	Kode         string    `gorm:"column:Kode;type:varchar(50);not null;index" json:"kode"`
	KategoriID   uint      `gorm:"column:Kategori_ID;default:0" json:"kategori_id"`
	IDPenyakit   uint      `gorm:"column:ID_Penyakit;not null" json:"id_penyakit"`
	IDGejala     uint      `gorm:"column:ID_Gejala;not null" json:"id_gejala"`
	Kategori     *Kategori `gorm:"foreignKey:KategoriID;references:KategoriPenyakit" json:"kategori,omitempty"`
	Penyakit     *Penyakit `gorm:"foreignKey:IDPenyakit;references:IDPenyakit" json:"penyakit,omitempty"`
	Gejala       *Gejala   `gorm:"foreignKey:IDGejala;references:IDGejala" json:"gejala,omitempty"`
}

func (RekamMedik) TableName() string {
	return "RekamMedik"
}

// Rule represents knowledge base rules derived from RekamMedik
type Rule struct {
	IDRule     uint      `gorm:"primaryKey;column:ID_Rule" json:"id_rule"`
	KategoriID uint      `gorm:"column:Kategori_ID;default:0" json:"kategori_id"`
	IDPenyakit uint      `gorm:"column:ID_Penyakit;not null" json:"id_penyakit"`
	IDGejala   uint      `gorm:"column:ID_Gejala;not null" json:"id_gejala"`
	Kategori   *Kategori `gorm:"foreignKey:KategoriID;references:KategoriPenyakit" json:"kategori,omitempty"`
	Penyakit   *Penyakit `gorm:"foreignKey:IDPenyakit;references:IDPenyakit" json:"penyakit,omitempty"`
	Gejala     *Gejala   `gorm:"foreignKey:IDGejala;references:IDGejala" json:"gejala,omitempty"`
}

func (Rule) TableName() string {
	return "Rule"
}

// KonsultasiRequest represents the input from the consultation form
type KonsultasiRequest struct {
	KategoriID uint                     `json:"kategori_id" binding:"required"`
	Metode     int                      `json:"metode"` // 0: Segitiga, 1: Trapesium
	Gejala     []KonsultasiGejalaInput `json:"gejala" binding:"required"`
}

type KonsultasiGejalaInput struct {
	IDGejala uint    `json:"id_gejala"`
	Interval float64 `json:"interval"`
}

// KonsultasiResponse represents the diagnosis result output
type KonsultasiResponse struct {
	Error             bool                    `json:"error"`
	ErrorMsg          string                  `json:"error_msg,omitempty"`
	MetodeNama        string                  `json:"metode_nama"`
	GejalaTerpicu     []GejalaTerpicuInfo     `json:"gejala_terpicu"`
	RuleTerpicu       []RuleTerpicuInfo       `json:"rule_terpicu"`
	HasilDiagnosa     []HasilDiagnosaPenyakit `json:"hasil_diagnosa"`
	PenyakitTerpilih  *HasilDiagnosaPenyakit  `json:"penyakit_terpilih"`
	SolusiRekomendasi string                  `json:"solusi_rekomendasi"`
}

type GejalaTerpicuInfo struct {
	IDGejala     uint    `json:"id_gejala"`
	NamaGejala   string  `json:"nama_gejala"`
	GambarGejala string  `json:"gambar_gejala"`
	Interval     float64 `json:"interval"`
	Derajat      float64 `json:"derajat"`
	KategoriTeks string  `json:"kategori_teks"`
}

type RuleTerpicuInfo struct {
	IDPenyakit      uint     `json:"id_penyakit"`
	NamaPenyakit    string   `json:"nama_penyakit"`
	TotalGejalaRule int      `json:"total_gejala_rule"`
	GejalaCocok     int      `json:"gejala_cocok"`
	GejalaList      []string `json:"gejala_list"`
}

type HasilDiagnosaPenyakit struct {
	IDPenyakit      uint    `json:"id_penyakit"`
	NamaPenyakit    string  `json:"nama_penyakit"`
	Persentase      float64 `json:"persentase"`
	TingkatParah    string  `json:"tingkat_parah"`
	Keterangan      string  `json:"keterangan"`
	Solusi          string  `json:"solusi"`
	GejalaCocok     int     `json:"gejala_cocok"`
	TotalGejalaRule int     `json:"total_gejala_rule"`
}
