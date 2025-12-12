# 🎯 QUICK REFERENCE - Start Here!

**Masalah**: Render meminta kartu kredit, Railway berbayar, Vercel error, bagaimana deploy backend dan test CORS?

**Solusi**: Gunakan platform gratis alternatif dan ikuti panduan testing CORS.

---

## 🚀 Langkah Cepat (5-10 Menit)

### 1️⃣ Pilih Platform Deployment

**Rekomendasi untuk Pemula**: **Koyeb** (paling mudah, UI-based)

| Platform | Link | Kebutuhan CC | Auto-Sleep |
|----------|------|--------------|------------|
| **Koyeb** ⭐ | [koyeb.com](https://www.koyeb.com/) | ❌ Tidak | 30 menit |
| **PythonAnywhere** | [pythonanywhere.com](https://www.pythonanywhere.com/) | ❌ Tidak | ❌ Always-on |
| **Fly.io** | [fly.io](https://fly.io/) | ❌ Tidak | Auto-stop* |
| **Glitch** | [glitch.com](https://glitch.com/) | ❌ Tidak | 5 menit |

*Fly.io: Auto-stop saat idle, auto-start on request (~10-30s cold start)

### 2️⃣ Deploy Backend (Koyeb - Tercepat)

1. Sign up di [koyeb.com](https://www.koyeb.com/) dengan GitHub
2. **Create App** → Pilih **"GitHub"**
3. Connect repo: `Aransyah28/Service-Big-Data`
4. Settings:
   - Run command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment: `ALLOWED_ORIGINS=https://aransyah28.github.io`
5. **Deploy** → Tunggu 2-3 menit
6. Copy backend URL (format: `https://xxx.koyeb.app`)

### 3️⃣ Update Frontend Config

Edit `.github/workflows/deploy.yml` line 44:
```yaml
VITE_API_URL: https://your-backend-url.koyeb.app
```

Commit & push:
```bash
git add .github/workflows/deploy.yml
git commit -m "Update backend URL"
git push
```

### 4️⃣ Test CORS

Buka `https://aransyah28.github.io/Service-Big-Data/`

**F12** → Console → Reload

✅ **Berhasil**: Tidak ada error CORS, data muncul  
❌ **Error**: "blocked by CORS policy" → cek environment variable

**Test dengan script**:
```bash
./verify-deployment.sh https://your-backend-url.koyeb.app
```

---

## 📚 Dokumentasi Lengkap

### Untuk Deployment:

1. **[SOLUSI_DEPLOYMENT_CORS.md](SOLUSI_DEPLOYMENT_CORS.md)** ⭐ START HERE!
   - Ringkasan semua platform
   - Quick start untuk setiap platform
   - CORS testing dasar

2. **[ALTERNATIF_DEPLOYMENT_GRATIS.md](ALTERNATIF_DEPLOYMENT_GRATIS.md)**
   - Detail lengkap 4 platform gratis
   - Step-by-step untuk masing-masing platform
   - Troubleshooting per platform

### Untuk Testing CORS:

3. **[PANDUAN_CORS_TESTING.md](PANDUAN_CORS_TESTING.md)**
   - 5 metode testing CORS
   - Cara fix CORS errors
   - Common mistakes & solutions

### Dokumentasi Lain:

4. [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md) - Panduan Render/Railway/Vercel (butuh CC)
5. [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md) - Dokumentasi backend deployment
6. [RINGKASAN_SOLUSI.md](RINGKASAN_SOLUSI.md) - Ringkasan solusi

---

## 🔧 Files Penting

### Backend:
- `backend/main.py` - ✅ CORS sudah diperbaiki
- `backend/Dockerfile` - Docker support
- `backend/fly.toml` - Fly.io config
- `backend/requirements.txt` - Dependencies

### Frontend:
- `.github/workflows/deploy.yml` - Update `VITE_API_URL` di sini (line 44)

### Testing:
- `verify-deployment.sh` - Script untuk test deployment & CORS

---

## ❓ FAQ

### Q: Platform mana yang paling mudah?
**A**: Koyeb - UI-based, tidak perlu CLI, gratis tanpa CC

### Q: Platform mana yang always-on?
**A**: PythonAnywhere atau Fly.io - tidak auto-sleep

### Q: Bagaimana cara test CORS?
**A**: Buka frontend → F12 → Console → lihat errors. Detail: [PANDUAN_CORS_TESTING.md](PANDUAN_CORS_TESTING.md)

### Q: Backend URL format seperti apa?
**A**: 
- Koyeb: `https://service-big-data-backend-xxx.koyeb.app`
- Fly.io: `https://service-big-data-backend.fly.dev`
- PythonAnywhere: `https://yourusername.pythonanywhere.com`
- Glitch: `https://your-project.glitch.me`

### Q: Kenapa CORS error?
**A**: Check environment variable `ALLOWED_ORIGINS` di platform deployment. Harus: `https://aransyah28.github.io` (tanpa trailing slash)

### Q: File apa yang sudah diperbaiki?
**A**: `backend/main.py` - syntax error CORS middleware sudah fixed (line 34)

---

## ✅ Checklist

Deploy backend:
- [ ] Pilih platform (Koyeb recommended)
- [ ] Sign up & connect GitHub repo
- [ ] Set environment variable `ALLOWED_ORIGINS`
- [ ] Deploy & copy backend URL
- [ ] Update `.github/workflows/deploy.yml`
- [ ] Commit & push untuk rebuild frontend
- [ ] Test CORS di browser console
- [ ] Verify data muncul di dashboard

---

## 🆘 Troubleshooting Cepat

### Error: "CORS policy blocked"
→ Check `ALLOWED_ORIGINS` environment variable
→ Pastikan value: `https://aransyah28.github.io` (no trailing slash!)
→ Restart backend service

### Error: "Network Error" / "Failed to fetch"
→ Check backend URL di `.github/workflows/deploy.yml`
→ Test backend: `curl https://your-backend-url.com/`
→ Verify backend deployed & running

### Dashboard kosong / no data
→ Check browser console for errors
→ Verify backend returns data: `curl https://your-backend-url.com/api/monthly-results`
→ Check file `backend/data/dbd_ml_results.json` exists

### Cold start lambat
→ Normal untuk free tier (Koyeb/Glitch auto-sleep)
→ First request: 10-60 detik
→ Subsequent requests: normal/fast
→ Gunakan PythonAnywhere/Fly.io untuk always-on

---

## 🎯 Success Criteria

✅ Backend deployed & accessible  
✅ Tidak ada CORS error di console  
✅ Dashboard load data dengan benar  
✅ Charts & visualizations tampil  
✅ All API endpoints working  

---

## 💡 Pro Tips

1. **Test backend dulu** sebelum update frontend
2. **Gunakan verify-deployment.sh** untuk automated testing
3. **Monitor logs** di platform dashboard
4. **Document backend URL** untuk reference
5. **Backup environment variables**

---

## 📞 Need Help?

1. Baca dokumentasi lengkap sesuai masalah:
   - Deployment: [SOLUSI_DEPLOYMENT_CORS.md](SOLUSI_DEPLOYMENT_CORS.md)
   - CORS: [PANDUAN_CORS_TESTING.md](PANDUAN_CORS_TESTING.md)

2. Check logs di platform dashboard

3. Test dengan curl/browser devtools

4. Verify environment variables

---

**Ready to deploy? Start dengan [SOLUSI_DEPLOYMENT_CORS.md](SOLUSI_DEPLOYMENT_CORS.md)!** 🚀
