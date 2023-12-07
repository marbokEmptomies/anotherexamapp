import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { deleteExamById } from '../features/exams/examsSlice';
import { Exam } from '../../types/types';

interface ExamListItemProps {
    exam: Exam;
}

const ExamListItem: React.FC<ExamListItemProps> = ({exam}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleDeleteExam = async () => {
        await dispatch(deleteExamById(exam.id))
        /* dispatch(deleteExam(exam.id)) */
    }

    return (
        <li>
            <div>
                <h3>{exam.name}</h3>
                <p>Maksimipisteet: {exam.maxScore}</p>
                <button onClick={() => navigate(`/exam/${exam.id}`)}>Muokkaa tenttiä</button>
                <button onClick={handleDeleteExam}>Poista tentti</button>
            </div>
        </li>
    )
}

export default ExamListItem