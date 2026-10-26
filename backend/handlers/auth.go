package handlers

import (
	"net/http"
	"strings"
	"time"

	"skripsi-mata-backend/database"
	"skripsi-mata-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var JwtSecret = []byte("skripsi-ivan-expert-system-secret-key-2026")

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type ChangePasswordInput struct {
	NewPassword string `json:"new_password" binding:"required"`
}

type CreateAdminInput struct {
	Name     string `json:"name" binding:"required"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UpdateAdminInput struct {
	Name     string `json:"name" binding:"required"`
	Username string `json:"username" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Username dan password wajib diisi"})
		return
	}

	var admin models.Admin
	res := database.DB.Where("LOWER(Username_Admin) = ?", strings.ToLower(strings.TrimSpace(input.Username))).First(&admin)
	if res.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": true, "error_msg": "Username atau Password tidak cocok. Harap diperiksa lagi!"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordAdmin), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": true, "error_msg": "Username atau Password tidak cocok. Harap diperiksa lagi!"})
		return
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       admin.IDAdmin,
		"username": admin.UsernameAdmin,
		"name":     admin.Name,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(JwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": true, "error_msg": "Gagal generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"error": false,
		"token": tokenString,
		"admin": gin.H{
			"id_admin":       admin.IDAdmin,
			"name":           admin.Name,
			"username_admin": admin.UsernameAdmin,
		},
	})
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": true, "error_msg": "Otorisasi dibutuhkan"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": true, "error_msg": "Format token tidak valid"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return JwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": true, "error_msg": "Token kedaluwarsa atau tidak valid"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("admin_id", claims["id"])
			c.Set("username", claims["username"])
		}

		c.Next()
	}
}

func GetProfile(c *gin.Context) {
	username, _ := c.Get("username")
	var admin models.Admin
	if err := database.DB.Where("Username_Admin = ?", username).First(&admin).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Admin tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"error": false, "data": admin})
}

func ListAdmins(c *gin.Context) {
	var admins []models.Admin
	database.DB.Order("ID_Admin asc").Find(&admins)
	c.JSON(http.StatusOK, gin.H{"error": false, "data": admins})
}

func CreateAdmin(c *gin.Context) {
	var input CreateAdminInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap diisi semua kolom!"})
		return
	}

	var existing models.Admin
	if err := database.DB.Where("LOWER(Username_Admin) = ?", strings.ToLower(strings.TrimSpace(input.Username))).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Username sudah dimasukkan!"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": true, "error_msg": "Gagal enkripsi password"})
		return
	}

	admin := models.Admin{
		Name:          strings.TrimSpace(input.Name),
		UsernameAdmin: strings.ToLower(strings.TrimSpace(input.Username)),
		PasswordAdmin: string(hashed),
	}

	if err := database.DB.Create(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": true, "error_msg": "Gagal menyimpan admin"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"error": false, "data": admin})
}

func UpdateAdmin(c *gin.Context) {
	id := c.Param("id")
	var admin models.Admin
	if err := database.DB.First(&admin, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Admin tidak ditemukan"})
		return
	}

	var input UpdateAdminInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Harap diisi semua kolom!"})
		return
	}

	var existing models.Admin
	if err := database.DB.Where("LOWER(Username_Admin) = ? AND ID_Admin <> ?", strings.ToLower(strings.TrimSpace(input.Username)), id).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Username sudah digunakan!"})
		return
	}

	admin.Name = strings.TrimSpace(input.Name)
	admin.UsernameAdmin = strings.ToLower(strings.TrimSpace(input.Username))
	database.DB.Save(&admin)

	c.JSON(http.StatusOK, gin.H{"error": false, "data": admin})
}

func ResetPassword(c *gin.Context) {
	id := c.Param("id")
	var admin models.Admin
	if err := database.DB.First(&admin, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": true, "error_msg": "Admin tidak ditemukan"})
		return
	}

	var input ChangePasswordInput
	if err := c.ShouldBindJSON(&input); err != nil || len(input.NewPassword) < 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Password baru minimal 4 karakter"})
		return
	}

	hashed, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	admin.PasswordAdmin = string(hashed)
	database.DB.Save(&admin)

	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Password berhasil diubah"})
}

func DeleteAdmin(c *gin.Context) {
	id := c.Param("id")
	var count int64
	database.DB.Model(&models.Admin{}).Count(&count)
	if count <= 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Tidak dapat menghapus admin terakhir"})
		return
	}

	database.DB.Delete(&models.Admin{}, id)
	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Admin berhasil dihapus"})
}
