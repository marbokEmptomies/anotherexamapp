import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ExamCard from './ExamCard';
import { fetchExams, postExam, selectExams } from '../features/exams/examsSlice';
import { AppState, useAppDispatch } from '../store/store';
import { Exam } from '../server/types/types';
import { Button } from '@mui/material';

function ExamCollection() {
  const dispatch = useAppDispatch();
  const exams = useSelector((state: AppState) => state.exams.exams);
  const status = useSelector((state: AppState) => state.exams.status);
  const error = useSelector((state: AppState) => state.exams.error);

  const [creatingExam, setCreatingExam] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExams());
    }
  }, [dispatch, status]);

  const handleCreateExam = async () => {
    setCreatingExam(true);
    try {
      let newExam: Exam = {
        id: 0,
        name: 'Uusi tentti',
        questions: [],
      };
      await dispatch(postExam(newExam));
    } catch (error) {
      console.error('Error creating an exam: ', error);
    } finally {
      setCreatingExam(false);
    }
  };

  return (
    <div>
      <Button color="inherit" onClick={handleCreateExam}>
        Luo uusi tentti
      </Button>
      {creatingExam ? (
        <p>Luodaan uutta tenttiä...</p>
      ) : exams.length === 0 ? (
        <p>Ei tenttejä</p>
      ) : (
        <div>
          {status === 'loading' && <p>Ladataan tenttejä...</p>}
          {status === 'failed' && <p>Virhe: {error}</p>}
          {status === 'succeeded' &&
            exams.map((exam: Exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
        </div>
      )}
    </div>
  );
}

export default ExamCollection;
