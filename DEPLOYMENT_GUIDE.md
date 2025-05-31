# راهنمای نصب اپلیکیشن فلش‌کارت Edukado

## نسخه: v1.5.0
**تاریخ ساخت:** ۱۰ خرداد ۱۴۰۴

---

## ویژگی‌های نسخه جدید

### ✅ **تغییرات اصلی v1.5.0:**
- **نمایش پیام API**: استفاده از `message` دریافتی از `ValidateResponseAnonymous`
- **Prefetch کارت بعدی**: آماده‌سازی کارت بعدی بلافاصله بعد از validation
- **حذف متن‌های ثابت**: عدم استفاده از "گزاره صحیح/غلط" 
- **بهبود سرعت**: تجربه کاربری سریع‌تر با prefetching
- **تمیزسازی کد**: کد ساده‌تر و بهینه‌تر

---

## فایل‌های آماده برای نصب

### 📦 **فایل‌های ZIP موجود:**
- `react-edu-production.zip` - نسخه اصلی production
- `edukado-flashcard-v1.5.0.zip` - نسخه‌دار همان فایل

**اندازه فایل:** ~188 KB  
**شامل:** HTML, CSS, JS, فونت‌های فارسی

---

## مراحل نصب روی سرور

### 1️⃣ **آپلود فایل**
```bash
# آپلود فایل ZIP به سرور
scp react-edu-production.zip user@server:/path/to/web/
```

### 2️⃣ **استخراج فایل‌ها**
```bash
# در سرور
cd /path/to/web/
unzip react-edu-production.zip
```

### 3️⃣ **تنظیم مجوزها**
```bash
# تنظیم مجوز فایل‌ها
chmod -R 644 *
chmod 755 .
```

### 4️⃣ **پیکربندی وب سرور**

#### برای **Apache:**
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/web/
    ServerName flashcard.edukado.ir
    
    # تنظیم Cache برای static files
    <FilesMatch "\.(css|js|woff2|png|jpg|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </FilesMatch>
    
    # تنظیم gzip
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/css application/javascript
    </IfModule>
    
    # Fallback برای SPA
    FallbackResource /index.html
</VirtualHost>
```

#### برای **Nginx:**
```nginx
server {
    listen 80;
    server_name flashcard.edukado.ir;
    root /path/to/web/;
    index index.html;
    
    # Cache static files
    location ~* \.(css|js|woff2|png|jpg|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript;
    
    # SPA fallback
    try_files $uri $uri/ /index.html;
}
```

---

## محیط‌های API

### 🔧 **تنظیم محیط:**
اپلیکیشن از `VITE_ENV` برای تشخیص محیط استفاده می‌کند:

```bash
# محیط توسعه (Development)
export VITE_ENV=development
# API: https://apidev.edukado.ir

# محیط تولید (Production) - پیش‌فرض
export VITE_ENV=production  
# API: https://apibeta.edukado.ir
```

---

## بررسی عملکرد

### ✅ **تست نصب موفق:**
1. باز کردن `http://your-domain.com`
2. مشاهده صفحه فلش‌کارت
3. تست کلیک "درست/نادرست" 
4. بررسی نمایش پیام از API
5. تست سرعت انتقال کارت بعدی

### 🐛 **عیب‌یابی رایج:**
- **خطای 404:** بررسی `FallbackResource` یا `try_files`
- **فونت‌ها لود نمی‌شوند:** بررسی مسیر `/fonts/` 
- **API کار نمی‌کند:** بررسی CORS و network connectivity

---

## فایل‌های اصلی

```
📁 dist/
├── 📄 index.html          # صفحه اصلی
├── 📁 assets/
│   ├── 📄 index-CF6g16FK.js   # JavaScript اصلی (243KB)
│   └── 📄 index-C4BlUIGt.css  # استایل‌ها (39KB)
├── 📁 fonts/
│   ├── 📄 Vazirmatn-Regular.woff2  # فونت فارسی معمولی
│   └── 📄 Vazirmatn-Bold.woff2     # فونت فارسی ضخیم
└── 📄 vite.svg            # آیکون
```

---

## پشتیبانی

**Repository:** https://github.com/mehran282/edu_app  
**نسخه:** v1.5.0  
**سازگار با:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

---

*آخرین بروزرسانی: ۱۰ خرداد ۱۴۰۴* 