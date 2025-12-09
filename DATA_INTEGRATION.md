# Integrasi Data CSV dan Notebook dengan Backend

## Ringkasan

Repository ini telah diintegrasikan dengan data sebenarnya dari file CSV dan Jupyter notebook yang tersedia di folder `data/`.

## File Data

### 1. CSV Data (`data/Kasus_DBD_Gabungan.csv`)
- **Deskripsi**: Data kasus Demam Berdarah Dengue (DBD) di Jawa Barat
- **Periode**: 2016 - 2024
- **Total Record**: 2,916 baris
- **Provinsi**: Jawa Barat (27 kabupaten/kota)
- **Kolom**:
  - `tahun`: Tahun data
  - `bulan`: Bulan (1-12)
  - `nama_provinsi`: Nama provinsi
  - `nama_kabupaten_kota`: Nama kabupaten/kota
  - `kasus_bulanan`: Jumlah kasus DBD per bulan
  - `total_tahunan`: Total kasus dalam setahun
  - `jumlah_curah_hujan`: Curah hujan (mm)
  - `kepadatan_penduduk`: Kepadatan penduduk per km²

### 2. Jupyter Notebook (`data/DBD_analysis_final.ipynb`)
- **Deskripsi**: Analisis Machine Learning untuk prediksi kasus DBD
- **Total Cells**: 13 cells (semua code cells)
- **Proses Analisis**:
  1. Data Loading & Preprocessing
  2. Feature Engineering (lag features, rolling means)
  3. Feature Selection (Mutual Information, RFE, Wrapper Methods)
  4. Model Training (Random Forest Regressor)
  5. Feature Importance Analysis
  6. Model Evaluation

## Komponen Backend

### 1. Data Processor (`backend/data_processor.py`)
Script Python yang mengintegrasikan logic dari notebook ke dalam backend:
- Memuat dan memproses data CSV
- Melakukan feature engineering (lag features, rolling means, interaksi)
- Melatih model Random Forest Regressor
- Menghasilkan hasil analisis dalam format JSON

**Cara menggunakan**:
```bash
cd backend
python3 data_processor.py
```

Output: `backend/data/dbd_ml_results.json`

### 2. Backend API (`backend/main.py`)
FastAPI backend yang menyediakan endpoint untuk:

#### Endpoint Analisis ML (sudah ada sebelumnya):
- `GET /api/monthly-results` - Hasil analisis per bulan
- `GET /api/factor-summary` - Ringkasan faktor-faktor
- `GET /api/model-info` - Informasi model ML
- `GET /api/regional-data` - Data per provinsi
- `GET /api/statistics` - Statistik keseluruhan
- `GET /api/scatter-plot/{factor}` - Data untuk scatter plot
- `GET /api/line-chart-data` - Data untuk line chart
- `GET /api/bar-chart-data` - Data untuk bar chart

#### Endpoint Data Mentah (baru):
- `GET /api/raw-data` - Akses data CSV dengan filter
  - Query params: `limit`, `offset`, `province`, `year`
- `GET /api/raw-data/summary` - Ringkasan data CSV
- `GET /api/notebook-info` - Informasi tentang notebook
- `GET /api/download/csv` - Download file CSV
- `GET /api/download/notebook` - Download file notebook

## Model Machine Learning

### Random Forest Regressor
- **Training Accuracy**: 94.77%
- **Test Accuracy**: 82.96%
- **Total Data Points**: 2,916
- **Periode Training**: 2016-2024

### Features Used
1. `kepadatan_penduduk` - Kepadatan penduduk (importance: 64.0%)
2. `rain_x_density` - Interaksi curah hujan & kepadatan (importance: 17.5%)
3. `jumlah_curah_hujan` - Curah hujan bulanan (importance: 10.5%)
4. `rain_3m_mean` - Rata-rata curah hujan 3 bulan (importance: 4.7%)
5. `bulan` - Musim (importance: 2.1%)
6. `rain_lag1` - Curah hujan bulan lalu (importance: 1.2%)

### Hasil Analisis
Data yang dihasilkan backend sekarang menggunakan data sebenarnya dari CSV:
- **Total Kasus 2024**: 61,430 kasus
- **Rata-rata per Bulan**: 5,119 kasus
- **Bulan Tertinggi**: Juni (9,091 kasus)
- **Bulan Terendah**: Agustus (1,541 kasus)
- **Faktor Dominan**: Kepadatan Penduduk (di semua bulan)

## Cara Menjalankan

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Generate Data dari CSV
```bash
cd backend
python3 data_processor.py
```

### 3. Jalankan Backend
```bash
cd backend
python3 main.py
```

Backend akan berjalan di `http://localhost:8000`

### 4. Test API
```bash
# Root endpoint dengan info
curl http://localhost:8000/

# Data mentah dengan filter
curl "http://localhost:8000/api/raw-data?year=2024&limit=10"

# Ringkasan data
curl http://localhost:8000/api/raw-data/summary

# Info notebook
curl http://localhost:8000/api/notebook-info

# Hasil analisis ML
curl http://localhost:8000/api/monthly-results
```

## Teknologi yang Digunakan

### Backend
- **FastAPI**: Web framework untuk API
- **Pandas**: Data manipulation dan analisis
- **NumPy**: Operasi numerik
- **Scikit-learn**: Machine Learning (Random Forest)
- **Uvicorn**: ASGI server

### Data Processing
- **Feature Engineering**: Lag features, rolling averages, interaction features
- **Feature Selection**: Mutual Information, RFE (Recursive Feature Elimination)
- **Model**: Random Forest Regressor dengan 250 estimators

## Struktur File

```
Service-Big-Data/
├── data/                           # Data folder (root level)
│   ├── Kasus_DBD_Gabungan.csv     # CSV data asli
│   └── DBD_analysis_final.ipynb   # Jupyter notebook
├── backend/
│   ├── main.py                     # FastAPI backend
│   ├── data_processor.py           # Script untuk memproses CSV
│   ├── requirements.txt            # Dependencies
│   └── data/
│       └── dbd_ml_results.json    # Hasil analisis (generated)
└── frontend/
    └── ...                         # React frontend
```

## Catatan

1. Data yang digunakan adalah data **real** dari CSV, bukan data dummy
2. Model ML di-train menggunakan data sebenarnya dengan accuracy 82.96%
3. Backend menyediakan akses ke data mentah melalui API
4. File notebook dan CSV dapat didownload melalui API
5. Semua endpoint mendukung CORS untuk integrasi dengan frontend

## Update Berikutnya

Untuk memperbarui data:
1. Update file CSV di `data/Kasus_DBD_Gabungan.csv`
2. Jalankan `python3 backend/data_processor.py` untuk regenerate JSON
3. Restart backend server

Model akan otomatis di-retrain dengan data terbaru.
