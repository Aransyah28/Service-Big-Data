# 📚 Panduan Training Model ML dan Generate Data Statis

## 🎯 Overview

Proyek ini telah diubah menjadi **static deployment** yang tidak memerlukan backend server (FastAPI). Semua data hasil analisis Machine Learning disimpan dalam file JSON statis yang dibaca langsung oleh frontend.

**Keuntungan:**
- ✅ Tidak perlu backend server (hemat biaya)
- ✅ Deploy frontend + backend di GitHub Pages
- ✅ Lebih cepat karena tidak ada API calls
- ✅ Tidak ada masalah CORS
- ✅ Gratis selamanya!

## 📋 Prerequisites

Sebelum melakukan training, pastikan Anda memiliki:

1. **Python 3.8+** terinstall di komputer
2. **Dependencies Python:**
   - pandas
   - numpy
   - scikit-learn

## 🚀 Cara Training Model dan Generate Data Statis

### Step 1: Install Dependencies

```bash
# Pastikan Anda berada di root directory project
cd Service-Big-Data

# Install dependencies Python
pip install pandas numpy scikit-learn
```

### Step 2: Jalankan Training Script

```bash
# Jalankan script training
python train_and_generate_static_data.py
```

Script ini akan:
1. ✅ Load data dari `data/Kasus_DBD_Gabungan.csv`
2. ✅ Preprocessing data (feature engineering, lag features, rolling means)
3. ✅ Train Random Forest Regressor model
4. ✅ Generate data untuk SEMUA tahun (2016-2024)
5. ✅ Simpan hasil ke `frontend/public/data/ml_results.json`

### Step 3: Output yang Dihasilkan

File yang akan di-generate:
```
frontend/public/data/ml_results.json
```

File ini berisi:
- ✅ Data hasil ML untuk semua tahun (2016-2024)
- ✅ Model information (accuracy, features, etc)
- ✅ Factor summary (feature importance)
- ✅ Monthly results per year
- ✅ Regional data per year

### Step 4: Test Frontend Locally

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

Buka browser di `http://localhost:5173` dan pastikan semua data tampil dengan benar.

## 📊 Kapan Perlu Re-training?

Anda perlu menjalankan training ulang ketika:

1. **Update Data CSV**: Ada data baru ditambahkan ke `data/Kasus_DBD_Gabungan.csv`
2. **Perubahan Model**: Mengubah parameter model atau algoritma ML
3. **Update Feature Engineering**: Menambah/mengubah fitur baru

## 🔄 Workflow Update Data

```bash
# 1. Update CSV dengan data terbaru
# Edit: data/Kasus_DBD_Gabungan.csv

# 2. Jalankan training
python train_and_generate_static_data.py

# 3. Test di local
cd frontend
npm run dev

# 4. Jika OK, commit dan push
git add frontend/public/data/ml_results.json
git commit -m "Update ML data with latest training results"
git push origin xenove

# 5. Deploy akan otomatis via GitHub Pages
```

## 📁 Struktur File

```
Service-Big-Data/
├── data/
│   └── Kasus_DBD_Gabungan.csv          # Data CSV sumber (2916 records)
├── train_and_generate_static_data.py    # Script training & generate
└── frontend/
    └── public/
        └── data/
            └── ml_results.json          # Output: Data statis untuk frontend
```

## 🎯 Model Information

**Model yang digunakan:**
- **Algoritma**: Random Forest Regressor
- **Parameters**:
  - n_estimators: 250
  - max_depth: 15
  - min_samples_split: 5
  - random_state: 2

**Features yang digunakan:**
1. `jumlah_curah_hujan` - Curah hujan bulanan
2. `rain_lag1` - Curah hujan bulan lalu (lag feature)
3. `rain_3m_mean` - Rata-rata curah hujan 3 bulan
4. `kepadatan_penduduk` - Kepadatan penduduk
5. `rain_x_density` - Interaksi curah hujan × kepadatan
6. `bulan` - Bulan (seasonal effect)

**Expected Accuracy:**
- Training Accuracy: ~94.7%
- Test Accuracy: ~80.6%
- R² Score: ~0.806

## 🐛 Troubleshooting

### Error: Module not found

```bash
# Install missing modules
pip install pandas numpy scikit-learn
```

### Error: CSV file not found

Pastikan file `data/Kasus_DBD_Gabungan.csv` ada di folder data.

### Data tidak muncul di frontend

1. Cek apakah file `frontend/public/data/ml_results.json` ada
2. Buka browser console untuk lihat error
3. Pastikan path `/data/ml_results.json` benar (relatif ke public folder)

## 📝 Notes

- Data JSON yang di-generate berukuran ~137 KB (sangat kecil!)
- Frontend akan load semua data sekali saat pertama kali dibuka
- Filtering berdasarkan tahun dilakukan di frontend (tidak perlu API call)
- Model tidak disimpan karena hanya digunakan untuk training

## 🎉 Deploy ke GitHub Pages

Setelah data di-generate:

```bash
# Commit changes
git add .
git commit -m "Update static ML data"

# Push ke branch xenove
git push origin xenove

# GitHub Pages akan otomatis deploy frontend + data statis
```

**URL Deploy:**
- Frontend: `https://aransyah28.github.io/Service-Big-Data/`
- Data: `https://aransyah28.github.io/Service-Big-Data/data/ml_results.json`

## ❓ FAQ

**Q: Apakah backend masih diperlukan?**
A: Tidak! Semua sudah statis. Backend hanya referensi jika ingin dikembangkan lagi.

**Q: Bagaimana cara update data?**
A: Update CSV → Run training script → Commit JSON → Push. Done!

**Q: Apakah bisa deploy di platform lain?**
A: Ya! Karena statis, bisa deploy di Vercel, Netlify, Cloudflare Pages, dll.

**Q: File JSON terlalu besar?**
A: Tidak, hanya ~137 KB. Sangat ringan untuk modern web.

## 📞 Support

Jika ada masalah, buka issue di GitHub repository atau hubungi maintainer.

---

**Last Updated**: 2024
**Version**: 2.0 (Static Mode)
