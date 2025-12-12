#!/bin/bash
# Script untuk verifikasi deployment backend
# Usage: ./verify-deployment.sh <BACKEND_URL>

if [ -z "$1" ]; then
    echo "Usage: $0 <BACKEND_URL>"
    echo "Example: $0 https://service-big-data-backend.koyeb.app"
    exit 1
fi

BACKEND_URL=$1
FRONTEND_URL="https://aransyah28.github.io"

echo "🧪 Verifying Backend Deployment"
echo "================================"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Test 1: Check if backend is accessible
echo "📡 Test 1: Backend Accessibility"
echo "--------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Backend is accessible (HTTP $HTTP_CODE)"
else
    echo "❌ Backend is not accessible (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 2: Check CORS headers
echo "🔒 Test 2: CORS Configuration"
echo "----------------------------"
CORS_HEADER=$(curl -s -I -H "Origin: $FRONTEND_URL" "$BACKEND_URL/" | grep -i "access-control-allow-origin")
if echo "$CORS_HEADER" | grep -q "$FRONTEND_URL"; then
    echo "✅ CORS properly configured"
    echo "   $CORS_HEADER"
else
    echo "❌ CORS not configured correctly"
    echo "   Expected: access-control-allow-origin: $FRONTEND_URL"
    echo "   Got: $CORS_HEADER"
fi
echo ""

# Test 3: Check API endpoints
echo "📊 Test 3: API Endpoints"
echo "----------------------"
ENDPOINTS=("/api/monthly-results" "/api/model-info" "/api/statistics")
for endpoint in "${ENDPOINTS[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL$endpoint")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ $endpoint (HTTP $HTTP_CODE)"
    else
        echo "❌ $endpoint (HTTP $HTTP_CODE)"
    fi
done
echo ""

# Test 4: CORS Preflight
echo "✈️  Test 4: CORS Preflight (OPTIONS)"
echo "----------------------------------"
PREFLIGHT=$(curl -s -I -X OPTIONS \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: GET" \
    "$BACKEND_URL/api/monthly-results" | grep -i "access-control")

if [ -n "$PREFLIGHT" ]; then
    echo "✅ Preflight request handled correctly"
    echo "$PREFLIGHT" | while read line; do echo "   $line"; done
else
    echo "❌ Preflight request not handled"
fi
echo ""

# Summary
echo "📋 Deployment Verification Summary"
echo "================================="
echo ""
echo "Next steps:"
echo "1. Update .github/workflows/deploy.yml with backend URL:"
echo "   VITE_API_URL: $BACKEND_URL"
echo ""
echo "2. Commit and push to rebuild frontend"
echo ""
echo "3. Test frontend at: $FRONTEND_URL/Service-Big-Data/"
echo ""
echo "4. Check browser console (F12) for CORS errors"
echo ""
