import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { AnswerOption, Exam, Question } from '../server/types/types';
import { useAppDispatch } from '../store/store';
import {
    deleteExamById,
    updateExamById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createAnswerOption,
    updateAnswerOption,
    deleteAnswerOption,
    fetchExams,
} from '../features/exams/examsSlice';

interface AnswerOptionProps {
    answerOption: AnswerOption;
    onUpdateAnswerOption: (answerOption: AnswerOption) => void;
    onDeleteAnswerOption: () => void;
}

const AnswerOptionComponent: React.FC<AnswerOptionProps> = ({ answerOption, onUpdateAnswerOption, onDeleteAnswerOption }) => {
    const [answerOptionText, setAnswerOptionText] = useState(answerOption.answer_text);
    const [isCorrect, setIsCorrect] = useState(answerOption.is_correct)
    const [aoEditMode, setAoEditMode] = useState(false)

    const handleUpdateAnswerOption = () => {
        onUpdateAnswerOption({ ...answerOption, answer_text: answerOptionText, is_correct: isCorrect });
        setAoEditMode(false);
    };

    return (
        <div>
            {aoEditMode ? (
                <>
                    <input
                        type="text"
                        value={answerOptionText}
                        onChange={(e) => setAnswerOptionText(e.target.value)}
                    />
                    <label>
                        <p>Onko oikein? 
                        <input
                            type="checkbox"
                            checked={isCorrect} 
                            onChange={() => setIsCorrect(!isCorrect)}
                        /></p>
                    </label>
                    <Button color="inherit" onClick={handleUpdateAnswerOption}>
                        <SaveIcon />
                    </Button>
                </>
            ) : (
                <>
                    <Typography>{answerOptionText}</Typography>
                    <Typography>
                        Oikein:
                        <input type="checkbox" checked={isCorrect} disabled/>
                    </Typography>
                    <Button color="inherit" onClick={() => setAoEditMode(true)}>
                        <ModeEditIcon />
                    </Button>
                    <Button color="inherit" onClick={onDeleteAnswerOption}>
                        <DeleteIcon />
                    </Button>
                </>
            )}
        </div>
    );
};

interface QuestionProps {
    question: Question;
    onUpdateQuestion: (question: Question) => void;
    onDeleteQuestion: () => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
    question,
    onUpdateQuestion,
    onDeleteQuestion,
}) => {
    const [questionText, setQuestionText] = useState(question.question_text);
    const [editMode, setEditMode] = useState(false);
    const dispatch = useAppDispatch();

    const handleUpdateQuestion = () => {
        onUpdateQuestion({ ...question, question_text: questionText });
        setEditMode(false);
    };

    const handleAddAnswerOption = async () => {
        await dispatch(createAnswerOption({ questionId: question.id as number, answerOptionText: "Uusi vastausvaihtoehto", isCorrect: false }));
    };

    const handleUpdateAnswerOption = (answerOption: AnswerOption) => {
        dispatch(updateAnswerOption(answerOption));
    };

    const handleDeleteAnswerOption = (id: number) => {
        console.log("handleDEL_AO id:", id)
        dispatch(deleteAnswerOption(id));
    };

    return (
        <div>
            {editMode ? (
                <>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    />
                    <Button color="inherit" onClick={handleUpdateQuestion}>
                        <SaveIcon />
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h6">{questionText}</Typography>
                    <Button color="inherit" onClick={() => setEditMode(true)}>
                        <ModeEditIcon />
                    </Button>
                    <Button color="inherit" onClick={onDeleteQuestion}>
                        <DeleteIcon />
                    </Button>
                </>
            )}
            <ul>
                {question.answer_options?.map((answerOption: AnswerOption, aoIndex) => (
                    <AnswerOptionComponent
                        key={aoIndex}
                        answerOption={answerOption}
                        onUpdateAnswerOption={(updatedAnswerOption) =>
                            handleUpdateAnswerOption(updatedAnswerOption)
                        }
                        onDeleteAnswerOption={() => handleDeleteAnswerOption(answerOption.id)} />
                ))}
            </ul>
            <Button color="inherit" onClick={handleAddAnswerOption}>
                <AddIcon />
            </Button>
        </div>
    );
};

interface ExamCardProps {
    exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
    console.log("ExamCard: ", exam)
    const dispatch = useAppDispatch();

    const [examName, setExamName] = useState(exam.name);
    const [titleEditMode, setTitleEditMode] = useState(false);

    const handleUpdateTitle = () => {
        dispatch(updateExamById({ ...exam, name: examName }));
        setTitleEditMode(false);
    };

    const handleDeleteExam = async () => {
        await dispatch(deleteExamById(exam.id));
    };

    const handleAddQuestion = async () => {
        try {
            let newQuestion: Question = {
                exam_id: exam.id,
                id: 0,
                question_text: 'Uusi Kysymys',
                answer_options: [],
            };
            await dispatch(createQuestion(newQuestion));
        } catch (error) {
            console.error("Error adding a question:", error)
        }
    };

    const handleUpdateQuestion = (question: Question) => {
        dispatch(updateQuestion(question));
    };

    const handleDeleteQuestion = (id: number) => {
        console.log("handleDELQ id:", id)
        dispatch(deleteQuestion(id));
    };

    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h4" color="text.secondary" gutterBottom>
                        {titleEditMode ? (
                            <>
                                <input
                                    type="text"
                                    value={examName}
                                    onChange={(e) => setExamName(e.target.value)}
                                />
                                <Button color="inherit" onClick={handleUpdateTitle}>
                                    <SaveIcon />
                                </Button>
                            </>
                        ) : (
                            <>
                                {exam.name}
                                <Button color="inherit" onClick={() => setTitleEditMode(true)}>
                                    <ModeEditIcon />
                                </Button>
                            </>
                        )}
                        <Button color="inherit" onClick={handleDeleteExam}>
                            <DeleteIcon />
                        </Button>
                    </Typography>
                    {exam.questions.map((question: Question, qIndex) => (
                        <QuestionComponent
                            key={qIndex}
                            question={question}
                            onUpdateQuestion={(updatedQuestion) =>
                                handleUpdateQuestion(updatedQuestion)
                            }
                            onDeleteQuestion={() => handleDeleteQuestion(question.id)}
                        />
                    ))}
                    <Button color="inherit" onClick={handleAddQuestion}>
                        <AddIcon />
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ExamCard;
