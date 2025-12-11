# 🚀 Quick Start - Complete Deployment Guide

Panduan lengkap untuk deploy aplikasi Service Big Data (Frontend + Backend)

## 📋 Prerequisites

- Akun GitHub (untuk GitHub Pages)
- Akun Render/Railway/Vercel (untuk Backend) - **Gratis**

## 🎯 Step-by-Step Deployment

### Step 1: Deploy Frontend ke GitHub Pages ✅

Frontend **sudah otomatis ter-deploy** ke GitHub Pages!

**URL Frontend**: https://aransyah28.github.io/Service-Big-Data/

**Cara kerja**:
- Setiap push ke branch `main` → GitHub Actions otomatis build & deploy
- File workflow: `.github/workflows/deploy.yml`
- Tidak perlu setup manual, sudah dikonfigurasi!

**Verifikasi**:
1. Go to repository Settings → Pages
2. Pastikan Source: "GitHub Actions"
3. URL tersedia di bagian atas halaman Pages

---

### Step 2: Deploy Backend ke Cloud Platform ⚡

**⚠️ PENTING**: Backend **HARUS** di-deploy terpisah karena GitHub Pages tidak support Python server!

#### Pilihan Platform (Semua Gratis):

<details>
<summary><b>Option A: Render (Recommended) 🌟</b></summary>

**Kelebihan**: 
- Setup paling mudah
- Free tier permanent
- Auto-deploy dari GitHub
- File config sudah tersedia (`render.yaml`)

**Langkah**:
1. Buat akun di [render.com](https://render.com) (sign up dengan GitHub)
2. Dashboard → klik **"New +"** → **"Blueprint"**
3. Connect repository: `Aransyah28/Service-Big-Data`
4. Render otomatis detect file `render.yaml`
5. Klik **"Apply"** → tunggu deployment selesai (~2-3 menit)
6. Backend URL: `https://service-big-data-backend.onrender.com`

**Environment Variable** (otomatis dari render.yaml):
- `ALLOWED_ORIGINS`: `https://aransyah28.github.io`

**Note**: Free tier auto-sleep setelah 15 menit idle. Cold start ~30-60 detik.

</details>

<details>
<summary><b>Option B: Railway 🚂</b></summary>

**Kelebihan**:
- $5/bulan kredit gratis (renews setiap bulan)
- Performa lebih konsisten
- Tidak ada auto-sleep

**Langkah**:
1. Buat akun di [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Pilih repository `Aransyah28/Service-Big-Data`
4. Railway auto-detect Python
5. Settings → tambahkan:
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `ALLOWED_ORIGINS` = `https://aransyah28.github.io`
6. Deploy → copy URL backend

</details>

<details>
<summary><b>Option C: Vercel (Serverless) ⚡</b></summary>

**Kelebihan**:
- Serverless, fast cold starts
- Gratis unlimited untuk personal projects

**Catatan**: Vercel punya limit 10 detik per request (biasanya cukup untuk API ini)

**Langkah**:
1. Buat akun di [vercel.com](https://vercel.com)
2. New Project → Import repository
3. Configure:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
4. Deploy → file `backend/vercel.json` otomatis terdetect
5. Copy backend URL dari deployment

</details>

---

### Step 3: Update Backend URL (Jika Berbeda) 🔧

File `.github/workflows/deploy.yml` sudah dikonfigurasi dengan URL default Render:

```yaml
env:
  VITE_API_URL: https://service-big-data-backend.onrender.com
```

**Jika menggunakan Railway/Vercel**:
1. Edit `.github/workflows/deploy.yml`
2. Ganti `VITE_API_URL` dengan backend URL Anda
3. Commit & push → Frontend akan rebuild dengan URL baru

---

### Step 4: Verifikasi Deployment ✅

#### Test Backend:
```bash
# Test backend API (ganti dengan URL Anda)
curl https://service-big-data-backend.onrender.com/

# Harusnya return JSON dengan API info
```

#### Test Frontend:
1. Buka: https://aransyah28.github.io/Service-Big-Data/
2. Check browser Console (F12) - tidak ada error CORS
3. Dashboard harusnya load data dari backend
4. Visualisasi chart harusnya muncul dengan data

---

## 🎉 Done! Aplikasi Sudah Live

**Frontend**: https://aransyah28.github.io/Service-Big-Data/  
**Backend**: https://service-big-data-backend.onrender.com (atau sesuai platform Anda)

---

## 🐛 Troubleshooting

### Frontend tidak bisa connect ke backend

**Gejala**: Error "Network Error" atau "Failed to fetch" di Console browser

**Solusi**:
1. Pastikan backend sudah deployed dan running
2. Test backend URL langsung di browser
3. Periksa CORS - Environment variable `ALLOWED_ORIGINS` harus sesuai dengan URL frontend
4. Check browser Console untuk detail error

---

### Backend Render auto-sleep

**Gejala**: Request pertama lambat (~30-60 detik)

**Penyebab**: Free tier Render auto-sleep setelah 15 menit idle

**Solusi**:
- Normal behavior untuk free tier
- Upgrade ke paid plan ($7/month) untuk always-on
- Atau gunakan Railway yang tidak auto-sleep (dengan $5 kredit gratis)

---

### GitHub Actions Build Failed

**Gejala**: Deployment failure di Actions tab

**Solusi**:
1. Go to repository → Actions tab
2. Klik failed workflow → lihat error log
3. Biasanya karena dependency error
4. Fix error → commit → otomatis rebuild

---

### Data tidak muncul di Frontend

**Gejala**: Dashboard kosong atau error saat fetch data

**Penyebab**: 
- Backend tidak running
- URL backend salah di config
- Data files tidak ter-commit

**Solusi**:
1. Verifikasi backend URL di `.github/workflows/deploy.yml`
2. Pastikan backend response dengan data valid (test dengan curl)
3. Check file `backend/data/dbd_ml_results.json` ada di repository
4. Trigger rebuild frontend: push dummy commit atau manual redeploy

---

## 📚 Dokumentasi Lengkap

- **Backend Deployment**: [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md)
- **GitHub Pages Setup**: [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)
- **Data Integration**: [DATA_INTEGRATION.md](DATA_INTEGRATION.md)
- **README**: [README.md](README.md)

---

## 💰 Biaya

**Total**: **GRATIS! 🎉**

- GitHub Pages: Gratis unlimited untuk public repo
- Render Free Tier: Gratis permanent (dengan auto-sleep)
- Railway: $5/bulan kredit gratis
- Vercel: Gratis untuk personal projects

Cocok untuk portfolio, demo, atau proyek UAS/tugas kuliah!

---

## 🔄 Update Deployment

### Update Frontend:
```bash
git add .
git commit -m "Update frontend"
git push origin main
# GitHub Actions otomatis deploy
```

### Update Backend:
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render/Railway/Vercel otomatis detect & redeploy
```

---

## 📞 Bantuan

Jika masih ada masalah:
1. Baca dokumentasi lengkap di [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md)
2. Check logs di platform deployment (Render Dashboard / Railway Dashboard)
3. Periksa GitHub Actions logs untuk frontend build issues

---

**Happy Deploying! 🚀**
