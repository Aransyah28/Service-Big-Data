# 🆓 Alternatif Deployment Backend GRATIS (Tanpa Kartu Kredit)

**Update**: Render sekarang meminta kartu kredit, Railway berbayar, dan Vercel sering error. Berikut adalah **alternatif deployment GRATIS** yang masih bisa digunakan **TANPA kartu kredit**.

## 📋 Ringkasan Platform Gratis

| Platform | Free Tier | Kebutuhan CC | Auto-Sleep | Setup |
|----------|-----------|--------------|------------|-------|
| **Koyeb** ⭐ | ✅ Gratis Permanen | ❌ Tidak Perlu | ✅ Ya (30min) | ⭐⭐⭐⭐⭐ Mudah |
| **Fly.io** | ✅ Gratis Limited | ❌ Tidak Perlu | ⚠️ Auto-stop* | ⭐⭐⭐⭐ Mudah |
| **PythonAnywhere** | ✅ Gratis Permanen | ❌ Tidak Perlu | ❌ Always On | ⭐⭐⭐⭐⭐ Mudah |
| **Glitch** | ✅ Gratis Permanen | ❌ Tidak Perlu | ✅ Ya (5min) | ⭐⭐⭐ Sedang |

*Fly.io free tier: machines auto-stop when idle, auto-start on requests (~10-30s cold start)

---

## 🌟 Option 1: Koyeb (RECOMMENDED)

**Kelebihan**:
- ✅ **TIDAK PERLU KARTU KREDIT**
- ✅ Free tier permanen
- ✅ Deploy langsung dari GitHub
- ✅ HTTPS otomatis
- ✅ Support Python/FastAPI native
- ✅ Dashboard monitoring bagus

**Limitasi**:
- Auto-sleep setelah 30 menit idle
- 512 MB RAM
- Cold start ~10-20 detik

### Langkah Deploy ke Koyeb:

