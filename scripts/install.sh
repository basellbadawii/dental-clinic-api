#!/bin/bash

echo "🦷 تثبيت نظام إدارة عيادة الأسنان"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً من https://nodejs.org"
    exit 1
fi

echo "✅ Node.js مثبت - الإصدار: $(node -v)"
echo ""

# Install frontend dependencies
echo "📦 تثبيت مكتبات Frontend..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ تم تثبيت مكتبات Frontend بنجاح"
else
    echo "❌ فشل تثبيت مكتبات Frontend"
    exit 1
fi

echo ""

# Install server dependencies
echo "📦 تثبيت مكتبات API Server..."
cd server
npm install
cd ..

if [ $? -eq 0 ]; then
    echo "✅ تم تثبيت مكتبات API Server بنجاح"
else
    echo "❌ فشل تثبيت مكتبات API Server"
    exit 1
fi

echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  ملف .env غير موجود"
    echo "📝 إنشاء ملف .env من .env.example..."
    cp .env.example .env
    echo "✅ تم إنشاء ملف .env - يرجى تعديله بالبيانات الصحيحة"
fi

echo ""
echo "✨ تم التثبيت بنجاح!"
echo ""
echo "الخطوات التالية:"
echo "1. قم بتعديل ملف .env بإضافة بيانات Supabase"
echo "2. شغّل التطبيق بالأمر: npm run dev"
echo "3. افتح المتصفح على http://localhost:3000"
echo ""
echo "للمزيد من المعلومات، راجع ملف SETUP_GUIDE.md"
