# Backend Deployment Instructions

## Problem

GitHub Pages can only host static files (HTML, CSS, JavaScript). It **cannot** run backend servers like FastAPI. Therefore, the backend needs to be deployed separately to a cloud service that supports Python applications.

## Solution

Deploy the backend to **Render** (free tier available) or another cloud service.

## Option 1: Deploy to Render (Recommended - Free Tier)

### Step 1: Create a Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with your GitHub account

### Step 2: Deploy Backend

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Aransyah28/Service-Big-Data`
3. Configure the service:
   - **Name**: `service-big-data-backend`
   - **Region**: Singapore (or closest to your users)
   - **Branch**: `main`
   - **Root Directory**: Leave empty (we'll use relative paths)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. Add Environment Variables:
   - Click **"Advanced"**
   - Add environment variable:
     - Key: `ALLOWED_ORIGINS`
     - Value: `https://aransyah28.github.io`

5. Click **"Create Web Service"**

### Step 3: Wait for Deployment

Render will automatically:
- Install dependencies
- Start the FastAPI server
- Provide you with a URL like: `https://service-big-data-backend.onrender.com`

### Step 4: Update Frontend Configuration

1. Go to your GitHub repository
2. Edit the file `.github/workflows/deploy.yml`
3. Add the VITE_API_URL environment variable to the build step (see updated workflow below)
4. The frontend will automatically use the production backend URL when deployed

### Step 5: Verify Deployment

1. Test the backend API:
   ```bash
   curl https://service-big-data-backend.onrender.com/
   ```

2. You should see the API info response

3. Visit your frontend: `https://aransyah28.github.io/Service-Big-Data/`

4. The frontend should now connect to the backend successfully

## Alternative: Using render.yaml (Automatic Deployment)

A `render.yaml` file has been added to the repository. You can use this for automatic deployment:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository: `Aransyah28/Service-Big-Data`
4. Render will automatically detect the `render.yaml` file
5. Click **"Apply"** to deploy

## Option 2: Deploy to Railway

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select `Aransyah28/Service-Big-Data`
5. Railway will auto-detect Python
6. Add environment variables:
   - `ALLOWED_ORIGINS=https://aransyah28.github.io`
7. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

## Option 3: Deploy to Vercel (Serverless)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import repository: `Aransyah28/Service-Big-Data`
4. Configure:
   - Framework Preset: Other
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Output Directory: (leave empty)
5. Add `vercel.json` configuration (already provided in backend folder)

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Suitable for demo/portfolio projects

**Railway Free Tier:**
- $5 free credit per month
- Services run 24/7 until credits run out
- More predictable performance

**Vercel:**
- Serverless functions (may require code adjustments)
- 10 second execution limit per request

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (development)
- `http://localhost:3000` (development)
- The production origin set via `ALLOWED_ORIGINS` environment variable

Make sure to set the correct frontend URL in the `ALLOWED_ORIGINS` environment variable.

## Updating the Backend URL

After deploying the backend, update the frontend configuration:

1. The production API URL is set in `frontend/.env.production`
2. Edit this file and replace with your actual backend URL:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

3. The GitHub Actions workflow will automatically use this URL when building for production

## Testing Locally

To test the production configuration locally:

```bash
cd frontend
npm run build
npm run preview
```

This will build and preview the production version that connects to the deployed backend.

## Troubleshooting

### Backend not responding
- Check Render/Railway logs for errors
- Verify the start command is correct
- Ensure all files (data/CSV) are in the repository

### CORS errors
- Verify `ALLOWED_ORIGINS` environment variable is set correctly
- Check that it matches your frontend URL exactly (including https://)

### Frontend shows "Network Error"
- Verify backend URL in `.env.production` is correct
- Check browser console for exact error
- Test backend URL directly in browser

### Data files not found
- Ensure `data/Kasus_DBD_Gabungan.csv` and `backend/data/dbd_ml_results.json` are committed to repository
- Check that paths in `backend/main.py` are correct (relative paths)

## Monitoring

### Render
- Dashboard: https://dashboard.render.com
- View logs in real-time
- Monitor service health

### Railway  
- Dashboard: https://railway.app/dashboard
- View logs and metrics
- Monitor resource usage

## Cost Considerations

All recommended options offer free tiers suitable for this project:

- **Render**: Free forever for web services (with limitations)
- **Railway**: $5/month free credit (renews monthly)
- **Vercel**: Free for personal projects

For a production application with consistent traffic, consider upgrading to paid tiers for better performance and reliability.