#### 1. Buat Akun
1. Buka [https://www.koyeb.com/](https://www.koyeb.com/)
2. Sign up dengan GitHub (GRATIS, tidak perlu kartu kredit)
3. Verifikasi email

#### 2. Deploy Backend

1. **Di Dashboard Koyeb**, klik **"Create App"**

2. **Select Deployment Method**:
   - Pilih **"GitHub"**
   - Connect repository: `Aransyah28/Service-Big-Data`
   - Branch: `main`

3. **Configure Service**:
   - **Name**: `service-big-data-backend`
   - **Region**: Frankfurt (atau terdekat dengan Indonesia)
   - **Builder**: `Buildpack`
   - **Build command**: Leave empty (auto-detect)
   - **Run command**: 
     ```bash
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

4. **Environment Variables**:
   - Klik **"Add Variable"**
   - `ALLOWED_ORIGINS` = `https://aransyah28.github.io`
   - `PORT` = `8000` (optional, Koyeb akan set otomatis)

5. **Instance Type**:
   - Pilih **"Free"** (Nano instance)

6. Klik **"Deploy"**

#### 3. Dapatkan URL Backend
- Setelah deploy selesai (~2-3 menit)
- URL akan seperti: `https://service-big-data-backend-YOUR-NAME.koyeb.app`
- Copy URL ini untuk update di frontend

#### 4. Update Frontend Configuration

Edit file `.github/workflows/deploy.yml` line 44:
```yaml
env:
  VITE_API_URL: https://service-big-data-backend-YOUR-NAME.koyeb.app
```

Commit dan push untuk rebuild frontend.

---

## 🚀 Option 2: Fly.io

**Kelebihan**:
- ✅ **TIDAK PERLU KARTU KREDIT** (untuk start)
- ✅ Free tier dengan resource bagus
- ✅ Always-on (tidak auto-sleep)
- ✅ Deploy via CLI, mudah
- ✅ Multiple regions worldwide

**Limitasi**:
- Free allowance terbatas (3 shared-cpu VMs)
- Perlu install CLI

### Langkah Deploy ke Fly.io:

#### 1. Install Fly CLI

**Windows (PowerShell)**:
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux**:
```bash
curl -L https://fly.io/install.sh | sh
```

#### 2. Login & Setup

```bash
# Login ke Fly.io
fly auth signup
# atau jika sudah punya akun:
fly auth login

# Masuk ke folder backend
cd backend
```

#### 3. Buat Dockerfile

Buat file `backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

#### 4. Initialize & Deploy

```bash
# Initialize Fly app
fly launch

# Ikuti prompt:
# - App name: service-big-data-backend
# - Region: Singapore (sin) atau Hong Kong (hkg)
# - PostgreSQL: No
# - Redis: No

# Set environment variables
fly secrets set ALLOWED_ORIGINS="https://aransyah28.github.io"

# Deploy
fly deploy
```

#### 5. Dapatkan URL
```bash
fly info
# URL akan seperti: https://service-big-data-backend.fly.dev
```

---

## 🐍 Option 3: PythonAnywhere

**Kelebihan**:
- ✅ **TIDAK PERLU KARTU KREDIT**
- ✅ Gratis permanen
- ✅ Always-on (tidak auto-sleep)
- ✅ Web console (tidak perlu CLI)
- ✅ Perfect untuk Python apps

**Limitasi**:
- Agak lambat (shared CPU)
- Setup manual via web console
- Domain format: `username.pythonanywhere.com`

### Langkah Deploy ke PythonAnywhere:

#### 1. Buat Akun
1. Buka [https://www.pythonanywhere.com/](https://www.pythonanywhere.com/)
2. Sign up **"Beginner" account** (GRATIS permanen)
3. Confirm email

#### 2. Upload Code

1. **Dashboard** → **"Files"**
2. Buat folder: `/home/yourusername/service-big-data`
3. Upload semua file dari folder `backend/` ke folder tersebut

**Atau clone dari GitHub via console**:
1. Dashboard → **"Consoles"** → **"Bash"**
2. Jalankan:
```bash
cd ~
git clone https://github.com/Aransyah28/Service-Big-Data.git
cd Service-Big-Data/backend
pip install --user -r requirements.txt
```

#### 3. Setup Web App

1. Dashboard → **"Web"** → **"Add a new web app"**
2. Domain: `yourusername.pythonanywhere.com` (gratis)
3. Python framework: **"Manual configuration"**
4. Python version: **Python 3.9**

#### 4. Configure WSGI

1. Di Web tab, klik **"WSGI configuration file"**
2. Hapus semua isi, replace dengan:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/Service-Big-Data/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['ALLOWED_ORIGINS'] = 'https://aransyah28.github.io'

# Import FastAPI app
from main import app

# This is what PythonAnywhere needs
application = app
```

3. Save file

#### 5. Reload Web App

1. Kembali ke Web tab
2. Klik **"Reload yourusername.pythonanywhere.com"**
3. Backend URL: `https://yourusername.pythonanywhere.com`

---

## 🎨 Option 4: Glitch

**Kelebihan**:
- ✅ **TIDAK PERLU KARTU KREDIT**
- ✅ Gratis permanen
- ✅ Web IDE (edit langsung di browser)
- ✅ Live coding & auto-deploy

**Limitasi**:
- Auto-sleep setelah 5 menit idle
- Cold start lambat (~30-60 detik)
- Resource terbatas

### Langkah Deploy ke Glitch:

#### 1. Buat Akun
1. Buka [https://glitch.com/](https://glitch.com/)
2. Sign in dengan GitHub

#### 2. Import Project

1. Klik **"New Project"** → **"Import from GitHub"**
2. Paste URL: `https://github.com/Aransyah28/Service-Big-Data`

#### 3. Configure

1. Glitch akan auto-import, tunggu selesai
2. Edit file `glitch.json` (buat baru jika belum ada):
```json
{
  "install": "cd backend && pip install -r requirements.txt",
  "start": "cd backend && uvicorn main:app --host 0.0.0.0 --port 3000",
  "watch": {
    "ignore": [
      "\\.pyc$"
    ]
  }
}
```

3. Buat file `.env` di root:
```
ALLOWED_ORIGINS=https://aransyah28.github.io
PORT=3000
```

4. Glitch akan auto-restart

#### 4. Dapatkan URL
- URL akan seperti: `https://your-project-name.glitch.me`

---

## 🔍 Cara Mengecek CORS Tidak Error

### 1. Test Backend CORS Langsung

**Test dengan curl**:
```bash
curl -H "Origin: https://aransyah28.github.io" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend-url.com/api/monthly-results -v
```

**Response yang benar harus include**:
```
< Access-Control-Allow-Origin: https://aransyah28.github.io
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
< Access-Control-Allow-Headers: Content-Type
```

### 2. Test di Browser Developer Tools

1. Buka frontend: `https://aransyah28.github.io/Service-Big-Data/`
2. Tekan **F12** untuk buka Developer Tools
3. Tab **Console**
4. Lihat pesan error:

**✅ TIDAK ADA ERROR CORS** (Benar):
```
200 OK
```

**❌ ADA ERROR CORS** (Salah):
```
Access to fetch at 'https://backend-url/api/...' from origin 'https://aransyah28.github.io' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

### 3. Test CORS dengan Online Tool

**Gunakan CORS Tester**:
1. Buka: [https://www.test-cors.org/](https://www.test-cors.org/)
2. **Remote URL**: `https://your-backend-url.com/api/monthly-results`
3. **Origin**: `https://aransyah28.github.io`
4. Klik **"Send Request"**
5. Cek response headers

### 4. Debugging CORS Issue

Jika ada error CORS, cek:

1. **Environment Variable di Backend**:
   ```bash
   # Pastikan ALLOWED_ORIGINS sudah di-set
   echo $ALLOWED_ORIGINS
   # Harus: https://aransyah28.github.io
   ```

2. **Backend Code** (`backend/main.py`):
   ```python
   # Pastikan CORS middleware ada dan benar
   app.add_middleware(
       CORSMiddleware,
       allow_origins=ALLOWED_ORIGINS,  # Harus pakai env var
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Wildcard untuk Testing** (temporary):
   ```python
   # HANYA untuk testing, JANGAN di production!
   allow_origins=["*"]  # Allow semua origin
   ```

### 5. CORS Preflight Request

Untuk request POST/PUT/DELETE, browser kirim OPTIONS request dulu.

**Test preflight**:
```bash
curl -X OPTIONS https://your-backend-url.com/api/monthly-results \
  -H "Origin: https://aransyah28.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Response harus 200 OK** dengan headers CORS.

---

## 📊 Perbandingan Platform

### Performance
1. **Fly.io** - Paling cepat, always-on
2. **PythonAnywhere** - Sedang, always-on
3. **Koyeb** - Cepat, tapi auto-sleep
4. **Glitch** - Lambat, auto-sleep cepat

### Ease of Use
1. **Koyeb** - Paling mudah (UI-based)
2. **PythonAnywhere** - Mudah (web console)
3. **Fly.io** - Sedang (perlu CLI)
4. **Glitch** - Mudah (web IDE)

### Reliability
1. **Fly.io** - Paling reliable
2. **PythonAnywhere** - Reliable
3. **Koyeb** - Reliable
4. **Glitch** - Kurang reliable (sering restart)

### Recommendation untuk Project Ini

**Untuk Demo/Portfolio**:
- ✅ **Koyeb** - Balance antara mudah dan performa

**Untuk Development/Testing**:
- ✅ **PythonAnywhere** - Always-on, gratis permanen

**Untuk Production-like**:
- ✅ **Fly.io** - Performa terbaik, tidak auto-sleep

---

## 🛠️ After Deployment

### Update Frontend Configuration

Setelah deploy backend, update file `.github/workflows/deploy.yml`:

```yaml
env:
  VITE_API_URL: https://your-backend-url-here
```

Ganti sesuai platform:
- Koyeb: `https://service-big-data-backend-xxx.koyeb.app`
- Fly.io: `https://service-big-data-backend.fly.dev`
- PythonAnywhere: `https://yourusername.pythonanywhere.com`
- Glitch: `https://your-project-name.glitch.me`

### Trigger Frontend Rebuild

```bash
git add .
git commit -m "Update backend URL"
git push origin main
```

GitHub Actions akan otomatis rebuild frontend dengan backend URL yang baru.

---

## 🔧 Troubleshooting Umum

### Backend tidak bisa diakses
- Cek logs di dashboard platform
- Pastikan port sudah benar ($PORT atau 8000)
- Verify start command benar

### CORS error masih muncul
- Double-check environment variable `ALLOWED_ORIGINS`
- Pastikan tidak ada typo di URL frontend
- Test dengan wildcard `["*"]` untuk debugging

### Cold start lambat
- Normal untuk free tier dengan auto-sleep
- Upgrade ke paid tier untuk always-on
- Atau gunakan Fly.io/PythonAnywhere yang tidak auto-sleep

### Data files tidak ditemukan
- Pastikan path relatif di `backend/main.py` benar
- Check file `backend/data/dbd_ml_results.json` ada
- Verify file `data/Kasus_DBD_Gabungan.csv` ada di repo

---

## 💡 Tips

1. **Start dengan Koyeb** (paling mudah, tidak perlu CC)
2. **Test CORS** sebelum deploy frontend
3. **Monitor logs** saat deployment
4. **Gunakan environment variables** untuk config
5. **Backup data files** sebelum deploy

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:
1. Check logs di platform dashboard
2. Test backend URL langsung di browser
3. Verify CORS dengan developer tools
4. Pastikan data files ter-commit di GitHub

---

**Happy Deploying! 🚀**

Semua platform di atas **100% GRATIS** dan **TIDAK PERLU KARTU KREDIT**.
