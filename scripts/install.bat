@echo off
echo.
echo ========================================
echo   تثبيت نظام إدارة عيادة الأسنان
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً
    echo من https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js مثبت
node -v
echo.

REM Install frontend dependencies
echo 📦 تثبيت مكتبات Frontend...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo ✅ تم تثبيت مكتبات Frontend بنجاح
) else (
    echo ❌ فشل تثبيت مكتبات Frontend
    pause
    exit /b 1
)

echo.

REM Install server dependencies
echo 📦 تثبيت مكتبات API Server...
cd server
call npm install
cd ..

if %ERRORLEVEL% EQU 0 (
    echo ✅ تم تثبيت مكتبات API Server بنجاح
) else (
    echo ❌ فشل تثبيت مكتبات API Server
    pause
    exit /b 1
)

echo.

REM Check if .env exists
if not exist .env (
    echo ⚠️  ملف .env غير موجود
    echo 📝 إنشاء ملف .env من .env.example...
    copy .env.example .env
    echo ✅ تم إنشاء ملف .env
    echo يرجى تعديله بالبيانات الصحيحة
)

echo.
echo ✨ تم التثبيت بنجاح!
echo.
echo الخطوات التالية:
echo 1. قم بتعديل ملف .env بإضافة بيانات Supabase
echo 2. شغّل التطبيق بالأمر: npm run dev
echo 3. افتح المتصفح على http://localhost:3000
echo.
echo للمزيد من المعلومات، راجع ملف SETUP_GUIDE.md
echo.
pause
