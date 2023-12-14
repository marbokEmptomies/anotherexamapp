import { useState } from 'react';
import { useAppDispatch } from '../store/store';
import {useSelector} from 'react-redux'
import { postExam } from '../features/exams/examsSlice';
import { Exam } from '../../types/types';

const CreateExam: React.FC = () => {
  const dispatch = useAppDispatch();
  const newExamId = useSelector((state: Exam) => state.id);
  console.log("NEW ID: ", newExamId)

  const [examName, setExamName] = useState('');

  const handleCreateExam = async () => {
    try {
      if (examName && examName.trim() !== "") {
        const newExam: Exam = {
          id: "",
          name: examName,
          questions: [],
        };

        // Dispatch the postExam action to create a new exam
        await dispatch(postExam(newExam));

        // Now, you can use the newExamId from the Redux state
        console.log('Newly created exam ID: ', newExamId);
      } else {
        console.error('Max score and non-empty exam name required!');
      }
    } catch (error) {
      console.error('Error creating exam: ', error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateExam}>Luo tentti</button>
      <label>
        Tentin nimi:
        <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} />
      </label>
    </div>
  );
};

export default CreateExam;
