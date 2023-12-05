import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css"
import Home from './components/Home';
import CreateExam from './components/CreateExam';
import ExamCollection from './components/ExamCollection';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exams" element={<ExamCollection />} />
        <Route path="/exam/:id" element={<CreateExam />} />
        <Route path="/create-exam" element={<CreateExam />} />
      </Routes>
    </Router>
  );
};

export default App;
