// تنظیمات محیط توسعه و تولید

export interface EnvironmentConfig {
  API_BASE_URL: string;
  IS_DEVELOPMENT: boolean;
  ENVIRONMENT_NAME: string;
}

// محیط های مختلف
const environments = {
  development: {
    API_BASE_URL: 'https://apidev.edukado.ir',
    IS_DEVELOPMENT: true,
    ENVIRONMENT_NAME: 'development'
  },
  production: {
    API_BASE_URL: 'https://apibeta.edukado.ir',
    IS_DEVELOPMENT: false,
    ENVIRONMENT_NAME: 'production'
  }
};

// تشخیص محیط فعلی بر اساس متغیر محیطی VITE_ENV
const getEnvironment = (): keyof typeof environments => {
  // ابتدا از VITE_ENV استفاده می‌کنیم
  const viteEnv = import.meta.env.VITE_ENV as keyof typeof environments;
  if (viteEnv && environments[viteEnv]) {
    return viteEnv;
  }
  
  // سپس از MODE استفاده می‌کنیم
  const mode = import.meta.env.MODE;
  if (mode === 'development') {
    return 'development';
  }
  
  // در نهایت production به عنوان پیش‌فرض
  return 'production';
};

// تنظیمات فعلی محیط
export const config: EnvironmentConfig = environments[getEnvironment()];

// URL های API
export const API_ENDPOINTS = {
  GET_ANONYMOUS: `${config.API_BASE_URL}/Flipcard/GetAnonymous`,
  VALIDATE_RESPONSE: `${config.API_BASE_URL}/Flipcard/ValidateResponseAnonymous`
};

// لاگ برای debug کردن environment
if (config.IS_DEVELOPMENT) {
  console.log('🚀 Environment Config:', {
    environment: config.ENVIRONMENT_NAME,
    apiBaseUrl: config.API_BASE_URL,
    viteEnv: import.meta.env.VITE_ENV,
    mode: import.meta.env.MODE
  });
}

export default config; 