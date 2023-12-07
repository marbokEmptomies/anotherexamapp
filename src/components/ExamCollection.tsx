import { useEffect } from 'react'
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { useNavigate } from 'react-router-dom'
import { fetchExams } from "../features/exams/examsSlice";
import { AppState } from "../store/store";
import { Exam } from "../../types/types";
import ExamListItem from './ExamListItem';

const ExamCollection: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const exams = useSelector((state: AppState) => state.exams.exams);
    const status = useSelector((state: AppState) => state.exams.status);
    const error = useSelector((state: AppState) => state.exams.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchExams());
        }
    }, [dispatch, status])

    const handleCreateNewExam = () => {
        navigate(`/create-exam`)
    }

    return (
        <div>
            <button onClick={() => navigate(`/`)}>Takaisin etusivulle</button>
            <button onClick={handleCreateNewExam}>Luo uusi tentti</button>
            {exams.length === 0 ? (
                <p>Ei tenttejä</p>
            ) : (
                <div>
                    <h1>Kaikki tentit</h1>
                    {status === 'loading' && <p>Ladataan tenttejä...</p>}
                    {status === 'failed' && <p>Virhe: {error}</p>}
                    {status === 'succeeded' &&
                        <ul>
                            {exams.map((exam: Exam) => (
                                <ExamListItem key={exam.id} exam={exam} />
                            ))}
                        </ul>
                    }
                </div>)}
        </div>
    )
}

export default ExamCollection;
