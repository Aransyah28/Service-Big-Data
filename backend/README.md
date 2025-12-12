# Backend - DBD ML Analysis API

FastAPI backend untuk analisis Machine Learning kasus Demam Berdarah Dengue (DBD).

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Server
```bash
# Option 1: Using Python directly
python main.py

# Option 2: Using Uvicorn
uvicorn main:app --reload --port 8000
```

Backend akan berjalan di `http://localhost:8000`

### 3. Test API
```bash
# Test root endpoint
curl http://localhost:8000/

# Get monthly results
curl http://localhost:8000/api/monthly-results

# Get model info
curl http://localhost:8000/api/model-info
```

## Production Deployment

⚠️ **PENTING**: Backend ini perlu di-deploy ke platform cloud karena GitHub Pages tidak support aplikasi server.

### Deployment Options

#### Option 1: Render (Recommended)
**Pros**: Free tier, mudah setup, auto-deploy dari GitHub
**Cons**: Auto-sleep setelah 15 menit idle, cold start ~30-60 detik

1. Buat akun di [render.com](https://render.com)
2. Connect GitHub repository
3. Gunakan konfigurasi dari `render.yaml` di root repository
4. Deploy!

**Settings**:
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment Variables:
  - `ALLOWED_ORIGINS=https://aransyah28.github.io`

#### Option 2: Railway
**Pros**: $5/bulan kredit gratis, performa lebih konsisten
**Cons**: Credit-based billing

1. Buat akun di [railway.app](https://railway.app)
2. Deploy from GitHub repo
3. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable: `ALLOWED_ORIGINS=https://aransyah28.github.io`

#### Option 3: Vercel (Serverless)
**Pros**: Gratis, fast cold starts
**Cons**: 10 detik timeout, perlu adaptasi untuk serverless

1. Buat akun di [vercel.com](https://vercel.com)
2. Import repository
3. Set Root Directory: `backend`
4. Gunakan konfigurasi dari `backend/vercel.json`

### Environment Variables

Untuk production, set environment variable berikut:

```bash
ALLOWED_ORIGINS=https://aransyah28.github.io
PYTHON_VERSION=3.9.16  # Optional, untuk Render
```

## API Documentation

Setelah backend berjalan, akses dokumentasi interaktif di:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── main.py              # FastAPI application (API endpoints)
├── data_processor.py    # ML model training & data processing
├── requirements.txt     # Python dependencies
├── vercel.json         # Vercel deployment config
├── data/
│   └── dbd_ml_results.json  # Generated ML results
└── README.md           # This file
```

## Data Files

Backend membutuhkan akses ke:
1. `backend/data/dbd_ml_results.json` - Hasil analisis ML (sudah ter-generate)
2. `data/Kasus_DBD_Gabungan.csv` - Data CSV raw (di root repository)
3. `data/DBD_analysis_final.ipynb` - Jupyter notebook (di root repository)

Pastikan semua file ini ter-commit ke repository untuk deployment.

## API Endpoints

### ML Analysis Endpoints
- `GET /` - API info
- `GET /api/monthly-results` - Data hasil ML per bulan
- `GET /api/factor-summary` - Ringkasan faktor-faktor penting
- `GET /api/model-info` - Info model ML
- `GET /api/regional-data` - Data per kabupaten/kota
- `GET /api/statistics` - Statistik keseluruhan

### Raw Data Endpoints
- `GET /api/raw-data` - Data CSV dengan filter
- `GET /api/raw-data/summary` - Ringkasan data CSV
- `GET /api/available-years` - Tahun-tahun tersedia
- `GET /api/available-regions` - Wilayah-wilayah tersedia
- `GET /api/download/csv` - Download CSV
- `GET /api/download/notebook` - Download Jupyter notebook

## Troubleshooting

### Port sudah digunakan
```bash
# Cek process di port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Atau gunakan port lain
uvicorn main:app --port 8001
```

### Module not found
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Atau gunakan virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Data file not found
Pastikan struktur folder benar:
```
Service-Big-Data/
├── data/
│   ├── Kasus_DBD_Gabungan.csv
│   └── DBD_analysis_final.ipynb
└── backend/
    ├── main.py
    └── data/
        └── dbd_ml_results.json
```

### CORS errors di production
Pastikan environment variable `ALLOWED_ORIGINS` di-set dengan URL frontend yang benar:
```bash
ALLOWED_ORIGINS=https://aransyah28.github.io
```

## Development

### Regenerate ML Results
Jika data CSV diupdate, regenerate hasil analisis:
```bash
python data_processor.py
```

Ini akan membuat/update file `data/dbd_ml_results.json`.

### Add New Endpoints
1. Tambahkan fungsi endpoint di `main.py`
2. Gunakan decorator `@app.get()` atau `@app.post()`
3. Tambahkan Pydantic models jika perlu
4. Test dengan `http://localhost:8000/docs`

## Dependencies

- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Scikit-learn**: Machine Learning
- **Pydantic**: Data validation

## License

Proyek UAS Big Data - Semester 5 - Software Engineering
