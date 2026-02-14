# 🚀 دليل النشر - Dental Clinic Management System

## 📋 قائمة التحقق قبل النشر

- [ ] تحديث المتغيرات في `.env`
- [ ] اختبار جميع الميزات
- [ ] بناء المشروع (`npm run build`)
- [ ] تحسين الصور والملفات
- [ ] تأمين API keys
- [ ] إعداد نسخ احتياطي لقاعدة البيانات

---

## 🌐 النشر على Vercel (موصى به)

### الخطوات:

1. **تثبيت Vercel CLI**
```bash
npm install -g vercel
```

2. **تسجيل الدخول**
```bash
vercel login
```

3. **النشر**
```bash
vercel
```

4. **إعداد المتغيرات البيئية**
في لوحة تحكم Vercel:
- Settings → Environment Variables
- أضف جميع المتغيرات من `.env`

5. **الربط بـ Git (اختياري)**
```bash
vercel --prod
```

### ملف `vercel.json` (تلقائي)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## 📦 النشر على Netlify

### الخطوات:

1. **تثبيت Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **تسجيل الدخول**
```bash
netlify login
```

3. **النشر**
```bash
netlify deploy --prod
```

4. **إعداد Build Settings**
- Build command: `npm run build`
- Publish directory: `dist`

### ملف `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🐳 النشر باستخدام Docker

### 1. إنشاء `Dockerfile`

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. إنشاء `nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 3. البناء والتشغيل

```bash
# بناء الصورة
docker build -t dental-clinic-app .

# تشغيل Container
docker run -d -p 80:80 dental-clinic-app
```

### 4. Docker Compose (مع API Server)

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

  api:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

  evolution-api:
    image: atendai/evolution-api:latest
    ports:
      - "8080:8080"
    environment:
      - AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
```

---

## ☁️ النشر على VPS (Ubuntu)

### 1. الاتصال بالخادم
```bash
ssh user@your-server-ip
```

### 2. تثبيت المتطلبات
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت Nginx
sudo apt install -y nginx

# تثبيت PM2
sudo npm install -g pm2
```

### 3. رفع الملفات
```bash
# على جهازك المحلي
scp -r dental-clinic-app user@server-ip:/var/www/
```

### 4. بناء المشروع
```bash
cd /var/www/dental-clinic-app
npm install
npm run build
```

### 5. إعداد Nginx
```bash
sudo nano /etc/nginx/sites-available/dental-clinic
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/dental-clinic-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/dental-clinic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. تشغيل API Server بـ PM2
```bash
cd /var/www/dental-clinic-app/server
pm2 start api.js --name dental-api
pm2 save
pm2 startup
```

### 7. SSL (HTTPS) مع Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔒 الأمان في الإنتاج

### 1. تأمين المتغيرات البيئية
- لا ترفع ملف `.env` إلى Git
- استخدم خدمات إدارة الأسرار (Secrets Management)
- قم بتدوير API Keys بشكل دوري

### 2. تأمين Supabase
```sql
-- تفعيل Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة (مثال)
CREATE POLICY "Users can view their data" ON patients
  FOR SELECT USING (auth.uid() = id);
```

### 3. تشفير كلمات المرور
في الإنتاج، استخدم bcrypt:
```javascript
import bcrypt from 'bcrypt'

// عند التسجيل
const hashedPassword = await bcrypt.hash(password, 10)

// عند الدخول
const isValid = await bcrypt.compare(password, hashedPassword)
```

### 4. CORS
في `server/api.js`:
```javascript
app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true
}))
```

---

## 📊 المراقبة والأداء

### 1. إعداد Monitoring
```bash
# تثبيت monitoring tools
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 2. مراقبة الأداء
- استخدم Google Analytics
- راقب استهلاك الموارد
- تحقق من أوقات التحميل

### 3. النسخ الاحتياطي
```bash
# نسخ احتياطي لقاعدة البيانات (من Supabase Dashboard)
# أو تلقائياً:
0 2 * * * pg_dump -U postgres > backup-$(date +\%Y\%m\%d).sql
```

---

## 🔄 التحديثات المستمرة

### GitHub Actions (CI/CD)

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📱 التطبيقات المتقدمة

### نشر API Server منفصل
```bash
# على خادم منفصل أو Heroku
cd server
heroku create dental-clinic-api
heroku config:set SUPABASE_URL=...
git push heroku main
```

### CDN للملفات الثابتة
- رفع الصور والملفات إلى Cloudinary أو AWS S3
- استخدام CloudFlare لتسريع التحميل

---

## ✅ اختبار ما بعد النشر

- [ ] التطبيق يعمل بدون أخطاء
- [ ] جميع الصفحات قابلة للوصول
- [ ] SSL يعمل (HTTPS)
- [ ] الواتساب يرسل الرسائل
- [ ] قاعدة البيانات متصلة
- [ ] النسخ الاحتياطي يعمل
- [ ] المراقبة مفعّلة

---

## 📞 الدعم بعد النشر

للمساعدة في النشر:
- 📧 Email: support@dentalclinic.com
- 📖 Documentation: راجع SETUP_GUIDE.md
- 🐛 Issues: GitHub Issues

---

**نشر موفق! 🎉**
