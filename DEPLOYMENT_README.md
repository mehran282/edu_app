# راهنمای نصب اپلیکیشن ادوکادو - فلش‌کارت آموزشی

## 📋 مشخصات پروژه
- **نام**: فلش کارت Edukado
- **تکنولوژی**: React + TypeScript + Vite
- **فونت**: Vazirmatn (محلی - بدون نیاز به اینترنت)
- **راهکار**: SPA (Single Page Application)

## 📁 فایل‌های آماده تحویل
پوشه `dist` شامل فایل‌های زیر است:
```
dist/
├── index.html
├── fonts/
│   ├── Vazirmatn-Regular.woff2 (50KB)
│   └── Vazirmatn-Bold.woff2 (51KB)
└── assets/
    ├── index-Ve9ZjyX5.js (241KB)
    └── index-BarIJPbT.css (37KB)
```

## 🌐 ویژگی Offline
✅ **فونت‌های محلی**: تمام فایل‌های فونت Vazirmatn در پوشه `/fonts/` قرار گرفته  
✅ **بدون وابستگی CDN**: هیچ درخواست خارجی برای فونت‌ها  
✅ **سرور بدون اینترنت**: UI کاملاً مستقل از اتصال اینترنت  
⚠️ **فقط API**: برای دریافت فلش‌کارت‌ها نیاز به دسترسی به `apibeta.edukado.ir`

## 🚀 نصب روی سرور Nginx

### ۱. آپلود فایل‌ها
تمام محتویات پوشه `dist` را در مسیر root وب‌سایت آپلود کنید:
```bash
# مثال: اگر root وب‌سایت /var/www/html است
sudo cp -r dist/* /var/www/html/
```

### ۲. تنظیمات Nginx
فایل تنظیمات Nginx (معمولاً در `/etc/nginx/sites-available/default`):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/html;
    index index.html;
    
    # پشتیبانی از React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # فشرده‌سازی فایل‌ها
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Cache برای فایل‌های استاتیک
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # امنیت هدرها
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### ۳. راه‌اندازی SSL (اختیاری ولی توصیه‌شده)
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # سایر تنظیمات مشابه بالا
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# ریدایرکت HTTP به HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### ۴. مجوزهای فایل
```bash
# تنظیم مالکیت فایل‌ها
sudo chown -R www-data:www-data /var/www/html/

# تنظیم مجوزها
sudo chmod -R 755 /var/www/html/
```

### ۵. راه‌اندازی مجدد Nginx
```bash
# بررسی صحت تنظیمات
sudo nginx -t

# راه‌اندازی مجدد
sudo systemctl reload nginx
```

## 📱 مسیرهای اپلیکیشن

### مسیرهای اصلی:
- `/` - ریدایرکت به فلش‌کارت
- `/education/flashcards` - صفحه اصلی فلش‌کارت
- `/test` - فرم تست نمایش متن

### API مورد استفاده:
- `https://apibeta.edukado.ir/Flipcard/GetAnonymous`

## ✨ ویژگی‌های پیاده‌شده

### ✅ UI/UX:
- طراحی راستچین فارسی
- فونت Vazirmatn محلی (بدون CDN)
- اعداد فارسی در همه بخش‌ها
- انیمیشن‌های روان
- ریسپانسیو (موبایل فرندلی)

### ✅ قابلیت‌ها:
- نمایش فلش‌کارت‌های تعاملی
- پردازش متن‌های JSON و ساده
- حذف فرمت Bold
- حذف 4 کاراکتر ابتدایی (اعداد، خط تیره، نقطه)
- تبدیل خودکار اعداد انگلیسی به فارسی
- سیستم امتیازدهی با اعداد فارسی
- انیمیشن confetti
- فرم تست جامع
- لینک ثبت نام در Edukado
- اعتبارسنجی پاسخ‌ها از طریق API سرور

### ✅ بهینه‌سازی:
- Bundle size: 241KB (gzipped: 77KB)
- CSS: 37KB (gzipped: 6.70KB)
- Font files: 101KB (محلی)
- عملکرد بالا
- SEO فرندلی

### ✅ API Integration:
- دریافت فلش‌کارت: `GetAnonymous`
- اعتبارسنجی پاسخ: `ValidateResponseAnonymous`
- مدیریت خطا و وضعیت loading
- رابط کاربری تعاملی با فیدبک API

### ✅ Offline Features:
- فونت‌های محلی بجای CDN
- کاملاً مستقل از اینترنت (UI)
- مناسب برای سرورهای محدود

## 🔧 عیب‌یابی

### مشکلات احتمالی:
1. **صفحه 404 هنگام refresh**: 
   - اطمینان حاصل کنید که `try_files $uri $uri/ /index.html;` در تنظیمات nginx وجود دارد

2. **فونت‌ها لود نمی‌شوند**:
   - بررسی کنید که پوشه `/fonts/` و فایل‌های woff2 موجود هستند
   - بررسی مجوزهای فایل‌ها

3. **API کار نمی‌کند**:
   - بررسی CORS تنظیمات سرور
   - اطمینان از دسترسی به `https://apibeta.edukado.ir`

## 📞 پشتیبانی
در صورت بروز مشکل، لطفاً موارد زیر را بررسی کنید:
- لاگ‌های nginx: `sudo tail -f /var/log/nginx/error.log`
- Console مرورگر (F12)
- Network tab برای بررسی درخواست‌های API

---
**تاریخ ساخت**: $(date)  
**نسخه**: 1.3.0-offline  
**توسعه‌دهنده**: تیم ادوکادو 