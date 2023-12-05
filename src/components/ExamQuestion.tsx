import React, { useState } from 'react';
import { useAppDispatch } from "../store/store"
import { deleteQuestion, updateQuestion, addAnswerOption } from "../features/exams/examsSlice"
import { uuid, Question, AnswerOption } from "../../types/types";

interface QuestionProps {
  examId: string,
  question: Question,
}

const ExamQuestion: React.FC<QuestionProps> = ({ examId, question }) => {
  const dispatch = useAppDispatch();
  const [editedQuestionText, setEditedQuestionText] = useState(question.questionText);

  const handleSaveQuestion = () => {
    const editedQuestion: Question = {
      ...question,
      questionText: editedQuestionText,
    };
    dispatch(updateQuestion({ examId, question: editedQuestion }));
  };

  const handleDeleteQuestion = () => {
    dispatch(deleteQuestion({ examId, questionId: question.id }));
  };

  const handleAddAnswerOption = () => {
    const newAnswerOption: AnswerOption = {
      id: uuid(),
      questionId: question.id,
      answerOptionText: 'Uusi vastausvaihtoehto',
      isCorrect: false,
    };

    dispatch(addAnswerOption({ examId, questionId: question.id, answerOption: newAnswerOption }));
  };

  return (
    <div>
      <h3>
        <input
        type="text"
        value={editedQuestionText}
        onChange={(e) => setEditedQuestionText(e.target.value)}
      />
      </h3>
      <button onClick={handleSaveQuestion}>Tallenna muutokset</button>
      <button onClick={handleDeleteQuestion}>Poista kysymys</button>
      <button onClick={handleAddAnswerOption}>Lisää vastausvaihtoehto</button>
    </div>
  );
}

export default ExamQuestion;