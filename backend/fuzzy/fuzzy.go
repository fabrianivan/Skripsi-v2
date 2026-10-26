package fuzzy

import (
	"math"
)

// MetodeEnum: 0 = Segitiga, 1 = Trapesium
const (
	MetodeSegitiga  = 0
	MetodeTrapesium = 1
)

// MinMax returns min and max bounds based on symptom interval input
func MinMax(val float64) (min float64, max float64) {
	if val >= 0 && val <= 0.4 {
		return 0.0, 0.4
	} else if val >= 0.3 && val <= 0.7 {
		return 0.3, 0.7
	} else if val >= 0.6 && val <= 1.0 {
		return 0.6, 1.0
	}
	return 0.0, 1.0
}

// CalculateMembership computes fuzzy degree of membership mu(x)
func CalculateMembership(interval float64, min float64, max float64, metode int) float64 {
	var mu float64

	if metode == MetodeSegitiga {
		if interval <= min || interval >= max {
			mu = 0.0
		} else {
			mid := ((max - min) / 2.0) + min
			if interval >= min && interval <= mid {
				mu = (interval - min) / ((max - min) / 2.0)
			} else {
				mu = (max - interval) / (max - mid)
			}
		}
	} else {
		// Trapesium
		if interval <= min || interval >= max {
			mu = 0.0
		} else if interval >= min && interval <= min+0.1 {
			mu = (interval - min) / 0.1
		} else if interval >= min+0.1 && interval <= max-0.1 {
			mu = 1.0
		} else {
			mu = (max - interval) / (max - (max - 0.1))
		}
	}

	if mu < 0 {
		mu = 0
	}
	if mu > 1 {
		mu = 1
	}

	return mu
}

// DefuzzifyCentroid computes weighted average (top / down) * 100
// dataItems: list of (interval, mu)
func DefuzzifyCentroid(dataItems [][2]float64) float64 {
	var top float64
	var down float64

	for _, item := range dataItems {
		interval := item[0]
		mu := item[1]
		top += mu * interval
		down += mu
	}

	if down == 0 {
		return 0.0
	}

	result := (top / down) * 100.0
	return math.Round(result*100) / 100
}

// GetSeverityLabel returns the qualitative linguistic label for a percentage score
func GetSeverityLabel(hasil float64) string {
	if hasil <= 25.0 {
		return "Ringan"
	} else if hasil <= 50.0 {
		return "Agak Parah"
	} else if hasil <= 75.0 {
		return "Parah"
	}
	return "Sangat Parah"
}

// GetLinguisticCategory explains a single interval value
func GetLinguisticCategory(val float64) string {
	if val <= 0.2 {
		return "Ringan"
	} else if val <= 0.4 {
		return "Sedikit Parah"
	} else if val <= 0.7 {
		return "Agak Parah"
	} else if val <= 0.85 {
		return "Parah"
	}
	return "Sangat Parah"
}
