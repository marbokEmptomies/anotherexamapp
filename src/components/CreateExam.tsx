import { useState, useEffect} from 'react';
import { useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux'
import { RootState } from "../store/rootReducer";
import { useNavigate, useParams } from 'react-router-dom';
import {
    addExam,
    addQuestion,
    updateExam,
} from '../features/exams/examsSlice';
import ExamQuestion from './ExamQuestion';
import { uuid, Exam, Question } from '../../types/types';

const CreateExam: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
  
    // Exams
    const [examName, setExamName] = useState('');
    const [maxScore, setMaxScore] = useState<number | null>(null);
    const [selectedExam, setSelectedExam] = useState<string | null>(id || null);
  
    // Questions
    const exams = useSelector((state: RootState) => state.exams.exams);
    const selectedExamData = exams.find((exam) => exam.id === selectedExam);
    const questions = selectedExamData?.questions || [];

    useEffect(() => {
        // Set initial values when editing an existing exam
        if (selectedExamData) {
          setExamName(selectedExamData.name || '');
          setMaxScore(selectedExamData.maxScore || null);
        }
      }, [selectedExamData]);
  
    const handleCreateExam = () => {
      if (selectedExam) {
        const updatedExam: Exam = {
          isCompleted: false,
          id: selectedExam,
          name: examName,
          maxScore: maxScore ?? 0,
          questions: questions,
        };
        dispatch(updateExam(updatedExam));
        console.log('Updated exam: ', updatedExam);
        navigate(`/exams`);
      } else {
        if (maxScore !== null) {
          const newExam: Exam = {
            id: uuid(),
            isCompleted: false,
            name: examName,
            maxScore: maxScore ?? 0,
            questions: questions,
          };
  
          dispatch(addExam(newExam));
          setSelectedExam(newExam.id);
          navigate(`/exam/${newExam.id}`);
        } else {
          // Handle the case where maxScore is not provided
          console.error('Max score is required');
        }
      }

    };
    const handleAddQuestion = () => {
      const newQuestion: Question = {
          examId: selectedExam || "",
          id: uuid(),
          questionText: "Uusi kysymys",
          answerOptions: []
      };

      dispatch(addQuestion({examId: selectedExam || "", question: newQuestion}))
    }
    
    return (
        <div>
        <button onClick={() => navigate(`/`)}>Takaisin etusivulle</button>
        <button onClick={handleCreateExam}>Tallenna tentti</button>
        <h1>Luo / Muokkaa tenttiä</h1>
        <label>
          Tentin nimi:
          <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} onBlur={handleCreateExam}/>
        </label>
        <br />
        <label>
          Maksimipisteet:
          <input
            type="number"
            value={maxScore ?? ''}
            onChange={(e) => setMaxScore(e.target.value !== '' ? Number(e.target.value) : null)}
            onBlur={handleCreateExam}
          />
        </label>
        <br />
        <h2>Kysymykset</h2>
        <button onClick={handleAddQuestion}>Lisää kysymys</button>
        {selectedExam && (
          <div>
            {questions.map((question) => (
              <ExamQuestion
                key={question.id}
                examId={selectedExam}
                question={question}
              />
            ))}
          </div>
        )}
        <br />
      </div>
    );
  };
  
  export default CreateExam;