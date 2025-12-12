# Service-Big-Data
Projek UAS Big Data semester 5 diimplementasikan peminatan Software Engineering

🌐 **Live Demo**: [https://aransyah28.github.io/Service-Big-Data/](https://aransyah28.github.io/Service-Big-Data/)

> ⚡ **ARSITEKTUR BARU - FULL STATIC!**  
> ✅ Tidak perlu backend server - semua data ML sudah di-generate statis  
> ✅ Deploy GRATIS selamanya di GitHub Pages  
> ✅ Tidak ada biaya hosting backend  
> ✅ Lebih cepat - tidak ada API calls  
> 
> 📖 **Panduan Training**: [TRAINING_INSTRUCTIONS.md](TRAINING_INSTRUCTIONS.md)

## 📖 Dokumentasi

| Dokumen | Deskripsi |
|---------|-----------|
| **[📚 TRAINING_INSTRUCTIONS.md](TRAINING_INSTRUCTIONS.md)** | ⭐ **Panduan training model & generate data statis** |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick reference (legacy - untuk backend deployment) |
| [SOLUSI_DEPLOYMENT_CORS.md](SOLUSI_DEPLOYMENT_CORS.md) | Legacy: Deployment backend (tidak diperlukan lagi) |

## Deskripsi
Aplikasi web untuk menampilkan hasil analisis Machine Learning terhadap kasus Demam Berdarah Dengue (DBD) di Jawa Barat. Sistem ini menggunakan data real dari tahun **2016-2024** untuk menganalisis dan memprediksi kasus DBD berdasarkan curah hujan, kepadatan penduduk, dan faktor-faktor lainnya. Aplikasi menampilkan visualisasi interaktif seperti scatter plot, line chart, bar chart, dan pie chart untuk memudahkan pemahaman data.

## Fitur
- 📊 Dashboard dengan statistik utama dan ringkasan analisis
- 📈 Visualisasi data interaktif (Scatter Plot, Line Chart, Bar Chart, Pie Chart, Area Chart)
- 📋 Data bulanan dengan detail faktor-faktor pengaruh (2024)
- 🗺️ Data regional per kabupaten/kota di Jawa Barat (27 kabupaten/kota)
- 🤖 Informasi model Machine Learning (Random Forest Regressor)
- 📥 Download data mentah (CSV) dan notebook analisis
- 🔍 Filter data berdasarkan tahun, bulan, dan wilayah

## Teknologi

### Data Processing & Machine Learning
- Python 3.9+
- Pandas (Data Processing)
- NumPy (Numerical Computing)
- Scikit-learn (Machine Learning - Random Forest)

### Frontend (Static Deployment)
- React 18
- Vite
- Recharts (untuk visualisasi)
- React Router DOM
- Static JSON (pre-generated ML results)

## Arsitektur Aplikasi

**Mode: FULL STATIC** ⚡

Aplikasi ini menggunakan arsitektur **full static** dimana:

1. **Training Offline**: Model ML di-train secara lokal menggunakan script Python
2. **Static Data**: Hasil training disimpan dalam file JSON statis
3. **Frontend Only**: Frontend membaca data JSON tanpa perlu backend server
4. **GitHub Pages**: Deploy gratis dengan GitHub Pages (frontend + data)

**Keuntungan:**
- ✅ Gratis selamanya (tidak perlu hosting backend)
- ✅ Lebih cepat (tidak ada API latency)
- ✅ Lebih reliable (tidak ada server downtime)
- ✅ Mudah maintain (hanya update JSON saat ada data baru)

## Instalasi dan Menjalankan

### Akses Demo Online
Aplikasi sudah di-deploy dan bisa diakses langsung:
- **URL**: [https://aransyah28.github.io/Service-Big-Data/](https://aransyah28.github.io/Service-Big-Data/)
- **Status**: ✅ Fully functional - semua data sudah statis
- **Backend**: ❌ Tidak diperlukan

### Development Lokal

#### Frontend

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

#### Training Model (Optional)

Jika ingin update data atau retrain model:

```bash
# Install Python dependencies
pip install pandas numpy scikit-learn

# Jalankan training script
python train_and_generate_static_data.py
```

Lihat [TRAINING_INSTRUCTIONS.md](TRAINING_INSTRUCTIONS.md) untuk panduan lengkap.

## Update Data

Untuk update data dengan informasi terbaru:

1. Update file `data/Kasus_DBD_Gabungan.csv` dengan data baru
2. Jalankan training script: `python train_and_generate_static_data.py`
3. File `frontend/public/data/ml_results.json` akan di-update
4. Commit dan push ke GitHub
5. GitHub Pages akan auto-deploy

## API Endpoints (Legacy - Tidak Digunakan)

Backend FastAPI masih tersedia di folder `backend/` untuk referensi, tapi tidak digunakan lagi dalam deployment production. Semua data sekarang dibaca dari file JSON statis.

## Struktur Proyek

```
Service-Big-Data/
├── data/                                    # Data folder (root level)
│   ├── Kasus_DBD_Gabungan.csv              # Data CSV real (2016-2024, 2916 records)
│   └── DBD_analysis_final.ipynb            # Jupyter notebook analisis
├── train_and_generate_static_data.py        # Script training & generate JSON statis
├── backend/                                 # Backend (Legacy - tidak digunakan)
│   ├── main.py                              # FastAPI application (reference only)
│   ├── data_processor.py                    # Data processor (reference only)
│   └── requirements.txt                     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── data/
│   │       └── ml_results.json              # ⭐ Data statis hasil training
│   ├── src/
│   │   ├── components/                      # Komponen React
│   │   ├── pages/                           # Halaman aplikasi
│   │   ├── services/
│   │   │   └── api.js                       # Service untuk load data statis
│   │   ├── App.jsx                          # Main app component
│   │   └── App.css                          # Styling
│   ├── package.json
│   └── vite.config.js
├── TRAINING_INSTRUCTIONS.md                 # Panduan training model
└── README.md
```

## Data dan Model Machine Learning

### Dataset
- **Sumber**: Data kasus DBD Jawa Barat (CSV)
- **Periode**: 2016 - 2024 (9 tahun)
- **Total Records**: 2,916 baris
- **Cakupan Wilayah**: Jawa Barat (27 kabupaten/kota)
- **Variabel**: Tahun, bulan, provinsi, kabupaten/kota, kasus bulanan, total tahunan, curah hujan, kepadatan penduduk

### Model Machine Learning
- **Algoritma**: Random Forest Regressor
- **Akurasi Training**: 94.77%
- **Akurasi Testing**: 82.96%
- **Cross-validation Score (R²)**: ~0.83

### Faktor-faktor yang Mempengaruhi DBD (Feature Importance)
1. **Kepadatan Penduduk** (60.3%) - Faktor paling dominan
2. **Interaksi Hujan & Kepadatan** (19.4%) - Kombinasi curah hujan dan kepadatan penduduk
3. **Curah Hujan** (9.2%) - Curah hujan bulanan
4. **Rata-rata Curah Hujan 3 Bulan** (4.7%) - Efek kumulatif curah hujan
5. **Musim (Bulan)** (2.1%) - Pengaruh musim
6. **Curah Hujan Bulan Lalu** (1.2%) - Efek tertunda (lag)

### Statistik Data 2024
- **Total Kasus**: 61,430 kasus
- **Rata-rata per Bulan**: 5,119 kasus
- **Bulan Tertinggi**: Juni (9,091 kasus)
- **Bulan Terendah**: Agustus (1,541 kasus)

## Deployment

### GitHub Pages (Full Static)

Aplikasi di-deploy menggunakan arsitektur **full static** ke GitHub Pages:

**Cara Deploy:**
1. Semua data ML sudah di-generate ke `frontend/public/data/ml_results.json`
2. Push ke branch yang dikonfigurasi (main atau xenove)
3. GitHub Actions otomatis build dan deploy
4. Aplikasi live di: [https://aransyah28.github.io/Service-Big-Data/](https://aransyah28.github.io/Service-Big-Data/)

**Keuntungan:**
- ✅ Gratis selamanya
- ✅ Tidak perlu hosting backend terpisah
- ✅ Tidak ada masalah CORS
- ✅ Load time cepat (semua data lokal)
- ✅ Highly available (CDN GitHub)

**Update Data:**
Jika ada data baru, jalankan training script dan push hasil JSON:

```bash
# 1. Training & generate data baru
python train_and_generate_static_data.py

# 2. Commit dan push
git add frontend/public/data/ml_results.json
git commit -m "Update ML data"
git push origin xenove

# 3. GitHub Pages auto-deploy
```

### Backend (Legacy - Optional)

Folder `backend/` masih tersedia sebagai referensi jika ingin dikembangkan menjadi live service di masa depan. Untuk deployment production saat ini, backend **tidak diperlukan** karena semua data sudah statis.

## Screenshot
(Screenshots akan ditambahkan setelah menjalankan aplikasi)

## Kontributor
- Tim Proyek UAS Big Data Semester 5
