# 🏗️ Arsitektur Deployment

Panduan visual untuk memahami bagaimana frontend dan backend di-deploy secara terpisah.

---

## 📐 Arsitektur Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                    (Pengguna Akses Web)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Request Frontend
                     │ (HTML, CSS, JavaScript)
                     ▼
        ┌────────────────────────────┐
        │     GITHUB PAGES           │
        │  (Frontend Hosting)        │
        │                            │
        │  https://aransyah28        │
        │    .github.io/             │
        │    Service-Big-Data/       │
        │                            │
        │  • React App               │
        │  • Static Files            │
        │  • Charts & Visualizations │
        └────────────────────────────┘
                     │
                     │ API Request
                     │ (Fetch Data)
                     ▼
        ┌────────────────────────────┐
        │   BACKEND PLATFORM         │
        │  (Pilih salah satu)        │
        │                            │
        │  Option 1: KOYEB ⭐        │
        │  https://xxx.koyeb.app     │
        │                            │
        │  Option 2: PythonAnywhere  │
        │  https://user.             │
        │    pythonanywhere.com      │
        │                            │
        │  Option 3: Fly.io          │
        │  https://xxx.fly.dev       │
        │                            │
        │  Option 4: Glitch          │
        │  https://xxx.glitch.me     │
        │                            │
        │  • FastAPI Server          │
        │  • Python Backend          │
        │  • ML Model                │
        │  • Data Processing         │
        └────────────────────────────┘
                     │
                     │ Load Data
                     ▼
        ┌────────────────────────────┐
        │      DATA FILES            │
        │  (In Backend Repo)         │
        │                            │
        │  • dbd_ml_results.json     │
        │  • Kasus_DBD_Gabungan.csv  │
        │  • DBD_analysis_final.ipynb│
        └────────────────────────────┘
```

---

## 🔄 Request Flow

### 1. User Opens Website

```
User Browser → GitHub Pages
```

**What happens**:
- User masuk ke `https://aransyah28.github.io/Service-Big-Data/`
- GitHub Pages serve React app (HTML, CSS, JavaScript)
- Browser load frontend application

### 2. Frontend Requests Data

```
React App → Backend API
```

**What happens**:
- Frontend app call API endpoint
- Request dikirim ke backend URL (e.g., `https://xxx.koyeb.app/api/monthly-results`)
- **CORS check**: Browser verify `Access-Control-Allow-Origin` header

### 3. Backend Processes Request

```
Backend API → Data Files → Response
```

**What happens**:
- Backend receive request
- Load data dari JSON/CSV files
- Process data (jika perlu)
- Return JSON response

### 4. Frontend Displays Data

```
Response → React Components → Charts & Visualizations
```

**What happens**:
- Frontend receive JSON data
- React components render data
- Charts library (Recharts) display visualizations
- User sees dashboard dengan data real-time

---

## 🔐 CORS Configuration

### Why CORS?

Browser security prevents frontend dari origin A mengakses API di origin B.

```
Frontend Origin:  https://aransyah28.github.io
Backend Origin:   https://backend-url.com

Different origins → Browser BLOCKS by default
```

### How We Fix It

Backend configuration (`backend/main.py`):

```python
from fastapi.middleware.cors import CORSMiddleware

# Allow frontend origin
ALLOWED_ORIGINS = ["https://aransyah28.github.io"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # ← This fixes CORS!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### CORS Headers Flow

```
1. Browser sends OPTIONS preflight:
   Origin: https://aransyah28.github.io
   Access-Control-Request-Method: GET

2. Backend responds:
   Access-Control-Allow-Origin: https://aransyah28.github.io
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: *

3. Browser allows actual request:
   GET /api/monthly-results

4. Backend responds with data + CORS headers
```

---

## 🚀 Deployment Process

### Frontend Deployment (GitHub Pages)

```
Developer → Git Push → GitHub Actions → Build → GitHub Pages
```

**Automatic**:
1. Developer commit & push ke branch `main`
2. GitHub Actions workflow triggered
3. Frontend di-build dengan Vite
4. Static files deployed ke GitHub Pages
5. Available di `https://aransyah28.github.io/Service-Big-Data/`

**Configuration** (`.github/workflows/deploy.yml`):
```yaml
- name: Build
  run: |
    cd frontend
    npm run build
  env:
    VITE_API_URL: https://backend-url.com  # Backend URL
```

### Backend Deployment (Cloud Platform)

```
Developer → Git Push → Platform Detects → Build → Deploy
```

**Manual (First Time)**:
1. Developer sign up di platform (Koyeb/PythonAnywhere/Fly.io/Glitch)
2. Connect GitHub repository
3. Configure deployment settings
4. Platform build & deploy backend
5. Get backend URL

**Automatic (Updates)**:
- Every git push → Platform auto-redeploy
- No manual intervention needed

---

## 🔄 Complete Deployment Flow

```
┌──────────────┐
│  Developer   │
│   (You)      │
└──────┬───────┘
       │
       │ 1. Code Changes
       │
       ▼
┌──────────────┐
│   Git Push   │
│  (main)      │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│GitHub Actions│  │Backend       │
│(Frontend)    │  │Platform      │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │ Build           │ Build
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│GitHub Pages  │  │Backend URL   │
│(Frontend)    │  │(API Server)  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │ Frontend calls  │
       └────────┬────────┘
                │
                ▼
       ┌──────────────┐
       │  User sees   │
       │  Full App    │
       └──────────────┘
```

