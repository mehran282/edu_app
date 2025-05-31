# راهنمای استفاده از Environment های مختلف

این پروژه از دو محیط مختلف پشتیبانی می‌کند:

## محیط های موجود

### 1. Development (توسعه)
- **API Base URL**: `https://apidev.edukado.ir`
- **استفاده**: برای توسعه و تست

### 2. Production (تولید)
- **API Base URL**: `https://apibeta.edukado.ir`
- **استفاده**: برای نسخه نهایی

## Scripts موجود

### Development Scripts
```bash
# اجرای پروژه در محیط توسعه (dev environment)
npm run dev

# اجرای پروژه در محیط تولید (production environment) برای تست
npm run dev:prod
```

### Build Scripts
```bash
# Build برای محیط تولید (پیش‌فرض)
npm run build

# Build برای محیط توسعه
npm run build:dev
```

## نحوه کارکرد

1. **تشخیص محیط**: سیستم به ترتیب زیر محیط را تشخیص می‌دهد:
   - ابتدا متغیر `VITE_ENV` را بررسی می‌کند
   - سپس متغیر `MODE` را چک می‌کند
   - در نهایت `production` را به عنوان پیش‌فرض انتخاب می‌کند

2. **Configuration File**: تمام تنظیمات در فایل `src/config/environment.ts` مدیریت می‌شود

3. **API Endpoints**: تمام URL های API بر اساس محیط انتخاب شده به صورت خودکار تنظیم می‌شوند

## تغییرات API

### خروجی متد GetAnonymous
```json
{
  "statusCode": 200,
  "message": "string",
  "isSuccess": true,
  "data": {
    "flipcardId": "string",
    "text": "string",
    "description": "string",
    "topicTitle": "string"
  }
}
```

### ورودی متد ValidateResponseAnonymous
```json
{
  "flipcardId": "string",
  "isTrue": true
}
```

## Debug Mode

در محیط توسعه، اطلاعات environment در کنسول نمایش داده می‌شود:

```
🚀 Environment Config: {
  environment: "development",
  apiBaseUrl: "https://apidev.edukado.ir",
  viteEnv: "development",
  mode: "development"
}
``` 