import { useState, useEffect, useRef } from 'react';
import { toPersianNumbers, arabicToPersian } from '../utils/persianNumbers';
import { API_ENDPOINTS } from '../config/environment';

// انواع داده‌ها
export interface ApiResponse {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: {
    flipcardId: string;
    text: string;
    description: string;
    topicTitle: string;
  };
}

export interface ValidationResponse {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: boolean;
}

export interface ValidationRequest {
  flipcardId: string;
  isTrue: boolean;
}

export interface Flashcard {
  id: string;
  statement: string;
  explanation: string | null;
  flipcardId: string;
  topicTitle: string;
}

// Interface برای داده‌های خام کارت از API
export interface ApiCardData {
  flipcardId: string;
  text: string;
  description: string;
  topicTitle: string;
}

// سرویس API
class FlashcardApiService {
  static async getRandomFlashcard(): Promise<Flashcard> {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ANONYMOUS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (!result.isSuccess) {
        throw new Error(result.message || 'خطا در دریافت داده');
      }

      // تبدیل داده‌های API به فرمت داخلی و اصلاح حروف عربی
      return {
        id: result.data.flipcardId,
        statement: arabicToPersian(result.data.text),
        explanation: result.data.description ? arabicToPersian(result.data.description) : null,
        flipcardId: result.data.flipcardId,
        topicTitle: arabicToPersian(result.data.topicTitle)
      };
    } catch (error) {
      console.error('خطا در دریافت فلش کارت:', error);
      throw new Error('خطا در دریافت داده از سرور');
    }
  }

  static async validateResponse(flipcardId: string, userAnswer: boolean): Promise<ValidationResponse> {
    try {
      const requestBody: ValidationRequest = {
        flipcardId: flipcardId,
        isTrue: userAnswer
      };

      const response = await fetch(API_ENDPOINTS.VALIDATE_RESPONSE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ValidationResponse = await response.json();
      return result;
    } catch (error) {
      console.error('خطا در اعتبارسنجی پاسخ:', error);
      throw new Error('خطا در اعتبارسنجی پاسخ');
    }
  }

  // تولید URL سازگار برای routing
  static generateTopicSlug(topicTitle: string): string {
    return topicTitle
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w-]/g, '')
      .toLowerCase();
  }
}

// هوک سفارشی برای مدیریت فلش‌کارت‌ها
export const useFlashcardService = () => {
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [nextCard, setNextCard] = useState<Flashcard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [cardHistory, setCardHistory] = useState<Flashcard[]>([]);
  const hasInitialized = useRef(false); // برای جلوگیری از فراخوانی مکرر
  
  // دریافت فلش‌کارت جدید از API
  const getNewCard = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newCard = await FlashcardApiService.getRandomFlashcard();
      setCurrentCard(newCard);
      
      // اضافه کردن کارت جدید به تاریخچه
      setCardHistory(prev => [...prev, newCard]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطای نامشخص';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Prefetch کارت بعدی در بکگراند
  const prefetchNextCard = async (): Promise<void> => {
    try {
      const newCard = await FlashcardApiService.getRandomFlashcard();
      setNextCard(newCard);
    } catch (error) {
      console.warn('خطا در prefetch کارت بعدی:', error);
      // خطا در prefetch نباید روی UX تاثیر بگذارد
    }
  };

  // ست کردن کارت prefetch شده (برای استفاده خارجی)
  const setPrefetchedCard = (cardData: ApiCardData): void => {
    try {
      // تبدیل داده‌های API به فرمت داخلی
      const prefetchedCard: Flashcard = {
        id: cardData.flipcardId,
        statement: arabicToPersian(cardData.text),
        explanation: cardData.description ? arabicToPersian(cardData.description) : null,
        flipcardId: cardData.flipcardId,
        topicTitle: arabicToPersian(cardData.topicTitle)
      };
      setNextCard(prefetchedCard);
    } catch (error) {
      console.warn('خطا در ست کردن کارت prefetch شده:', error);
    }
  };

  // بارگذاری اولیه کارت - فقط یک بار
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      getNewCard();
    }
  }, []);

  // دریافت کارت فعلی
  const getCurrentCard = (): Flashcard | null => {
    return currentCard;
  };

  // رفتن به فلش‌کارت بعدی (استفاده از prefetched card یا دریافت جدید)
  const goToNextCard = async (): Promise<void> => {
    if (nextCard) {
      // استفاده از کارت prefetch شده
      setCurrentCard(nextCard);
      setCardHistory(prev => [...prev, nextCard]);
      setNextCard(null);
      
      // Prefetch کارت بعدی برای استفاده آینده
      prefetchNextCard();
    } else {
      // fallback: دریافت کارت جدید اگر prefetch موجود نیست
      await getNewCard();
    }
  };

  // اعتبارسنجی پاسخ کاربر از طریق API
  const validateUserAnswer = async (userAnswer: boolean): Promise<boolean> => {
    if (!currentCard) {
      throw new Error('کارت فعلی موجود نیست');
    }

    try {
      // شروع prefetch کارت بعدی در بکگراند
      prefetchNextCard();
      
      const validationResult = await FlashcardApiService.validateResponse(
        currentCard.flipcardId, 
        userAnswer
      );
      
      // بررسی موفقیت API call
      if (validationResult.isSuccess) {
        // data = true یعنی پاسخ کاربر صحیح بوده
        return validationResult.data;
      } else {
        console.error('خطا در validation API:', validationResult.message);
        throw new Error(validationResult.message || 'خطا در اعتبارسنجی پاسخ');
      }
    } catch (error) {
      console.error('خطا در validateUserAnswer:', error);
      throw error;
    }
  };

  // بررسی صحیح بودن پاسخ (فقط برای مدیریت امتیاز)
  const markAsCorrect = (): void => {
    addScore(1);
  };

  const markAsIncorrect = (): void => {
    // هیچ عملی انجام نمی‌دهیم، فقط برای یکپارچگی API
  };

  // افزایش امتیاز
  const addScore = (points: number): void => {
    setScore(prevScore => prevScore + points);
  };

  // بازنشانی امتیاز
  const resetScore = (): void => {
    setScore(0);
  };

  // بازنشانی تاریخچه
  const resetHistory = (): void => {
    setCardHistory([]);
  };

  // دریافت تاریخچه کارت‌ها
  const getCardHistory = (): Flashcard[] => {
    return cardHistory;
  };

  // تولید URL برای کارت فعلی
  const getCurrentCardUrl = (): string => {
    if (!currentCard) return '';
    const topicSlug = FlashcardApiService.generateTopicSlug(currentCard.topicTitle);
    return `/education/flashcards/${topicSlug}/${currentCard.flipcardId}`;
  };

  return {
    getCurrentCard,
    getNewCard,
    nextCard: goToNextCard, // تغییر نام برای وضوح بیشتر
    validateUserAnswer,
    markAsCorrect,
    markAsIncorrect,
    score,
    persianScore: toPersianNumbers(score),
    resetScore,
    resetHistory,
    getCardHistory,
    getCurrentCardUrl,
    setPrefetchedCard, // اضافه کردن method جدید
    isLoading,
    error,
    cardHistory
  };
}; 