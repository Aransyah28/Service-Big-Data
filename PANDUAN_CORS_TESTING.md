# 🔍 Panduan Lengkap Testing CORS

Panduan untuk memastikan CORS (Cross-Origin Resource Sharing) dikonfigurasi dengan benar dan tidak ada error.

## 📌 Apa itu CORS?

**CORS** adalah security feature di browser yang mencegah website dari origin berbeda mengakses API Anda.

**Contoh**:
- Frontend: `https://aransyah28.github.io` (origin A)
- Backend: `https://your-backend.com` (origin B)
- Tanpa CORS → Browser BLOCK request ❌
- Dengan CORS → Browser ALLOW request ✅

---

## ✅ Cara Mengecek CORS Tidak Error

### Method 1: Browser Developer Tools (Paling Mudah)

#### Langkah:

1. **Buka Frontend di Browser**
   ```
   https://aransyah28.github.io/Service-Big-Data/
   ```

2. **Buka Developer Tools**
   - Windows/Linux: `F12` atau `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

3. **Buka Tab "Console"**

4. **Reload Page** (`Ctrl + R` atau `Cmd + R`)

5. **Lihat Pesan Error**

#### ✅ TIDAK ADA ERROR CORS (Berhasil):

Console menampilkan:
```
GET https://your-backend-url.com/api/monthly-results 200 OK
```
Atau tidak ada pesan error CORS sama sekali.

#### ❌ ADA ERROR CORS (Gagal):

Console menampilkan pesan seperti:
```
Access to fetch at 'https://your-backend-url.com/api/monthly-results' 
from origin 'https://aransyah28.github.io' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Screenshot Error CORS**:
```
🔴 index.js:23 
   CORS Error: No 'Access-Control-Allow-Origin' header
```

---

### Method 2: Network Tab Inspection

#### Langkah:

1. **Developer Tools** → Tab **"Network"**

2. **Reload Page**

3. **Cari Request ke Backend** (biasanya dimulai dengan `/api/...`)

4. **Klik Request** → lihat **"Headers"** section

#### ✅ Headers yang Benar (CORS OK):

**Response Headers harus include**:
```
Access-Control-Allow-Origin: https://aransyah28.github.io
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**Status Code**: `200 OK`

#### ❌ CORS Error:

- **Missing Headers**: Tidak ada `Access-Control-Allow-Origin`
- **Status Code**: `Failed` atau `CORS error`
- **Response**: Kosong

---

### Method 3: Test dengan CURL (Command Line)

#### Simple GET Request:

```bash
curl -H "Origin: https://aransyah28.github.io" \
     https://your-backend-url.com/api/monthly-results \
     -v
```

#### ✅ Response yang Benar:

```
< HTTP/2 200 
< access-control-allow-origin: https://aransyah28.github.io
< access-control-allow-credentials: true
< content-type: application/json
```

#### Preflight Request (OPTIONS):

```bash
curl -X OPTIONS \
     https://your-backend-url.com/api/monthly-results \
     -H "Origin: https://aransyah28.github.io" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -v
```

#### ✅ Preflight yang Benar:

```
< HTTP/2 200
< access-control-allow-origin: https://aransyah28.github.io
< access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
< access-control-allow-headers: Content-Type
```

---

### Method 4: Online CORS Tester

#### Gunakan Test-CORS.org:

1. Buka: [https://www.test-cors.org/](https://www.test-cors.org/)

2. **Remote URL**: 
   ```
   https://your-backend-url.com/api/monthly-results
   ```

3. **Origin**:
   ```
   https://aransyah28.github.io
   ```

4. **Method**: `GET`

5. Klik **"Send Request"**

#### ✅ Result yang Benar:

```
✓ CORS is properly configured
✓ Access-Control-Allow-Origin header is present
```

#### ❌ CORS Error:

```
✗ CORS is not configured
✗ Missing Access-Control-Allow-Origin header
```

---

### Method 5: JavaScript Console Test

#### Langkah:

1. Buka frontend: `https://aransyah28.github.io/Service-Big-Data/`

2. Buka **Console** (F12)

3. Paste & Run script ini:

```javascript
// Test CORS dengan fetch
fetch('https://your-backend-url.com/api/monthly-results')
  .then(response => response.json())
  .then(data => {
    console.log('✅ CORS OK! Data received:', data);
  })
  .catch(error => {
    console.error('❌ CORS ERROR:', error.message);
  });
```

#### ✅ CORS OK:

```
✅ CORS OK! Data received: [{...}, {...}]
```

#### ❌ CORS Error:

```
❌ CORS ERROR: Failed to fetch
(or CORS policy error message)
```

---

## 🔧 Fixing CORS Errors

### Problem 1: Missing Access-Control-Allow-Origin

**Error Message**:
```
No 'Access-Control-Allow-Origin' header is present
```

**Solusi**:

1. **Check Backend Code** (`backend/main.py`):
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://aransyah28.github.io"],  # ← Pastikan ada!
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Restart Backend**

3. **Test lagi**

---

### Problem 2: Wrong Origin

**Error Message**:
```
The 'Access-Control-Allow-Origin' header has a value 'https://wrong-url.com' 
that is not equal to the supplied origin
```

**Solusi**:

1. **Check Environment Variable** di platform deployment:
   ```
   ALLOWED_ORIGINS=https://aransyah28.github.io
   ```

2. **Pastikan tidak ada typo** (http vs https, trailing slash, dll)

3. **Restart service**

---

### Problem 3: Preflight Request Failed

**Error Message**:
```
Response to preflight request doesn't pass access control check
```

**Solusi**:

1. **Pastikan OPTIONS method allowed**:
   ```python
   allow_methods=["*"]  # Include OPTIONS, GET, POST, etc.
   ```

2. **Check headers allowed**:
   ```python
   allow_headers=["*"]  # Or specific headers
   ```

---

### Problem 4: Credentials Error

**Error Message**:
```
The value of the 'Access-Control-Allow-Credentials' header in the response is '' 
which must be 'true' when the request's credentials mode is 'include'
```

**Solusi**:

1. **Set credentials to true**:
   ```python
   allow_credentials=True
   ```

2. **Frontend juga harus set**:
   ```javascript
   fetch(url, {
     credentials: 'include'  // Jika pakai cookies
   })
   ```

---

### Problem 5: Wildcard with Credentials

**Error Message**:
```
The value of the 'Access-Control-Allow-Origin' header in the response must not be 
the wildcard '*' when the request's credentials mode is 'include'
```

**Solusi**:

**JANGAN gunakan wildcard dengan credentials**:
```python
# ❌ SALAH
allow_origins=["*"]
allow_credentials=True

# ✅ BENAR
allow_origins=["https://aransyah28.github.io"]
allow_credentials=True
```

---

## 🧪 Testing Checklist

Sebelum deploy production, pastikan semua ini sudah dicek:

### Backend Configuration:

- [ ] CORS middleware installed & configured
- [ ] `allow_origins` include frontend URL
- [ ] `allow_methods` include semua method yang dipakai
- [ ] `allow_headers` include semua header yang dipakai
- [ ] `allow_credentials` = True (jika pakai cookies/auth)

### Environment Variables:

- [ ] `ALLOWED_ORIGINS` di-set dengan benar
- [ ] Tidak ada trailing slash di URL
- [ ] HTTPS vs HTTP sudah benar
- [ ] Multiple origins pakai comma-separated (jika perlu)

### Testing:

- [ ] Test dengan browser DevTools Console
- [ ] Test dengan Network tab
- [ ] Test dengan curl
- [ ] Test preflight request (OPTIONS)
- [ ] Test dari frontend production URL

---

## 📋 Quick Testing Script

Simpan script ini sebagai `test-cors.sh`:

```bash
#!/bin/bash

BACKEND_URL="https://your-backend-url.com"
FRONTEND_URL="https://aransyah28.github.io"

echo "🧪 Testing CORS for $BACKEND_URL"
echo "Origin: $FRONTEND_URL"
echo ""

# Test 1: Simple GET
echo "Test 1: Simple GET request"
curl -H "Origin: $FRONTEND_URL" \
     "$BACKEND_URL/api/monthly-results" \
     -s -I | grep -i "access-control"

echo ""

# Test 2: Preflight OPTIONS
echo "Test 2: Preflight OPTIONS request"
curl -X OPTIONS \
     "$BACKEND_URL/api/monthly-results" \
     -H "Origin: $FRONTEND_URL" \
     -H "Access-Control-Request-Method: GET" \
     -s -I | grep -i "access-control"

echo ""

# Test 3: Root endpoint
echo "Test 3: Root endpoint"
curl -H "Origin: $FRONTEND_URL" \
     "$BACKEND_URL/" \
     -s -I | grep -i "access-control"

echo ""
echo "✅ Done! Check output above for Access-Control-* headers"
```

**Jalankan**:
```bash
chmod +x test-cors.sh
./test-cors.sh
```

---

## 🎯 Expected Output

### Correct CORS Configuration:

```bash
$ curl -H "Origin: https://aransyah28.github.io" https://your-backend.com/api/monthly-results -v

> GET /api/monthly-results HTTP/2
> Host: your-backend.com
> Origin: https://aransyah28.github.io

< HTTP/2 200
< access-control-allow-origin: https://aransyah28.github.io
< access-control-allow-credentials: true
< access-control-allow-methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
< access-control-allow-headers: *
< content-type: application/json

[{"month": "January", "total_cases": 5000, ...}]
```

**Key Points**:
- ✅ Status: `200 OK`
- ✅ Header: `access-control-allow-origin` match dengan origin
- ✅ Header: `access-control-allow-credentials: true`
- ✅ Response body: JSON data

---

## 🚨 Common Mistakes

### 1. Trailing Slash
```python
# ❌ SALAH
allow_origins=["https://aransyah28.github.io/"]  # Trailing slash!

# ✅ BENAR
allow_origins=["https://aransyah28.github.io"]
```

### 2. HTTP vs HTTPS
```python
# ❌ SALAH (jika frontend pakai HTTPS)
allow_origins=["http://aransyah28.github.io"]

# ✅ BENAR
allow_origins=["https://aransyah28.github.io"]
```

### 3. Localhost Testing
```python
# ✅ BENAR untuk development
allow_origins=[
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative port
    "https://aransyah28.github.io"  # Production
]
```

### 4. Environment Variable Not Set
```bash
# Check di terminal backend
echo $ALLOWED_ORIGINS

# Jika kosong, set dulu:
export ALLOWED_ORIGINS="https://aransyah28.github.io"
```

### 5. Platform-Specific Issues

**Render**:
```yaml
# render.yaml
envVars:
  - key: ALLOWED_ORIGINS
    value: https://aransyah28.github.io  # Pastikan tanpa quotes!
```

**Fly.io**:
```bash
fly secrets set ALLOWED_ORIGINS="https://aransyah28.github.io"
```

**PythonAnywhere**:
```python
# Di WSGI file
os.environ['ALLOWED_ORIGINS'] = 'https://aransyah28.github.io'
```

---

## 📚 Resources

**CORS Documentation**:
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)

**Testing Tools**:
- [Test-CORS.org](https://www.test-cors.org/)
- [CORS Tester Chrome Extension](https://chrome.google.com/webstore/detail/cors-tester)

**Debugging**:
- [Chrome DevTools Network](https://developer.chrome.com/docs/devtools/network/)
- [Firefox Network Monitor](https://developer.mozilla.org/en-US/docs/Tools/Network_Monitor)

---

## 💡 Pro Tips

1. **Always test CORS sebelum deploy frontend**
2. **Gunakan specific origins** (jangan wildcard di production)
3. **Monitor browser console** saat development
4. **Test dari actual frontend URL** (bukan localhost)
5. **Document CORS config** di README

---

## 🎓 Summary

**Quick Checklist untuk CORS OK**:
- ✅ Backend CORS middleware configured
- ✅ Frontend origin di-allow di backend
- ✅ Environment variables set dengan benar
- ✅ Test dengan browser DevTools (no errors)
- ✅ Test dengan curl (correct headers)
- ✅ Test OPTIONS preflight (200 OK)

**Jika semua checklist ✅**, CORS sudah OK dan frontend bisa connect ke backend tanpa error!

---

**Happy Testing! 🚀**
