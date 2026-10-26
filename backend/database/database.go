package database

import (
	"log"
	"skripsi-mata-backend/models"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDB initializes SQLite database and runs migrations & seed data
func InitDB(dbPath string) *gorm.DB {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatalf("Gagal terhubung ke database SQLite: %v", err)
	}

	// Auto Migrate tables
	err = DB.AutoMigrate(
		&models.Admin{},
		&models.Kategori{},
		&models.Penyakit{},
		&models.Gejala{},
		&models.RekamMedik{},
		&models.Rule{},
	)
	if err != nil {
		log.Fatalf("AutoMigrate error: %v", err)
	}

	seedData()

	return DB
}

func seedData() {
	// Seed Admin if not exists
	var countAdmin int64
	DB.Model(&models.Admin{}).Count(&countAdmin)
	if countAdmin == 0 {
		hashed, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		admin := models.Admin{
			Name:          "Fabrian Ivan",
			UsernameAdmin: "admin",
			PasswordAdmin: string(hashed),
		}
		DB.Create(&admin)
		log.Println("Admin default berhasil dibuat: username=admin password=admin123")
	}

	// Seed Kategori
	var countKat int64
	DB.Model(&models.Kategori{}).Count(&countKat)
	if countKat == 0 {
		kategoriList := []models.Kategori{
			{KategoriPenyakit: 1, NamaKategori: "Penyakit Mata"},
		}
		DB.Create(&kategoriList)
	}

	// Seed Penyakit
	var countPenyakit int64
	DB.Model(&models.Penyakit{}).Count(&countPenyakit)
	if countPenyakit == 0 {
		penyakitList := []models.Penyakit{
			{
				IDPenyakit:   1,
				KategoriID:   1,
				NamaPenyakit: "Katarak",
				Solusi:       "Diperlukan pemeriksaan mata rutin dan konsultasi bedah mata untuk persiapan operasi pada salah satu mata yang lebih bermasalah.",
			},
			{
				IDPenyakit:   2,
				KategoriID:   1,
				NamaPenyakit: "Katarak Akut",
				Solusi:       "Diperlukan tindakan operasi segera pada salah satu mata yang lebih mengalami gangguan penglihatan berat untuk mencegah kebutaan permanen.",
			},
			{
				IDPenyakit:   3,
				KategoriID:   1,
				NamaPenyakit: "Katarak pada salah satu mata",
				Solusi:       "Diperlukan operasi pada salah satu mata yang lebih mengalami gangguan penglihatan dan terapi tetes mata pasca tindakan.",
			},
			{
				IDPenyakit:   4,
				KategoriID:   1,
				NamaPenyakit: "Tidak diperlukan operasi katarak",
				Solusi:       "Untuk sementara tidak diperlukan operasi karena lapisan katarak masih tipis. Disarankan menjaga kebersihan mata dan kontrol 6 bulan sekali.",
			},
			{
				IDPenyakit:   5,
				KategoriID:   1,
				NamaPenyakit: "Miopi",
				Solusi:       "Perlu menggunakan kacamata minus dengan lensa koreksi sesuai hasil refraksi mata dan hindari paparan layar gadget berlebihan.",
			},
			{
				IDPenyakit:   6,
				KategoriID:   1,
				NamaPenyakit: "Miopi Akut",
				Solusi:       "Perlu menggunakan kacamata minus tinggi atau lensa kontak khusus serta pemeriksaan retina berkala ke dokter spesialis mata.",
			},
			{
				IDPenyakit:   7,
				KategoriID:   1,
				NamaPenyakit: "Kegagalan Operasi Mata",
				Solusi:       "Segera konsultasikan dengan dokter spesialis mata spesialis bedah kornea/retina untuk evaluasi darurat terhadap inflamasi atau pergeseran lensa buatan.",
			},
		}
		DB.Create(&penyakitList)
	}

	// Seed Gejala
	var countGejala int64
	DB.Model(&models.Gejala{}).Count(&countGejala)
	if countGejala == 0 {
		// Parents
		parents := []models.Gejala{
			{IDGejala: 1, KategoriID: 1, ParentID: 0, NamaGejala: "Penglihatan Mata Kanan", Interval: 0, Min: 0, Max: 1, GambarGejala: "penglihatan-kabur-kanan.jpg"},
			{IDGejala: 2, KategoriID: 1, ParentID: 0, NamaGejala: "Penglihatan Mata Kiri", Interval: 0, Min: 0, Max: 1, GambarGejala: "penglihatan-kabur-kiri.jpg"},
			{IDGejala: 3, KategoriID: 1, ParentID: 0, NamaGejala: "Mata Berbayang", Interval: 0, Min: 0, Max: 1, GambarGejala: "mata-berbayang.jpg"},
			{IDGejala: 4, KategoriID: 1, ParentID: 0, NamaGejala: "Mata Berembun", Interval: 0, Min: 0, Max: 1, GambarGejala: "mata-berembun.jpg"},
			{IDGejala: 5, KategoriID: 1, ParentID: 0, NamaGejala: "Sensitivitas Cahaya", Interval: 0, Min: 0, Max: 1, GambarGejala: "silau-cahaya.jpg"},
			{IDGejala: 6, KategoriID: 1, ParentID: 0, NamaGejala: "Mata Merah", Interval: 0, Min: 0, Max: 1, GambarGejala: "mata-merah.jpg"},
			{IDGejala: 7, KategoriID: 1, ParentID: 0, NamaGejala: "Bintik-bintik pada Mata", Interval: 0, Min: 0, Max: 1, GambarGejala: "bintik-mata.jpg"},
			{IDGejala: 8, KategoriID: 1, ParentID: 0, NamaGejala: "Kondisi Posisi Bola Mata", Interval: 0, Min: 0, Max: 1, GambarGejala: "posisi-bola-mata.jpg"},
			{IDGejala: 9, KategoriID: 1, ParentID: 0, NamaGejala: "Tingkat Minus pada Mata", Interval: 0, Min: 0, Max: 1, GambarGejala: "mata-minus.jpg"},
			{IDGejala: 10, KategoriID: 1, ParentID: 0, NamaGejala: "Riwayat Operasi Katarak Terakhir", Interval: 0, Min: 0, Max: 1, GambarGejala: "operasi-katarak.jpg"},
		}
		DB.Create(&parents)

		// Children
		children := []models.Gejala{
			// 1. Penglihatan Mata Kanan
			{IDGejala: 11, KategoriID: 1, ParentID: 1, NamaGejala: "Mata kanan sedikit sulit melihat dengan jelas", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "penglihatan-kabur-kanan.jpg"},
			{IDGejala: 12, KategoriID: 1, ParentID: 1, NamaGejala: "Mata kanan agak sulit melihat dengan jelas", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "penglihatan-kabur-kanan.jpg"},
			{IDGejala: 13, KategoriID: 1, ParentID: 1, NamaGejala: "Mata kanan sangat sulit melihat dengan jelas", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "penglihatan-kabur-kanan.jpg"},

			// 2. Penglihatan Mata Kiri
			{IDGejala: 14, KategoriID: 1, ParentID: 2, NamaGejala: "Mata kiri sedikit sulit melihat dengan jelas", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "penglihatan-kabur-kiri.jpg"},
			{IDGejala: 15, KategoriID: 1, ParentID: 2, NamaGejala: "Mata kiri agak sulit melihat dengan jelas", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "penglihatan-kabur-kiri.jpg"},
			{IDGejala: 16, KategoriID: 1, ParentID: 2, NamaGejala: "Mata kiri sangat susah melihat dengan jelas", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "penglihatan-kabur-kiri.jpg"},

			// 3. Mata Berbayang
			{IDGejala: 17, KategoriID: 1, ParentID: 3, NamaGejala: "Mata kanan sedikit berbayang", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "mata-berbayang.jpg"},
			{IDGejala: 18, KategoriID: 1, ParentID: 3, NamaGejala: "Mata kanan agak berbayang", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "mata-berbayang.jpg"},
			{IDGejala: 19, KategoriID: 1, ParentID: 3, NamaGejala: "Mata kanan sangat berbayang", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "mata-berbayang.jpg"},
			{IDGejala: 20, KategoriID: 1, ParentID: 3, NamaGejala: "Mata kiri sedikit berbayang", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "mata-berbayang.jpg"},
			{IDGejala: 21, KategoriID: 1, ParentID: 3, NamaGejala: "Mata kiri agak berbayang", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "mata-berbayang.jpg"},
			{IDGejala: 22, KategoriID: 1, ParentID: 3, NamaGejala: "Mata kiri sangat berbayang", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "mata-berbayang.jpg"},

			// 4. Mata Berembun
			{IDGejala: 23, KategoriID: 1, ParentID: 4, NamaGejala: "Terdapat sedikit embun pada mata kiri", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "mata-berembun.jpg"},
			{IDGejala: 24, KategoriID: 1, ParentID: 4, NamaGejala: "Terdapat agak banyak embun pada mata kiri", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "mata-berembun.jpg"},
			{IDGejala: 25, KategoriID: 1, ParentID: 4, NamaGejala: "Terdapat banyak embun pada mata kiri", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "mata-berembun.jpg"},
			{IDGejala: 26, KategoriID: 1, ParentID: 4, NamaGejala: "Terdapat sedikit banyak embun pada mata kanan", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "mata-berembun.jpg"},
			{IDGejala: 27, KategoriID: 1, ParentID: 4, NamaGejala: "Terdapat agak banyak embun pada mata kanan", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "mata-berembun.jpg"},
			{IDGejala: 28, KategoriID: 1, ParentID: 4, NamaGejala: "Terdapat banyak embun pada mata kanan", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "mata-berembun.jpg"},

			// 5. Sensitivitas Cahaya
			{IDGejala: 29, KategoriID: 1, ParentID: 5, NamaGejala: "Sedikit sulit melihat cahaya pada mata kiri", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "silau-cahaya.jpg"},
			{IDGejala: 30, KategoriID: 1, ParentID: 5, NamaGejala: "Agak sulit melihat cahaya pada mata kiri", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "silau-cahaya.jpg"},
			{IDGejala: 31, KategoriID: 1, ParentID: 5, NamaGejala: "Sangat sulit melihat cahaya pada mata kiri", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "silau-cahaya.jpg"},
			{IDGejala: 32, KategoriID: 1, ParentID: 5, NamaGejala: "Agak sulit melihat pada mata kanan", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "silau-cahaya.jpg"},
			{IDGejala: 33, KategoriID: 1, ParentID: 5, NamaGejala: "Sangat sulit melihat cahaya pada mata kanan", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "silau-cahaya.jpg"},

			// 6. Mata Merah
			{IDGejala: 34, KategoriID: 1, ParentID: 6, NamaGejala: "Mata kanan sedikit merah", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "mata-kanan-merah.jpg"},
			{IDGejala: 35, KategoriID: 1, ParentID: 6, NamaGejala: "Mata kanan agak merah", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "mata-kanan-merah.jpg"},
			{IDGejala: 36, KategoriID: 1, ParentID: 6, NamaGejala: "Mata kanan sangat merah", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "mata-kanan-merah.jpg"},
			{IDGejala: 37, KategoriID: 1, ParentID: 6, NamaGejala: "Mata kiri sedikit merah", Interval: 0.20, Min: 0.0, Max: 0.4, GambarGejala: "mata-kiri-merah.jpg"},
			{IDGejala: 38, KategoriID: 1, ParentID: 6, NamaGejala: "Mata kiri agak merah", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "mata-kiri-merah.jpg"},
			{IDGejala: 39, KategoriID: 1, ParentID: 6, NamaGejala: "Mata kiri sangat merah", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "mata-kiri-merah.jpg"},

			// 7. Bintik-bintik pada Mata
			{IDGejala: 40, KategoriID: 1, ParentID: 7, NamaGejala: "Terdapat bintik-bintik pada mata kiri atau kanan", Interval: 0.30, Min: 0.0, Max: 0.4, GambarGejala: "bintik-mata.jpg"},
			{IDGejala: 41, KategoriID: 1, ParentID: 7, NamaGejala: "Terdapat bintik-bintik pada kedua mata", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "bintik-mata.jpg"},
			{IDGejala: 42, KategoriID: 1, ParentID: 7, NamaGejala: "Terdapat banyak bintik-bintik pada kedua mata", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "bintik-mata.jpg"},
			{IDGejala: 43, KategoriID: 1, ParentID: 7, NamaGejala: "Terdapat kotoran pada lapisan mata ketika melihat sesuatu", Interval: 0.55, Min: 0.3, Max: 0.7, GambarGejala: "bintik-mata.jpg"},

			// 8. Kondisi Posisi Bola Mata
			{IDGejala: 44, KategoriID: 1, ParentID: 8, NamaGejala: "Bola mata tidak stabil atau kabur-kabur", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "posisi-bola-mata.jpg"},
			{IDGejala: 45, KategoriID: 1, ParentID: 8, NamaGejala: "Bola mata sudah berubah posisi", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "posisi-bola-mata.jpg"},

			// 9. Minus pada Mata
			{IDGejala: 46, KategoriID: 1, ParentID: 9, NamaGejala: "Minus pada salah satu mata lebih rendah", Interval: 0.30, Min: 0.0, Max: 0.4, GambarGejala: "mata-minus.jpg"},
			{IDGejala: 47, KategoriID: 1, ParentID: 9, NamaGejala: "Minus pada kedua mata sama sedang", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "mata-minus.jpg"},
			{IDGejala: 48, KategoriID: 1, ParentID: 9, NamaGejala: "Minus pada kedua mata tinggi", Interval: 0.85, Min: 0.6, Max: 1.0, GambarGejala: "mata-minus.jpg"},

			// 10. Operasi Katarak Terakhir
			{IDGejala: 49, KategoriID: 1, ParentID: 10, NamaGejala: "Operasi katarak terakhir kurang dari 1 tahun", Interval: 0.80, Min: 0.6, Max: 1.0, GambarGejala: "operasi-katarak.jpg"},
			{IDGejala: 50, KategoriID: 1, ParentID: 10, NamaGejala: "Operasi katarak terakhir adalah 1 sampai dengan 5 tahun lalu", Interval: 0.50, Min: 0.3, Max: 0.7, GambarGejala: "operasi-katarak.jpg"},
			{IDGejala: 51, KategoriID: 1, ParentID: 10, NamaGejala: "Operasi katarak terakhir lebih dari 5 tahun yang lalu", Interval: 0.30, Min: 0.0, Max: 0.4, GambarGejala: "operasi-katarak.jpg"},
		}
		DB.Create(&children)
	}

	// Seed Rekam Medik
	var countRM int64
	DB.Model(&models.RekamMedik{}).Count(&countRM)
	if countRM == 0 {
		rekamMedikCases := []struct {
			Kode       string
			IDPenyakit uint
			GejalaIDs  []uint
		}{
			// Kasus RM 1: Katarak
			{Kode: "1", IDPenyakit: 1, GejalaIDs: []uint{12, 15, 18, 24, 27, 30, 32}},
			// Kasus RM 2: Katarak Akut
			{Kode: "2", IDPenyakit: 2, GejalaIDs: []uint{13, 16, 19, 22, 25, 28, 31, 33}},
			// Kasus RM 3: Katarak pada salah satu mata
			{Kode: "3", IDPenyakit: 3, GejalaIDs: []uint{13, 14, 19, 20, 27, 32}},
			// Kasus RM 4: Tidak diperlukan operasi katarak
			{Kode: "4", IDPenyakit: 4, GejalaIDs: []uint{11, 14, 17, 23, 26, 29}},
			// Kasus RM 5: Miopi
			{Kode: "5", IDPenyakit: 5, GejalaIDs: []uint{11, 14, 46, 47}},
			// Kasus RM 6: Miopi Akut
			{Kode: "6", IDPenyakit: 6, GejalaIDs: []uint{12, 15, 17, 20, 48}},
			// Kasus RM 7: Kegagalan Operasi Mata
			{Kode: "7", IDPenyakit: 7, GejalaIDs: []uint{36, 39, 44, 45, 49, 13, 16}},
		}

		for _, rmc := range rekamMedikCases {
			for _, gID := range rmc.GejalaIDs {
				DB.Create(&models.RekamMedik{
					Kode:       rmc.Kode,
					KategoriID: 1,
					IDPenyakit: rmc.IDPenyakit,
					IDGejala:   gID,
				})
			}
		}

		RecalculateRules()
	}
}

// RecalculateRules re-derives the Rule knowledge base table from RekamMedik
func RecalculateRules() {
	var rekamMediks []models.RekamMedik
	DB.Find(&rekamMediks)

	// Clean existing rules
	DB.Exec("DELETE FROM Rule")

	type RuleKey struct {
		PenyakitID uint
		GejalaID   uint
		KategoriID uint
	}
	seen := make(map[RuleKey]bool)

	for _, rm := range rekamMediks {
		key := RuleKey{
			PenyakitID: rm.IDPenyakit,
			GejalaID:   rm.IDGejala,
			KategoriID: rm.KategoriID,
		}
		if !seen[key] {
			seen[key] = true
			DB.Create(&models.Rule{
				KategoriID: rm.KategoriID,
				IDPenyakit: rm.IDPenyakit,
				IDGejala:   rm.IDGejala,
			})
		}
	}
}
