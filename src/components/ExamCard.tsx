import React, { useState } from 'react';
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
} from '../features/exams/examsSlice';

interface AnswerOptionProps {
  answerOption: AnswerOption;
}

const AnswerOptionComponent: React.FC<AnswerOptionProps> = ({ answerOption }) => {
  return (
    <li>
      <Typography>{answerOption.answer_text}</Typography>
    </li>
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

  const handleUpdateQuestion = () => {
    onUpdateQuestion({ ...question, question_text: questionText });
    setEditMode(false);
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
          <Typography>{questionText}</Typography>
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
          <AnswerOptionComponent key={aoIndex} answerOption={answerOption} />
        ))}
      </ul>
    </div>
  );
};

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const dispatch = useAppDispatch();

  const [examName, setExamName] = useState(exam.name);
  const [titleEditMode, setTitleEditMode] = useState(false);

  const handleUpdateTitle = () => {
    dispatch(updateExamById({ ...exam, name: examName }));
    setTitleEditMode(false);
  };

  const handleDeleteExam = async () => {
    await dispatch(deleteExamById(exam.exam_id as number));
  };

  const handleAddQuestion = async () => {
    await dispatch(createQuestion({examId : exam.exam_id as number, questionText: "Uusi kysymys" }));
  };

  const handleUpdateQuestion = (question: Question) => {
    console.log("handleUQ: ", question)
    dispatch(updateQuestion(question));
  };

  const handleDeleteQuestion = (questionId: number) => {
    dispatch(deleteQuestion({ examId: exam.exam_id as number, questionId }));
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
