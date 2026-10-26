package handlers

import (
	"fmt"
	"net/http"
	"strings"

	"skripsi-mata-backend/database"
	"skripsi-mata-backend/models"

	"github.com/gin-gonic/gin"
)

type RekamMedikGrouped struct {
	Kode         string   `json:"kode"`
	KategoriID   uint     `json:"kategori_id"`
	NamaKategori string   `json:"nama_kategori"`
	IDPenyakit   uint     `json:"id_penyakit"`
	NamaPenyakit string   `json:"nama_penyakit"`
	GejalaIDs    []uint   `json:"gejala_ids"`
	GejalaNama   []string `json:"gejala_nama"`
	GejalaTeks   string   `json:"gejala_teks"`
}

type CreateRekamMedikInput struct {
	KategoriID uint   `json:"kategori_id" binding:"required"`
	IDPenyakit uint   `json:"id_penyakit" binding:"required"`
	ListGejala []uint `json:"list_gejala" binding:"required"` // array of gejala IDs
}

func ListRekamMedik(c *gin.Context) {
	var list []models.RekamMedik
	database.DB.Preload("Kategori").Preload("Penyakit").Preload("Gejala").Order("Kode asc").Find(&list)

	groupedMap := make(map[string]*RekamMedikGrouped)
	var keys []string

	for _, item := range list {
		if _, exists := groupedMap[item.Kode]; !exists {
			keys = append(keys, item.Kode)
			kategoriName := ""
			if item.Kategori != nil {
				kategoriName = item.Kategori.NamaKategori
			}
			penyakitName := ""
			if item.Penyakit != nil {
				penyakitName = item.Penyakit.NamaPenyakit
			}
			groupedMap[item.Kode] = &RekamMedikGrouped{
				Kode:         item.Kode,
				KategoriID:   item.KategoriID,
				NamaKategori: kategoriName,
				IDPenyakit:   item.IDPenyakit,
				NamaPenyakit: penyakitName,
				GejalaIDs:    []uint{},
				GejalaNama:   []string{},
			}
		}

		if item.Gejala != nil {
			groupedMap[item.Kode].GejalaIDs = append(groupedMap[item.Kode].GejalaIDs, item.IDGejala)
			groupedMap[item.Kode].GejalaNama = append(groupedMap[item.Kode].GejalaNama, item.Gejala.NamaGejala)
		}
	}

	result := make([]RekamMedikGrouped, 0, len(keys))
	for _, k := range keys {
		item := groupedMap[k]
		item.GejalaTeks = strings.Join(item.GejalaNama, ", ")
		result = append(result, *item)
	}

	c.JSON(http.StatusOK, gin.H{"error": false, "data": result})
}

func CreateRekamMedik(c *gin.Context) {
	var input CreateRekamMedikInput
	if err := c.ShouldBindJSON(&input); err != nil || len(input.ListGejala) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap isi semua kolom dan pilih minimal 1 gejala!"})
		return
	}

	// Generate new unique code
	var existingCodes []string
	database.DB.Model(&models.RekamMedik{}).Distinct("Kode").Pluck("Kode", &existingCodes)

	codeNum := len(existingCodes) + 1
	codeStr := fmt.Sprintf("%d", codeNum)

	codeSet := make(map[string]bool)
	for _, code := range existingCodes {
		codeSet[code] = true
	}
	for codeSet[codeStr] {
		codeNum++
		codeStr = fmt.Sprintf("%d", codeNum)
	}

	for _, gID := range input.ListGejala {
		rm := models.RekamMedik{
			Kode:       codeStr,
			KategoriID: input.KategoriID,
			IDPenyakit: input.IDPenyakit,
			IDGejala:   gID,
		}
		database.DB.Create(&rm)
	}

	database.RecalculateRules()

	c.JSON(http.StatusOK, gin.H{"error": false, "kode": codeStr, "message": "Rekam medik berhasil disimpan dan rules telah diperbarui"})
}

func DeleteRekamMedik(c *gin.Context) {
	kode := c.Param("kode")
	database.DB.Where("Kode = ?", kode).Delete(&models.RekamMedik{})
	database.RecalculateRules()
	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Rekam medik berhasil dihapus"})
}

// Rules Handlers

func ListRules(c *gin.Context) {
	kategoriID := c.Query("kategori_id")
	var rules []models.Rule
	query := database.DB.Preload("Kategori").Preload("Penyakit").Preload("Gejala").Order("ID_Penyakit asc, ID_Gejala asc")
	if kategoriID != "" {
		query = query.Where("Kategori_ID = ?", kategoriID)
	}
	query.Find(&rules)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": rules})
}

func RecalculateRulesHandler(c *gin.Context) {
	database.RecalculateRules()
	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Rules berhasil direkalkulasi dari data rekam medik"})
}
