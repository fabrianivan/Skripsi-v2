package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"skripsi-mata-backend/database"
	"skripsi-mata-backend/fuzzy"
	"skripsi-mata-backend/models"

	"github.com/gin-gonic/gin"
)

type GejalaInput struct {
	KategoriID   uint    `json:"kategori_id" binding:"required"`
	ParentID     uint    `json:"parent_id"`
	NamaGejala   string  `json:"nama_gejala" binding:"required"`
	GambarGejala string  `json:"gambar_gejala"`
	Interval     float64 `json:"interval"`
}

func ListGejala(c *gin.Context) {
	kategoriID := c.Query("kategori_id")
	parentID := c.Query("parent_id")

	var list []models.Gejala
	query := database.DB.Preload("Kategori").Order("ID_Gejala asc")

	if kategoriID != "" {
		query = query.Where("Kategori_ID = ?", kategoriID)
	}
	if parentID != "" {
		query = query.Where("Parent_ID = ?", parentID)
	}

	query.Find(&list)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": list})
}

// GetGejalaTree returns hierarchical parents and their children for consultation and diagnosis UI
func GetGejalaTree(c *gin.Context) {
	kategoriID := c.DefaultQuery("kategori_id", "1")

	var parents []models.Gejala
	database.DB.Where("Parent_ID = 0 AND Kategori_ID = ?", kategoriID).Order("Nama_Gejala asc").Find(&parents)

	var allChildren []models.Gejala
	database.DB.Where("Parent_ID > 0 AND Kategori_ID = ?", kategoriID).Order("ID_Gejala asc").Find(&allChildren)

	childrenByParent := make(map[uint][]models.Gejala)
	for _, child := range allChildren {
		childrenByParent[child.ParentID] = append(childrenByParent[child.ParentID], child)
	}

	for i := range parents {
		children, hasChild := childrenByParent[parents[i].IDGejala]
		parents[i].HasChild = hasChild
		parents[i].Children = children
	}

	c.JSON(http.StatusOK, gin.H{"error": false, "data": parents})
}

func GetGejala(c *gin.Context) {
	id := c.Param("id")
	var g models.Gejala
	if err := database.DB.Preload("Kategori").First(&g, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Gejala tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"error": false, "data": g})
}

func CreateGejala(c *gin.Context) {
	var input GejalaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap isi semua kolom!"})
		return
	}

	name := strings.TrimSpace(input.NamaGejala)
	var existing models.Gejala
	if err := database.DB.Where("LOWER(Nama_Gejala) = ?", strings.ToLower(name)).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Gejala sudah dimasukkan!"})
		return
	}

	gambar := strings.TrimSpace(input.GambarGejala)
	if gambar == "" {
		gambar = "notfound.jpg"
	}

	minVal, maxVal := fuzzy.MinMax(input.Interval)

	g := models.Gejala{
		KategoriID:   input.KategoriID,
		ParentID:     input.ParentID,
		NamaGejala:   name,
		GambarGejala: gambar,
		Interval:     input.Interval,
		Min:          minVal,
		Max:          maxVal,
	}

	database.DB.Create(&g)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": g})
}

func UpdateGejala(c *gin.Context) {
	id := c.Param("id")
	var g models.Gejala
	if err := database.DB.First(&g, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Gejala tidak ditemukan"})
		return
	}

	var input GejalaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap isi semua kolom!"})
		return
	}

	name := strings.TrimSpace(input.NamaGejala)
	var existing models.Gejala
	if err := database.DB.Where("LOWER(Nama_Gejala) = ? AND ID_Gejala <> ?", strings.ToLower(name), id).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Gejala sudah dimasukkan!"})
		return
	}

	minVal, maxVal := fuzzy.MinMax(input.Interval)

	g.KategoriID = input.KategoriID
	g.ParentID = input.ParentID
	g.NamaGejala = name
	if input.GambarGejala != "" {
		g.GambarGejala = input.GambarGejala
	}
	g.Interval = input.Interval
	g.Min = minVal
	g.Max = maxVal

	database.DB.Save(&g)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": g})
}

func DeleteGejala(c *gin.Context) {
	id := c.Param("id")

	// Check if this symptom is a parent to other symptoms
	var childCount int64
	database.DB.Model(&models.Gejala{}).Where("Parent_ID = ?", id).Count(&childCount)
	if childCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":     true,
			"error_msg": "Gejala harus dihapus terlebih dahulu sebelum menghapus kategori gejala induk",
		})
		return
	}

	database.DB.Delete(&models.Gejala{}, id)
	database.RecalculateRules()
	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Gejala berhasil dihapus"})
}

func UploadGejalaImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "File gambar tidak ditemukan"})
		return
	}

	ext := filepath.Ext(file.Filename)
	newFileName := fmt.Sprintf("gejala_%d%s", time.Now().UnixNano(), ext)
	dst := filepath.Join("uploads", newFileName)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": true, "error_msg": "Gagal menyimpan gambar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"error": false, "filename": newFileName, "url": "/uploads/" + newFileName})
}
