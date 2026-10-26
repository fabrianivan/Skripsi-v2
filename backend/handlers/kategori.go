package handlers

import (
	"net/http"
	"strings"

	"skripsi-mata-backend/database"
	"skripsi-mata-backend/models"

	"github.com/gin-gonic/gin"
)

type KategoriInput struct {
	NamaKategori string `json:"nama_kategori" binding:"required"`
}

func ListKategori(c *gin.Context) {
	var list []models.Kategori
	database.DB.Order("Kategori_Penyakit asc").Find(&list)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": list})
}

func GetKategori(c *gin.Context) {
	id := c.Param("id")
	var k models.Kategori
	if err := database.DB.First(&k, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Kategori tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"error": false, "data": k})
}

func CreateKategori(c *gin.Context) {
	var input KategoriInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap isi semua kolom!"})
		return
	}

	name := strings.TrimSpace(input.NamaKategori)
	var existing models.Kategori
	if err := database.DB.Where("LOWER(Nama_Kategori) = ?", strings.ToLower(name)).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Kategori sudah dimasukkan!"})
		return
	}

	k := models.Kategori{NamaKategori: name}
	database.DB.Create(&k)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": k})
}

func UpdateKategori(c *gin.Context) {
	id := c.Param("id")
	var k models.Kategori
	if err := database.DB.First(&k, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Kategori tidak ditemukan"})
		return
	}

	var input KategoriInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap isi semua kolom!"})
		return
	}

	name := strings.TrimSpace(input.NamaKategori)
	var existing models.Kategori
	if err := database.DB.Where("LOWER(Nama_Kategori) = ? AND Kategori_Penyakit <> ?", strings.ToLower(name), id).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Kategori sudah dimasukkan!"})
		return
	}

	k.NamaKategori = name
	database.DB.Save(&k)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": k})
}

func DeleteKategori(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Kategori{}, id)
	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Kategori berhasil dihapus"})
}
