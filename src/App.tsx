import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FlashcardComponent from './components/Flashcard/FlashcardComponent';
import TestForm from './components/TestForm/TestForm';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/education/flashcards" replace />} />
        <Route path="/test" element={<TestForm />} />
        <Route path="/education/flashcards" element={<FlashcardComponent />} />
        <Route path="/education/flashcards/:topicSlug" element={<FlashcardComponent />} />
        <Route path="/education/flashcards/:topicSlug/:optionId" element={<FlashcardComponent />} />
        <Route path="*" element={<Navigate to="/education/flashcards" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
