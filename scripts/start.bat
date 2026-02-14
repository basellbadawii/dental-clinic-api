@echo off
echo.
echo ========================================
echo   بدء تشغيل نظام إدارة عيادة الأسنان
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ❌ ملف .env غير موجود!
    echo يرجى إنشاء ملف .env أولاً
    echo راجع SETUP_GUIDE.md
    pause
    exit /b 1
)

REM Start API server in a new window
echo 🚀 تشغيل API Server...
start "Dental Clinic API" cmd /k "cd server && node api.js"

REM Wait a bit
timeout /t 2 /nobreak >nul

REM Start frontend
echo 🚀 تشغيل Frontend...
start "Dental Clinic Frontend" cmd /k "npm run dev"

echo.
echo ✅ تم تشغيل النظام بنجاح!
echo.
echo API Server: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo لإيقاف النظام، أغلق نوافذ الأوامر
echo.
pause
