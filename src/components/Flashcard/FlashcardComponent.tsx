import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcardService } from '../../services/FlashcardService';
import ConfettiComponent from '../Confetti/ConfettiComponent';
import QuillRenderer from '../QuillRenderer/QuillRenderer';
import './FlashcardStyles.css';

const FlashcardComponent: React.FC = () => {
  const navigate = useNavigate();
  const flashcardService = useFlashcardService();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [isCardChanging, setIsCardChanging] = useState(false);
  const [prevScore, setPrevScore] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  // اثر جانبی برای آپدیت URL هنگام تغییر کارت
  useEffect(() => {
    const currentCard = flashcardService.getCurrentCard();
    if (currentCard && !flashcardService.isLoading) {
      const newUrl = flashcardService.getCurrentCardUrl();
      // فقط اگر URL فعلی متفاوت باشد، navigate کن
      if (window.location.pathname !== newUrl) {
        navigate(newUrl, { replace: true });
      }
    }
  }, [flashcardService.getCurrentCard(), navigate, flashcardService.isLoading]);

  // اثر جانبی برای انیمیشن امتیاز
  useEffect(() => {
    if (flashcardService.score > prevScore) {
      setAnimateScore(true);
      const timer = setTimeout(() => {
        setAnimateScore(false);
      }, 400);
      
      return () => clearTimeout(timer);
    }
    
    setPrevScore(flashcardService.score);
  }, [flashcardService.score, prevScore]);

  // برگرداندن کارت
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // بررسی پاسخ با استفاده از API
  const checkAnswer = async (userAnswer: boolean) => {
    if (isValidating) return; // جلوگیری از کلیک مکرر
    
    setIsValidating(true);
    flipCard();
    
    try {
      // API call برای validation
      const isCorrectAnswer = await flashcardService.validateUserAnswer(userAnswer);
      
      setTimeout(() => {
        if (isCorrectAnswer) {
          setFeedbackMessage('آفرین! پاسخ شما صحیح بود.');
          setShowConfetti(true);
          flashcardService.markAsCorrect();
          
          setTimeout(() => {
            setShowConfetti(false);
          }, 3000);
        } else {
          setFeedbackMessage('متأسفانه پاسخ شما اشتباه بود.');
          flashcardService.markAsIncorrect();
        }
        setShowFeedback(true);
        setIsValidating(false);
      }, 650); // کمی بیشتر از مدت زمان انیمیشن چرخش (0.6s)
    } catch (error) {
      console.error('خطا در validation:', error);
      
      setTimeout(() => {
        setFeedbackMessage('خطا در بررسی پاسخ. لطفاً مجدداً تلاش کنید.');
        setShowFeedback(true);
        setIsValidating(false);
      }, 650);
    }
  };

  // رفتن به کارت بعدی
  const goToNextCard = async () => {
    setShowFeedback(false);
    setIsCardChanging(true);
    setIsFlipped(false);
    
    setTimeout(async () => {
      await flashcardService.nextCard();
      setIsCardChanging(false);
    }, 650); // کمی بیشتر از مدت زمان انیمیشن چرخش (0.6s)
  };

  const currentCard = flashcardService.getCurrentCard();

  return (
    <main className="flashcard-container" dir="rtl">
      <header>
        <h1 className="seo-heading">فلش کارت Edukado</h1>
        <div className="app-header">
          <div className="score-container">
            <span className="score-label">امتیاز: </span>
            <span className={`score-value ${animateScore ? 'animate' : ''}`}>{flashcardService.persianScore}</span>
          </div>
          {currentCard && (
            <div className="topic-container">
              <span className="topic-label">موضوع: </span>
              <span className="topic-title">{currentCard.topicTitle}</span>
            </div>
          )}
        </div>
      </header>

      {/* نمایش وضعیت بارگذاری */}
      {flashcardService.isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>
      )}

      {/* نمایش خطا */}
      {flashcardService.error && (
        <div className="error-container">
          <p className="error-message">{flashcardService.error}</p>
          <button 
            className="btn retry-btn" 
            onClick={() => flashcardService.getNewCard()}
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* نمایش کارت */}
      {currentCard && !flashcardService.isLoading && !flashcardService.error && (
        <section className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-front">
            <div className={`card-content ${isCardChanging ? 'changing' : ''}`}>
              <QuillRenderer content={currentCard.statement} className="statement" />
            </div>
            <div className="card-actions">
              <button 
                className="btn btn-correct" 
                onClick={(e) => { e.stopPropagation(); checkAnswer(true); }}
                aria-label="انتخاب گزینه درست"
                disabled={isCardChanging || isValidating}
              >
                درست
              </button>
              <button 
                className="btn btn-incorrect" 
                onClick={(e) => { e.stopPropagation(); checkAnswer(false); }}
                aria-label="انتخاب گزینه نادرست"
                disabled={isCardChanging || isValidating}
              >
                نادرست
              </button>
            </div>
          </div>
          <div className="card-back">
            <div className="result-container">
              <div className={`feedback ${showFeedback ? 'visible' : ''}`}>
                <div className={`feedback-icon ${
                  feedbackMessage === 'آفرین! پاسخ شما صحیح بود.' ? 'correct-icon' : 'incorrect-icon'
                }`}>
                  {feedbackMessage === 'آفرین! پاسخ شما صحیح بود.' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
                      <path fill="#4caf50" d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
                      <path fill="#f44336" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41z"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className={`card-content ${showFeedback ? 'visible' : ''}`}>
              {currentCard.explanation ? (
                <QuillRenderer content={currentCard.explanation} className="explanation" />
              ) : (
                <p className="simple-feedback">
                  {feedbackMessage === 'آفرین! پاسخ شما صحیح بود.' ? 'گزاره صحیح' : 'گزاره غلط'}
                </p>
              )}
            </div>
            <div className="card-actions">
              <button 
                className="btn next" 
                onClick={(e) => { e.stopPropagation(); goToNextCard(); }}
                aria-label="رفتن به کارت بعدی"
                disabled={isCardChanging}
              >
                بعدی
              </button>
            </div>
          </div>
        </section>
      )}

      <ConfettiComponent trigger={showConfetti} />
      
      {/* نمایش نسخه اپ */}
      <div className="app-version">
        نسخه ۱.۴
      </div>
      
      <footer className="seo-footer">
        <p className="seo-description">
          <a href="https://edukado.ir/" target="_blank" rel="noopener noreferrer" className="edukado-link">
            ثبت نام و شخصی سازی فلش کارت 
          </a>
        </p>
      </footer>
    </main>
  );
};

export default FlashcardComponent; 