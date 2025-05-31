import React, { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';
import { toPersianNumbers } from '../../utils/persianNumbers';

interface QuillRendererProps {
  content: string;
  className?: string;
}

interface DeltaOperation {
  insert: string;
  attributes?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    background?: string;
  };
}

const QuillRenderer: React.FC<QuillRendererProps> = ({ content, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // تابع حذف 4 کاراکتر اول اگر عدد یا - یا . باشند
  const cleanStartingChars = (text: string): string => {
    if (!text || text.length < 4) return text;
    
    const firstFourChars = text.substring(0, 4);
    
    // بررسی اینکه آیا تمام کاراکترهای 4 تایی اول عدد، خط تیره، نقطه یا فاصله هستند
    const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                         '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹',
                         '-', '.', ' ', '\t', '\u200C', '\u200D', '\u200E', '\u200F'];
    
    const isOnlySpecialChars = Array.from(firstFourChars).every(char => 
      allowedChars.includes(char)
    );
    
    if (isOnlySpecialChars) {
      return text.substring(4).trim();
    }
    
    return text;
  };

  useEffect(() => {
    if (!containerRef.current || !content) return;

    try {
      // تمیز کردن محتوا از backslash های اضافی
      let cleanContent = content;
      
      // حذف backslash های اضافی اگر وجود دارد
      if (content.includes('\\')) {
        cleanContent = content.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      
      let parsedContent: DeltaOperation[];
      
      // بررسی اینکه آیا محتوا JSON است
      if (cleanContent.trim().startsWith('[') || cleanContent.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(cleanContent);
          
          if (Array.isArray(parsed)) {
            parsedContent = parsed;
          } else if (parsed && typeof parsed === 'object' && parsed.insert) {
            parsedContent = [parsed];
          } else {
            parsedContent = [{ insert: String(parsed) }];
          }
        } catch {
          // اگر پارس نشد، محتوا را به عنوان متن ساده در نظر بگیر
          parsedContent = [{ insert: cleanContent }];
        }
      } else {
        // محتوا متن ساده است
        parsedContent = [{ insert: cleanContent }];
      }

      // تبدیل Delta به HTML
      const htmlContent = deltaToHtml(parsedContent);
      containerRef.current.innerHTML = htmlContent;

    } catch (error) {
      console.error('خطا در رندر محتوای Quill:', error);
      // در صورت خطا، محتوا را به صورت متن ساده نمایش بده
      if (containerRef.current) {
        containerRef.current.innerHTML = content || '';
      }
    }
  }, [content]);

  // تابع تبدیل Delta به HTML
  const deltaToHtml = (delta: DeltaOperation[]): string => {
    let html = '';
    let isFirstOperation = true;
    
    for (const op of delta) {
      if (op.insert) {
        let text = String(op.insert);
        
        // ابتدا تبدیل اعداد انگلیسی به فارسی
        text = toPersianNumbers(text);
        
        // سپس حذف 4 کاراکتر اول فقط از اولین عملیات
        if (isFirstOperation) {
          text = cleanStartingChars(text);
          isFirstOperation = false;
        }
        
        // اعمال فرمت‌ها (بدون bold)
        if (op.attributes) {
          // حذف فرمت bold - دیگر اعمال نمی‌شود
          // if (op.attributes.bold) {
          //   text = `<strong>${text}</strong>`;
          // }
          if (op.attributes.italic) {
            text = `<em>${text}</em>`;
          }
          if (op.attributes.underline) {
            text = `<u>${text}</u>`;
          }
          if (op.attributes.color) {
            text = `<span style="color: ${op.attributes.color}">${text}</span>`;
          }
          if (op.attributes.background) {
            text = `<span style="background-color: ${op.attributes.background}">${text}</span>`;
          }
        }
        
        // تبدیل new line ها به <br>
        text = text.replace(/\n/g, '<br>');
        html += text;
      }
    }
    
    return html;
  };

  if (!content) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`quill-content ${className}`}
      style={{
        fontFamily: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit'
      }}
    />
  );
};

export default QuillRenderer; 