---

## 📊 Platform Comparison

### Koyeb (Recommended)

```
GitHub Repo → Koyeb → https://xxx.koyeb.app

✅ Pros:
- UI-based (no CLI needed)
- Auto-deploy from GitHub
- Free forever
- Good dashboard

⚠️ Cons:
- Auto-sleep after 30 min idle
- Cold start ~10-20s
```

### PythonAnywhere

```
GitHub Repo → Clone to PythonAnywhere → Manual setup

✅ Pros:
- Always-on (no auto-sleep)
- Free forever
- Web console
- Perfect for Python

⚠️ Cons:
- Manual setup required
- Slower performance
- Basic features only
```

### Fly.io

```
GitHub Repo → fly deploy → https://xxx.fly.dev

✅ Pros:
- Best performance
- Multiple regions
- CLI-based, powerful

⚠️ Cons:
- CLI required
- Auto-stop when idle
- Slightly complex setup
```

### Glitch

```
GitHub Repo → Import to Glitch → https://xxx.glitch.me

✅ Pros:
- Web IDE (code in browser)
- Live preview
- Easy sharing

⚠️ Cons:
- Auto-sleep after 5 min
- Slowest performance
- Limited resources
```

---

## 🎯 Recommended Setup

### For Beginners:

```
Frontend: GitHub Pages (automatic)
Backend:  Koyeb (UI-based, easy)
```

**Why**: Easiest setup, minimal technical knowledge needed

### For Always-On Needs:

```
Frontend: GitHub Pages (automatic)
Backend:  PythonAnywhere (no auto-sleep)
```

**Why**: Backend stays running 24/7, no cold starts

### For Best Performance:

```
Frontend: GitHub Pages (automatic)
Backend:  Fly.io (fastest)
```

**Why**: Best response times, multiple regions

---

## 🔧 Environment Variables

### Backend Needs:

```bash
# Required
ALLOWED_ORIGINS=https://aransyah28.github.io

# Optional (platform sets automatically)
PORT=8000  # or 8080 for Fly.io
```

### Frontend Needs:

```bash
# Set in .github/workflows/deploy.yml
VITE_API_URL=https://your-backend-url.com
```

**Important**: Frontend URL dikonfigurasi di build time, bukan runtime!

---

## 📋 Deployment Checklist

### Backend Deployment:

- [ ] Choose platform (Koyeb/PythonAnywhere/Fly.io/Glitch)
- [ ] Sign up & verify account
- [ ] Connect GitHub repository
- [ ] Set environment variable: `ALLOWED_ORIGINS`
- [ ] Configure start command
- [ ] Deploy & wait for completion
- [ ] Copy backend URL
- [ ] Test backend: `curl https://backend-url/`

### Frontend Configuration:

- [ ] Edit `.github/workflows/deploy.yml`
- [ ] Update `VITE_API_URL` with backend URL
- [ ] Commit & push changes
- [ ] Wait for GitHub Actions to complete
- [ ] Frontend auto-rebuilds with new backend URL

### Testing:

- [ ] Open frontend: `https://aransyah28.github.io/Service-Big-Data/`
- [ ] Press F12 → Console
- [ ] Reload page
- [ ] Check no CORS errors
- [ ] Verify data loads correctly
- [ ] Test all visualizations

### Verification Script:

```bash
chmod +x verify-deployment.sh
./verify-deployment.sh https://your-backend-url.com
```

---

## 🆘 Common Issues

### Issue 1: CORS Error

```
Error: Access to fetch has been blocked by CORS policy
```

**Diagnosis**:
```bash
curl -H "Origin: https://aransyah28.github.io" \
     https://backend-url/ -v
```

**Fix**:
- Check `ALLOWED_ORIGINS` environment variable
- Ensure value: `https://aransyah28.github.io` (no trailing slash)
- Restart backend service

### Issue 2: Backend Not Responding

```
Error: Network Error / Failed to fetch
```

**Diagnosis**:
```bash
curl https://backend-url/
```

**Fix**:
- Verify backend is deployed & running
- Check platform dashboard for errors
- Verify start command is correct
- Check logs for errors

### Issue 3: Data Not Loading

```
Dashboard shows empty or error
```

**Diagnosis**:
- Browser console shows errors?
- Backend returns data? `curl https://backend-url/api/monthly-results`

**Fix**:
- Verify data files are in repository
- Check file paths in `backend/main.py`
- Ensure CSV/JSON files exist

---

## 💡 Best Practices

1. **Always test backend first** before updating frontend
2. **Monitor logs** during deployment
3. **Use environment variables** for configuration
4. **Document your backend URL** in README
5. **Keep CORS configuration strict** (specific origins only)
6. **Test CORS thoroughly** before going live

---

## 📞 Support

**Documentation**:
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick start
- [SOLUSI_DEPLOYMENT_CORS.md](SOLUSI_DEPLOYMENT_CORS.md) - Complete guide
- [PANDUAN_CORS_TESTING.md](PANDUAN_CORS_TESTING.md) - CORS testing

**Tools**:
- `verify-deployment.sh` - Automated testing
- Browser DevTools - Manual testing
- Platform dashboards - Monitoring

---

**Happy Deploying! 🚀**
