import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux'
import { RootState } from "../store/rootReducer";
import { useNavigate, useParams } from 'react-router-dom';
import {
  postExam,
  updateExamById,
  createQuestion,
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

  const handleCreateExam = async () => {
    if (selectedExam) {
      const updatedExam: Exam = {
        isCompleted: false,
        id: selectedExam,
        name: examName,
        maxScore: maxScore ?? 0,
        questions: [...questions],
      };
      
      await dispatch(updateExamById(updatedExam));
      console.log('Updated exam: ', updatedExam);
      navigate(`/exams`);
    } else {
      if (maxScore !== null && examName && examName.trim() !== "") {
        const newExam: Exam = {
          id: uuid(),
          isCompleted: false,
          name: examName,
          maxScore: maxScore ?? 0,
          questions: [...questions],
        };

        //Api call to add a new exam
        await dispatch(postExam(newExam));
        /* dispatch(addExam(newExam)); */
        setSelectedExam(newExam.id);
      } else {
        console.error('Max score and non-empty exam name required!');
      }
    }

  };
  const handleAddQuestion = async () => {
    const newQuestion: Question = {
      examId: selectedExam || "",
      id: uuid(),
      questionText: "Uusi kysymys",
      answerOptions: []
    };

    await dispatch(createQuestion({ examId: selectedExam || "", question: newQuestion }))
  }

  return (
    <div>
      <button onClick={() => navigate(`/`)}>Takaisin etusivulle</button>
      <button onClick={() => navigate('/exams')}>Kaikki tentit</button>
      <button onClick={handleCreateExam}>Tallenna tentti</button>
      <h1>Luo / Muokkaa tenttiä</h1>
      <label>
        Tentin nimi:
        <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} />
      </label>
      <br />
      <label>
        Maksimipisteet:
        <input
          type="number"
          value={maxScore ?? ''}
          onChange={(e) => setMaxScore(e.target.value !== '' ? Number(e.target.value) : null)}
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