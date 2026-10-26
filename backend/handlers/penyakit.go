package handlers

import (
	"net/http"
	"strings"

	"skripsi-mata-backend/database"
	"skripsi-mata-backend/models"

	"github.com/gin-gonic/gin"
)

type PenyakitInput struct {
	KategoriID   uint   `json:"kategori_id" binding:"required"`
	NamaPenyakit string `json:"nama_penyakit" binding:"required"`
	Solusi       string `json:"solusi" binding:"required"`
}

func ListPenyakit(c *gin.Context) {
	kategoriID := c.Query("kategori_id")
	var list []models.Penyakit
	query := database.DB.Preload("Kategori").Order("ID_Penyakit asc")
	if kategoriID != "" {
		query = query.Where("Kategori_ID = ?", kategoriID)
	}
	query.Find(&list)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": list})
}

func GetPenyakit(c *gin.Context) {
	id := c.Param("id")
	var p models.Penyakit
	if err := database.DB.Preload("Kategori").First(&p, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Penyakit tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"error": false, "data": p})
}

func CreatePenyakit(c *gin.Context) {
	var input PenyakitInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap isi semua kolom!"})
		return
	}

	name := strings.TrimSpace(input.NamaPenyakit)
	var existing models.Penyakit
	if err := database.DB.Where("LOWER(Nama_Penyakit) = ?", strings.ToLower(name)).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Penyakit sudah ada!"})
		return
	}

	p := models.Penyakit{
		KategoriID:   input.KategoriID,
		NamaPenyakit: name,
		Solusi:       strings.TrimSpace(input.Solusi),
	}
	database.DB.Create(&p)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": p})
}

func UpdatePenyakit(c *gin.Context) {
	id := c.Param("id")
	var p models.Penyakit
	if err := database.DB.First(&p, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Penyakit tidak ditemukan"})
		return
	}

	var input PenyakitInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap isi semua kolom!"})
		return
	}

	name := strings.TrimSpace(input.NamaPenyakit)
	var existing models.Penyakit
	if err := database.DB.Where("LOWER(Nama_Penyakit) = ? AND ID_Penyakit <> ?", strings.ToLower(name), id).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Penyakit sudah ada!"})
		return
	}

	p.KategoriID = input.KategoriID
	p.NamaPenyakit = name
	p.Solusi = strings.TrimSpace(input.Solusi)
	database.DB.Save(&p)

	c.JSON(http.StatusOK, gin.H{"error": false, "data": p})
}

func DeletePenyakit(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Penyakit{}, id)
	database.RecalculateRules()
	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Penyakit berhasil dihapus"})
}
