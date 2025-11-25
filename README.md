# Service-Big-Data
Projek UAS Big Data semester 5 diimplementasikan peminatan Software Engineering

## Deskripsi
Aplikasi web untuk menampilkan hasil analisis Machine Learning terhadap kasus Demam Berdarah Dengue (DBD) di Indonesia. Sistem ini menampilkan faktor-faktor yang paling mempengaruhi kasus DBD untuk setiap bulan, lengkap dengan visualisasi data seperti scatter plot, line chart, bar chart, dan lainnya.

## Fitur
- 📊 Dashboard dengan statistik utama dan ringkasan analisis
- 📈 Visualisasi data interaktif (Scatter Plot, Line Chart, Bar Chart, Pie Chart, Area Chart)
- 📋 Data bulanan dengan detail faktor-faktor pengaruh
- 🗺️ Data regional per provinsi
- 🤖 Informasi model Machine Learning yang digunakan

## Teknologi

### Backend
- Python 3.9+
- FastAPI
- Pandas
- Uvicorn

### Frontend
- React 18
- Vite
- Recharts (untuk visualisasi)
- React Router DOM
- Axios

## Instalasi dan Menjalankan

### Backend

```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Jalankan server
python main.py
# atau
uvicorn main:app --reload --port 8000
```

Backend akan berjalan di `http://localhost:8000`

### Frontend

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## API Endpoints

| Endpoint | Deskripsi |
|----------|-----------|
| `GET /` | Info API |
| `GET /api/monthly-results` | Data hasil ML bulanan |
| `GET /api/monthly-results/{month}` | Data hasil ML untuk bulan tertentu |
| `GET /api/factor-summary` | Ringkasan faktor-faktor |
| `GET /api/model-info` | Informasi model ML |
| `GET /api/regional-data` | Data regional per provinsi |
| `GET /api/scatter-plot/{factor}` | Data scatter plot untuk faktor tertentu |
| `GET /api/statistics` | Statistik keseluruhan |
| `GET /api/line-chart-data` | Data untuk line chart |
| `GET /api/bar-chart-data` | Data untuk bar chart |

## Struktur Proyek

```
Service-Big-Data/
├── backend/
│   ├── data/
│   │   └── dbd_ml_results.json    # Data hasil ML
│   ├── main.py                     # FastAPI application
│   └── requirements.txt            # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/             # Komponen React
│   │   ├── pages/                  # Halaman aplikasi
│   │   ├── services/               # API service
│   │   ├── App.jsx                 # Main app component
│   │   └── App.css                 # Styling
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Screenshot
(Screenshots will be added after running the application)

## Kontributor
- Tim Proyek UAS Big Data Semester 5
