import * as components from '@/allFiles';
import styles from './style.module.css';

import { Link, useLocation } from 'react-router-dom';
import { useMessage } from '@/hooks';
import { ArrowLeftGray } from '@/assets';
import { CommonQuestionType } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const { state: groupedQuestions } = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [isModal, setIsModal] = useState<boolean>(false)
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [feedbackStrengths, setFeedbackStrengths] = useState('');
  const [feedbackOverallImpression, setFeedbackOverallImpression] = useState('');
  const [feedbackImprovementPoints, setFeedbackImprovementPoints] = useState('');
  const [feedbackAdditionalAdvice, setFeedbackAdditionalAdvice] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const {
    messages,
    currentTypingId,
    handleSendMessage,
    handleEndTyping,
    messagesLoading,
  } = useMessage(selectedConversationId ? String(selectedConversationId) : 'default');

  const getAllQuestions = (): CommonQuestionType[] => {
    if (!groupedQuestions) {
      return [];
    }
    const questions = Object.entries(groupedQuestions).flatMap(([groupName, questionList]) =>
      (questionList as CommonQuestionType[]).map(q => ({
        ...q,
        title: groupName,
      }))
    );
    return questions;
  };

  const renderQuestion = (question: CommonQuestionType): string => {
    try {
      const questionText = question.question;
      return questionText.length >= 15 ? `${questionText.slice(0, 15)}...` : questionText;
    } catch (error) {
      return '유효하지 않은 질문';
    }
  };

  const findSelectedQuestion = (): CommonQuestionType | null => {
    if (!selectedConversationId) return null;
    const allQuestions = getAllQuestions();
    return allQuestions.find(q => q.conversationId === selectedConversationId) || null;
  };

  const handleQuestionClick = (conversationId: number) => {
    setSelectedConversationId(conversationId);
  };

  const isLastQuestion = () => {
    const allQuestions = getAllQuestions();
    if (!selectedConversationId || !allQuestions.length) return false;
    const currentIndex = allQuestions.findIndex(q => q.conversationId === selectedConversationId);
    return currentIndex === allQuestions.length - 1;
  };

  const handleFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      await axios.post(`https://folink.kro.kr/conversations/${selectedConversationId}/feedback`, {
        headers: { 'Accept': 'application/json' }
      });

      const response = await axios.get(`https://folink.kro.kr/conversations/${selectedConversationId}/feedback`, {
        headers: { 'Accept': 'application/json' }
      });
      const data = response.data.data;

      setFeedbackContent(data.content);
      setFeedbackStrengths(data.strengths);
      setFeedbackOverallImpression(data.overallImpression);
      setFeedbackImprovementPoints(data.improvementPoints);
      setFeedbackAdditionalAdvice(data.additionalAdvice);

      console.log('Feedback Content:', data.content);
      console.log('Feedback Strengths:', data.strengths);
      console.log('Feedback Overall Impression:', data.overallImpression);
      console.log('Feedback Improvement Points:', data.improvementPoints);
      console.log('Feedback Additional Advice:', data.additionalAdvice);
    } catch (error) {
      console.error('Error processing feedback:', error);
    } finally {
      setIsLoadingFeedback(false);
      setIsModal(true)
    }
  };

  useEffect(() => {
    if (!selectedConversationId && getAllQuestions().length > 0) {
      const firstQuestion = getAllQuestions()[0];
      setSelectedConversationId(firstQuestion.conversationId);
    }
  }, [groupedQuestions]);

  useEffect(() => {
    if (messages.length >= 10 && isLastQuestion()) {
      handleFeedback();
    }
  }, [messages, selectedConversationId]);

  return (
    <main className={styles.container}>
      {isModal &&
        <components.Feedback
          feedbackContent={feedbackContent}
          feedbackStrengths={feedbackStrengths}
          feedbackOverallImpression={feedbackOverallImpression}
          feedbackImprovementPoints={feedbackImprovementPoints}
          feedbackAdditionalAdvice={feedbackAdditionalAdvice}
        />
      }
      <nav className={styles.nav}>
        <Link to={'/'}>
          <div className={styles.back}>
            <img src={ArrowLeftGray} alt="뒤로 가기" width={25} height={25} />
            다른 질문 받아보기
          </div>
        </Link>
        <ul className={styles.question_list}>
          {groupedQuestions ? (
            Object.entries(groupedQuestions).map(([groupName, questions]) => (
              <ol key={groupName}>
                <ul className={styles.questionList}>
                  {Array.isArray(questions) && questions.length > 0 ? (
                    questions.map((question: CommonQuestionType) => (
                      <li
                        key={`${groupName}-question-${question.id}`}
                        className={`${styles.question} ${selectedConversationId === question.conversationId ? styles.active : ''
                          }`}
                        onClick={() => handleQuestionClick(question.conversationId)}
                      >
                        {renderQuestion(question)}
                      </li>
                    ))
                  ) : (
                    <li>해당 그룹에 질문이 없습니다.</li>
                  )}
                </ul>
              </ol>
            ))
          ) : (
            <li>질문이 없습니다.</li>
          )}
        </ul>
      </nav>
      <section className={styles.main}>
        <div className={styles.chat}>
          <div className={styles.chatHeader}>
            {selectedConversationId && findSelectedQuestion() ? (
              <h2 className={styles.chatTitle}>
                {findSelectedQuestion()?.title}: {findSelectedQuestion()?.question}
              </h2>
            ) : (
              <h2 className={styles.chatTitle}>질문을 선택해주세요</h2>
            )}
          </div>
          {messagesLoading || isLoadingFeedback ? (
            <components.PageLoading status='loading' />
          ) : (
            <components.MessageList
              messages={messages}
              currentTypingId={currentTypingId}
              onEndTyping={handleEndTyping}
            />
          )}
          <components.MessageForm onSendMessage={handleSendMessage} messagesLength={messages.length} />
        </div>
      </section>
    </main>
  );
};

export default Chat;