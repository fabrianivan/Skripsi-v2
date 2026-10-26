package handlers

import (
	"fmt"
	"net/http"
	"sort"

	"skripsi-mata-backend/database"
	"skripsi-mata-backend/fuzzy"
	"skripsi-mata-backend/models"

	"github.com/gin-gonic/gin"
)

func Konsultasi(c *gin.Context) {
	var req models.KonsultasiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Data request tidak valid"})
		return
	}

	if len(req.Gejala) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "error_msg": "Anda belum memilih gejala!"})
		return
	}

	// 1. Fetch rules for the selected category
	var rules []models.Rule
	database.DB.Where("Kategori_ID = ?", req.KategoriID).
		Preload("Penyakit").
		Preload("Gejala").
		Find(&rules)

	if len(rules) == 0 {
		c.JSON(http.StatusOK, models.KonsultasiResponse{
			Error:             true,
			ErrorMsg:          "Belum ada basis aturan (rules) untuk kategori penyakit ini.",
			MetodeNama:        getMetodeName(req.Metode),
			GejalaTerpicu:     []models.GejalaTerpicuInfo{},
			RuleTerpicu:       []models.RuleTerpicuInfo{},
			HasilDiagnosa:     []models.HasilDiagnosaPenyakit{},
			PenyakitTerpilih:  nil,
			SolusiRekomendasi: "-",
		})
		return
	}

	// Map selected symptoms for easy lookup: ID -> interval
	inputGejalaMap := make(map[uint]float64)
	var inputGejalaIDs []uint
	for _, g := range req.Gejala {
		inputGejalaMap[g.IDGejala] = g.Interval
		inputGejalaIDs = append(inputGejalaIDs, g.IDGejala)
	}

	// Fetch detail of selected symptoms
	var dbGejalas []models.Gejala
	database.DB.Where("ID_Gejala IN ?", inputGejalaIDs).Find(&dbGejalas)
	gejalaDetailMap := make(map[uint]models.Gejala)
	for _, dg := range dbGejalas {
		gejalaDetailMap[dg.IDGejala] = dg
	}

	// Build Gejala Terpicu list with calculated membership degree mu
	var gejalaTerpicuList []models.GejalaTerpicuInfo
	for _, gInput := range req.Gejala {
		dg := gejalaDetailMap[gInput.IDGejala]
		minVal, maxVal := fuzzy.MinMax(gInput.Interval)
		mu := fuzzy.CalculateMembership(gInput.Interval, minVal, maxVal, req.Metode)
		ling := fuzzy.GetLinguisticCategory(gInput.Interval)

		gejalaTerpicuList = append(gejalaTerpicuList, models.GejalaTerpicuInfo{
			IDGejala:     gInput.IDGejala,
			NamaGejala:   dg.NamaGejala,
			GambarGejala: dg.GambarGejala,
			Interval:     gInput.Interval,
			Derajat:      mu,
			KategoriTeks: ling,
		})
	}

	// Group rules by Penyakit
	type DiseaseRuleGroup struct {
		PenyakitID     uint
		NamaPenyakit   string
		Solusi         string
		TotalRules     int
		MatchedRules   int
		MatchedGejala  []models.Gejala
		AllRuleGejalas []models.Gejala
	}

	diseaseMap := make(map[uint]*DiseaseRuleGroup)
	for _, r := range rules {
		if _, ok := diseaseMap[r.IDPenyakit]; !ok {
			pName := ""
			pSolusi := ""
			if r.Penyakit != nil {
				pName = r.Penyakit.NamaPenyakit
				pSolusi = r.Penyakit.Solusi
			}
			diseaseMap[r.IDPenyakit] = &DiseaseRuleGroup{
				PenyakitID:     r.IDPenyakit,
				NamaPenyakit:   pName,
				Solusi:         pSolusi,
				TotalRules:     0,
				MatchedRules:   0,
				MatchedGejala:  []models.Gejala{},
				AllRuleGejalas: []models.Gejala{},
			}
		}

		group := diseaseMap[r.IDPenyakit]
		group.TotalRules++
		if r.Gejala != nil {
			group.AllRuleGejalas = append(group.AllRuleGejalas, *r.Gejala)
		}

		if _, matches := inputGejalaMap[r.IDGejala]; matches {
			group.MatchedRules++
			if r.Gejala != nil {
				group.MatchedGejala = append(group.MatchedGejala, *r.Gejala)
			}
		}
	}

	// Build Rule Terpicu summary
	var ruleTerpicuList []models.RuleTerpicuInfo
	for _, group := range diseaseMap {
		if group.MatchedRules > 0 {
			var matchedNames []string
			for _, mg := range group.MatchedGejala {
				matchedNames = append(matchedNames, mg.NamaGejala)
			}
			ruleTerpicuList = append(ruleTerpicuList, models.RuleTerpicuInfo{
				IDPenyakit:      group.PenyakitID,
				NamaPenyakit:    group.NamaPenyakit,
				TotalGejalaRule: group.TotalRules,
				GejalaCocok:     group.MatchedRules,
				GejalaList:      matchedNames,
			})
		}
	}

	// Calculate Defuzzification & Severity for each triggered disease
	var hasilList []models.HasilDiagnosaPenyakit

	for _, group := range diseaseMap {
		if group.MatchedRules == 0 {
			continue
		}

		var dataItems [][2]float64
		for _, mg := range group.MatchedGejala {
			val := inputGejalaMap[mg.IDGejala]
			minVal, maxVal := fuzzy.MinMax(val)
			mu := fuzzy.CalculateMembership(val, minVal, maxVal, req.Metode)
			dataItems = append(dataItems, [2]float64{val, mu})
		}

		scorePercent := fuzzy.DefuzzifyCentroid(dataItems)
		severity := fuzzy.GetSeverityLabel(scorePercent)

		// Clinical condition filter matching Ivan's thesis rules:
		// Katarak > 50%
		// Miopi > 50%
		// Kegagalan Operasi < 75%
		// Tidak diperlukan operasi > 25%
		keep := true
		if group.NamaPenyakit == "Katarak" && scorePercent > 50 {
			// keep or adjust
		}
		if group.NamaPenyakit == "Kegagalan Operasi Mata" && scorePercent < 75 {
			keep = false
		}
		if group.NamaPenyakit == "Tidak diperlukan operasi katarak" && scorePercent > 25 {
			keep = false
		}

		if keep {
			hasilList = append(hasilList, models.HasilDiagnosaPenyakit{
				IDPenyakit:      group.PenyakitID,
				NamaPenyakit:    group.NamaPenyakit,
				Persentase:      scorePercent,
				TingkatParah:    severity,
				Keterangan:      fmt.Sprintf("%s dengan tingkat keparahan %.2f%% (%s)", group.NamaPenyakit, scorePercent, severity),
				Solusi:          group.Solusi,
				GejalaCocok:     group.MatchedRules,
				TotalGejalaRule: group.TotalRules,
			})
		}
	}

	// Sort results descending by score
	sort.Slice(hasilList, func(i, j int) bool {
		return hasilList[i].Persentase > hasilList[j].Persentase
	})

	var selectedPenyakit *models.HasilDiagnosaPenyakit
	solusi := "Silakan konsultasi lebih lanjut dengan dokter spesialis mata."
	if len(hasilList) > 0 {
		selectedPenyakit = &hasilList[0]
		solusi = hasilList[0].Solusi
	}

	c.JSON(http.StatusOK, models.KonsultasiResponse{
		Error:             false,
		MetodeNama:        getMetodeName(req.Metode),
		GejalaTerpicu:     gejalaTerpicuList,
		RuleTerpicu:       ruleTerpicuList,
		HasilDiagnosa:     hasilList,
		PenyakitTerpilih:  selectedPenyakit,
		SolusiRekomendasi: solusi,
	})
}

func getMetodeName(m int) string {
	if m == fuzzy.MetodeTrapesium {
		return "Fuzzy Trapesium"
	}
	return "Fuzzy Segitiga"
}
