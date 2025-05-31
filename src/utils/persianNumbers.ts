/**
 * تبدیل اعداد انگلیسی به فارسی
 */
export const toPersianNumbers = (text: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return text.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

/**
 * تبدیل اعداد فارسی به انگلیسی (در صورت نیاز)
 */
export const toEnglishNumbers = (input: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = String(input);
  
  for (let i = 0; i < persianDigits.length; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
  }
  
  return result;
};

// تبدیل حروف عربی به فارسی
export const arabicToPersian = (text: string): string => {
  if (!text) return text;
  
  return text
    .replace(/ي/g, 'ی')        // ي عربی به ی فارسی
    .replace(/ك/g, 'ک')        // ك عربی به ک فارسی
    .replace(/ؤ/g, 'و')        // ؤ به و
    .replace(/أ/g, 'ا')        // أ به ا
    .replace(/إ/g, 'ا')        // إ به ا
    .replace(/ء/g, '')         // همزه مجرد حذف
    .replace(/ة/g, 'ه')        // ة عربی به ه فارسی
    .replace(/ئ/g, 'ئ')        // ئ (این درست است)
    .replace(/ۀ/g, 'ه')        // ۀ به ه
    .replace(/\u064B/g, '')    // حذف تنوین فتح
    .replace(/\u064C/g, '')    // حذف تنوین ضم
    .replace(/\u064D/g, '')    // حذف تنوین کسر
    .replace(/\u064E/g, '')    // حذف فتحه
    .replace(/\u064F/g, '')    // حذف ضمه
    .replace(/\u0650/g, '')    // حذف کسره
    .replace(/\u0651/g, '')    // حذف شدّه
    .replace(/\u0652/g, '')    // حذف سکون
    .replace(/\u0653/g, '')    // حذف مدّه
    .replace(/\u0654/g, '')    // حذف همزه بالا
    .replace(/\u0655/g, '')    // حذف همزه پایین
    .replace(/\u0656/g, '')    // حذف subscript alef
    .replace(/\u0657/g, '')    // حذف inverted damma
    .replace(/\u0658/g, '')    // حذف mark noon ghunna
    .replace(/\u0659/g, '')    // حذف zwarakay
    .replace(/\u065A/g, '')    // حذف vowel sign small v
    .replace(/\u065B/g, '')    // حذف vowel sign inverted small v
    .replace(/\u065C/g, '')    // حذف vowel sign dot below
    .replace(/\u065D/g, '')    // حذف reversed damma
    .replace(/\u065E/g, '')    // حذف fatha with two dots
    .replace(/\u065F/g, '')    // حذف wavy hamza below
    .replace(/\u0670/g, '');   // حذف superscript alef
}; 