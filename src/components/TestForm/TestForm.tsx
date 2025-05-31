import React, { useState } from 'react';
import QuillRenderer from '../QuillRenderer/QuillRenderer';
import { useFlashcardService } from '../../services/FlashcardService';
import type { Flashcard } from '../../services/FlashcardService';
import { TestDataService } from '../../services/TestDataService';
import { toPersianNumbers } from '../../utils/persianNumbers';
import './TestForm.css';

interface ApiTestResult {
  error?: string;
  data?: Flashcard;
}

const TestForm: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [selectedTest, setSelectedTest] = useState('text');
  const [apiTestResult, setApiTestResult] = useState<ApiTestResult | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  
  const flashcardService = useFlashcardService();

  // نمونه متن‌های تست
  const sampleTexts = {
    simple: 'این یک متن ساده فارسی است. اعداد: ۱۲۳۴۵۶۷۸۹۰',
    complex: 'این متن **بولد** و *ایتالیک* و _آندرلاین_ دارد.',
    withNumbers: 'فصل ۸: رفتارهای جانوران - صفحه ۱۲۳',
    scientific: 'دمای بدن انسان معمولاً ۳۷ درجه سانتی‌گراد است.'
  };

  const sampleJson = [
    { insert: 'این متن ' },
    { insert: 'بولد', attributes: { bold: true } },
    { insert: ' و ' },
    { insert: 'رنگی', attributes: { color: '#ff0000' } },
    { insert: ' است.\nخط دوم با اعداد فارسی: ۱۲۳۴۵' }
  ];

  const handleTextTest = () => {
    setSelectedTest('text');
  };

  const handleJsonTest = () => {
    setSelectedTest('json');
    setJsonInput(JSON.stringify(sampleJson, null, 2));
  };

  const loadSampleText = (key: keyof typeof sampleTexts) => {
    setTextInput(sampleTexts[key]);
    setSelectedTest('text');
  };

  const loadTestData = () => {
    const testCard = TestDataService.getRandomTestCard();
    setTextInput(testCard.statement);
    setSelectedTest('text');
  };

  const testApiData = async () => {
    setIsLoadingApi(true);
    try {
      await flashcardService.getNewCard();
      const currentCard = flashcardService.getCurrentCard();
      if (currentCard) {
        setApiTestResult({ data: currentCard });
        setTextInput(currentCard.statement);
        setSelectedTest('text');
      }
    } catch (error) {
      console.error('خطا در دریافت دیتای API:', error);
      setApiTestResult({ error: 'خطا در دریافت دیتا از API' });
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <div className="test-form-container" dir="rtl">
      <h1>فرم تست نمایش متن</h1>
      
      <div className="test-controls">
        <div className="button-group">
          <button 
            className={`btn ${selectedTest === 'text' ? 'active' : ''}`}
            onClick={handleTextTest}
          >
            تست متن ساده
          </button>
          <button 
            className={`btn ${selectedTest === 'json' ? 'active' : ''}`}
            onClick={handleJsonTest}
          >
            تست JSON
          </button>
        </div>

        <div className="sample-buttons">
          <h3>نمونه متن‌ها:</h3>
          <button onClick={() => loadSampleText('simple')} className="btn sample-btn">
            متن ساده
          </button>
          <button onClick={() => loadSampleText('complex')} className="btn sample-btn">
            متن فرمت دار
          </button>
          <button onClick={() => loadSampleText('withNumbers')} className="btn sample-btn">
            متن با اعداد
          </button>
          <button onClick={() => loadSampleText('scientific')} className="btn sample-btn">
            متن علمی
          </button>
        </div>

        <div className="api-test-section">
          <h3>تست دیتا:</h3>
          <button onClick={loadTestData} className="btn api-btn">
            بارگذاری دیتای تست
          </button>
          <button 
            onClick={testApiData} 
            className="btn api-btn"
            disabled={isLoadingApi}
          >
            {isLoadingApi ? 'در حال بارگذاری...' : 'تست API واقعی'}
          </button>
        </div>
      </div>

      <div className="input-section">
        {selectedTest === 'text' ? (
          <div>
            <label htmlFor="text-input">متن برای تست:</label>
            <textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="متن خود را اینجا وارد کنید..."
              rows={5}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="json-input">JSON برای تست:</label>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="JSON خود را اینجا وارد کنید..."
              rows={10}
            />
          </div>
        )}
      </div>

      <div className="preview-section">
        <h3>پیش‌نمایش:</h3>
        <div className="preview-card">
          <div className="card-header">
            <span className="score">امتیاز: {toPersianNumbers(12)}</span>
            <span className="topic">موضوع: فصل {toPersianNumbers(8)}: رفتارهای جانوران</span>
          </div>
          <div className="card-content">
            {selectedTest === 'text' ? (
              <QuillRenderer content={textInput} className="test-content" />
            ) : (
              <QuillRenderer content={jsonInput} className="test-content" />
            )}
          </div>
          <div className="card-actions">
            <button className="btn btn-correct">درست</button>
            <button className="btn btn-incorrect">نادرست</button>
          </div>
        </div>
      </div>

      {apiTestResult && (
        <div className="api-result-section">
          <h3>نتیجه تست API:</h3>
          <div className="api-result">
            {apiTestResult.error ? (
              <p className="error">{apiTestResult.error}</p>
            ) : (
              <div>
                <p><strong>ID:</strong> {apiTestResult.data?.id}</p>
                <p><strong>موضوع:</strong> {apiTestResult.data?.topicTitle}</p>
                <p><strong>متن:</strong> {apiTestResult.data?.statement?.substring(0, 100)}...</p>
                <p><strong>توضیح:</strong> {apiTestResult.data?.explanation?.substring(0, 100) || 'ندارد'}...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="debug-section">
        <h3>اطلاعات دیباگ:</h3>
        <div className="debug-info">
          <p><strong>نوع تست:</strong> {selectedTest === 'text' ? 'متن ساده' : 'JSON'}</p>
          <p><strong>طول محتوا:</strong> {toPersianNumbers(selectedTest === 'text' ? textInput.length : jsonInput.length)}</p>
          <p><strong>محتوا خالی است:</strong> {(selectedTest === 'text' ? textInput : jsonInput) ? 'خیر' : 'بله'}</p>
          <p><strong>وضعیت API:</strong> {isLoadingApi ? 'در حال بارگذاری' : 'آماده'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestForm; 