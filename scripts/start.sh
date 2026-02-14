#!/bin/bash

echo "🦷 بدء تشغيل نظام إدارة عيادة الأسنان"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ ملف .env غير موجود!"
    echo "يرجى إنشاء ملف .env أولاً (راجع SETUP_GUIDE.md)"
    exit 1
fi

# Start API server in background
echo "🚀 تشغيل API Server..."
cd server
node api.js &
API_PID=$!
cd ..

echo "✅ API Server يعمل على http://localhost:3001"
echo ""

# Wait a bit for API server to start
sleep 2

# Start frontend
echo "🚀 تشغيل Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Frontend يعمل على http://localhost:3000"
echo ""
echo "للإيقاف، اضغط Ctrl+C"
echo ""

# Wait for both processes
wait $API_PID $FRONTEND_PID
