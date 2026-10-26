package main

import (
	"log"
	"os"
	"time"

	"skripsi-mata-backend/database"
	"skripsi-mata-backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize SQLite Database with automatic schema migrations & seed data
	dbFile := "skripsi_ivan.db"
	if envPath := os.Getenv("DATABASE_PATH"); envPath != "" {
		dbFile = envPath
	}
	database.InitDB(dbFile)

	r := gin.Default()

	// CORS configuration for Next.js frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000", "*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve static upload images
	_ = os.MkdirAll("uploads", os.ModePerm)
	r.Static("/uploads", "./uploads")

	// API Routes Group
	api := r.Group("/api")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok", "app": "Sistem Pakar Penyakit Mata - Golang API"})
		})

		// Public Auth
		api.POST("/auth/login", handlers.Login)

		// Public Consultation & Diagnosis
		api.POST("/konsultasi", handlers.Konsultasi)
		api.GET("/kategori", handlers.ListKategori)
		api.GET("/kategori/:id", handlers.GetKategori)
		api.GET("/penyakit", handlers.ListPenyakit)
		api.GET("/penyakit/:id", handlers.GetPenyakit)
		api.GET("/gejala", handlers.ListGejala)
		api.GET("/gejala/tree", handlers.GetGejalaTree)
		api.GET("/gejala/:id", handlers.GetGejala)
		api.GET("/rules", handlers.ListRules)

		// Protected Admin Routes
		admin := api.Group("/admin")
		admin.Use(handlers.AuthMiddleware())
		{
			// Auth Profile & Admin Users CRUD
			admin.GET("/profile", handlers.GetProfile)
			admin.GET("/users", handlers.ListAdmins)
			admin.POST("/users", handlers.CreateAdmin)
			admin.PUT("/users/:id", handlers.UpdateAdmin)
			admin.POST("/users/:id/reset-password", handlers.ResetPassword)
			admin.DELETE("/users/:id", handlers.DeleteAdmin)

			// Kategori CRUD
			admin.POST("/kategori", handlers.CreateKategori)
			admin.PUT("/kategori/:id", handlers.UpdateKategori)
			admin.DELETE("/kategori/:id", handlers.DeleteKategori)

			// Penyakit CRUD
			admin.POST("/penyakit", handlers.CreatePenyakit)
			admin.PUT("/penyakit/:id", handlers.UpdatePenyakit)
			admin.DELETE("/penyakit/:id", handlers.DeletePenyakit)

			// Gejala CRUD & Upload
			admin.POST("/gejala", handlers.CreateGejala)
			admin.PUT("/gejala/:id", handlers.UpdateGejala)
			admin.DELETE("/gejala/:id", handlers.DeleteGejala)
			admin.POST("/gejala/upload", handlers.UploadGejalaImage)

			// Rekam Medik CRUD & Recalculate Rules
			admin.GET("/rekammedik", handlers.ListRekamMedik)
			admin.POST("/rekammedik", handlers.CreateRekamMedik)
			admin.DELETE("/rekammedik/:kode", handlers.DeleteRekamMedik)
			admin.POST("/rules/recalculate", handlers.RecalculateRulesHandler)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server Sistem Pakar Penyakit Mata berjalan di http://localhost:%s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
