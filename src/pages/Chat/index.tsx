import * as components from '@/allFiles';
import styles from './style.module.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMessage } from '@/hooks';
import { ArrowLeftGray } from '@/assets';
import { CommonQuestionType } from '@/types';
import { use, useEffect, useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const { state: groupedQuestions } = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [feedbackStrengths, setFeedbackStrengths] = useState<string>('');
  const [feedbackOverallImpression, setFeedbackOverallImpression] = useState<string>('');
  const [feedbackImprovementPoints, setFeedbackImprovementPoints] = useState<string>('');
  const [feedbackAdditionalAdvice, setFeedbackAdditionalAdvice] = useState<string>('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);
  const [isFeedback, setIsFeedback] = useState<boolean>(false)
  const navigate = useNavigate();

  const {
    messages,
    currentTypingId,
    handleSendMessage,
    handleEndTyping,
    messagesLoading,
  } = useMessage(selectedConversationId ? String(selectedConversationId) : 'default');

  const getAllQuestions = (): CommonQuestionType[] => {
    if (!groupedQuestions) return [];
    const questions: CommonQuestionType[] = Object.entries(groupedQuestions).flatMap(
      ([groupName, questionList]) =>
        (questionList as CommonQuestionType[]).map((q: CommonQuestionType) => ({
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
    return allQuestions.find((q: CommonQuestionType) => q.conversationId === selectedConversationId) || null;
  };

  const handleQuestionClick = (conversationId: number) => {
    setSelectedConversationId(conversationId);
  };

  const handleFeedback = async () => {
    setIsLoadingFeedback(true);

    if (messages.length < 10) {
      setIsModal(false);
      return;
    }

    try {
      // 1차 GET 시도
      let response;
      try {
        response = await axios.get(
          `https://folink.kro.kr/conversations/${selectedConversationId}/feedback`,
          {
            headers: { Accept: 'application/json' },
          }
        );
      } catch (error: any) {
        // 404 or 400일 때 POST 요청 후 재시도
        if (
          axios.isAxiosError(error) &&
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          // 피드백 생성 요청
          await axios.post(
            `https://folink.kro.kr/conversations/${selectedConversationId}/feedback`,
            null, // POST body 없음
            {
              headers: { Accept: 'application/json' },
            }
          );

          // POST 후 다시 GET 시도
          response = await axios.get(
            `https://folink.kro.kr/conversations/${selectedConversationId}/feedback`,
            {
              headers: { Accept: 'application/json' },
            }
          );
        } else {
          // 다른 에러일 경우 종료
          console.error(' 예기치 않은 피드백 요청 에러:', error);
          setIsModal(false);
          return;
        }
      }

      // 정상적으로 피드백 데이터 받았을 경우
      const data = response.data.data;
      setFeedbackContent(data.content);
      setFeedbackStrengths(data.strengths);
      setFeedbackOverallImpression(data.overallImpression);
      setFeedbackImprovementPoints(data.improvementPoints);
      setFeedbackAdditionalAdvice(data.additionalAdvice);
      setIsModal(true);
      setIsFeedback(true)
    } catch (error) {
      console.error(' 최종 피드백 처리 실패:', error);
      setIsModal(false);
    } finally {
      setIsLoadingFeedback(false);
    }
  };


  useEffect(() => {
    if (!selectedConversationId && getAllQuestions().length > 0) {
      const firstQuestion = getAllQuestions()[0];
      setSelectedConversationId(firstQuestion.conversationId);
    }
  }, [groupedQuestions]);

  useEffect(() => {
    if (messages.length >= 10) {
      handleFeedback();
    } else if (messages.length < 10) {
      setIsModal(false)
      setIsFeedback(false)
    }
  }, [messages, selectedConversationId]);
  console.log(isModal)
  return (
    <main className={styles.container}>
      {isModal === true && (
        <components.Feedback
          feedbackContent={feedbackContent}
          feedbackStrengths={feedbackStrengths}
          feedbackOverallImpression={feedbackOverallImpression}
          feedbackImprovementPoints={feedbackImprovementPoints}
          feedbackAdditionalAdvice={feedbackAdditionalAdvice}
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
          allQuestions={getAllQuestions()}
          setIsModal={setIsModal}
        />

      )}
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
                    (questions as CommonQuestionType[]).map((question: CommonQuestionType) => (
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
            <components.PageLoading status="loading" />
          ) : (
              <components.MessageList
                messages={messages}
                currentTypingId={currentTypingId}
                onEndTyping={handleEndTyping}
              />
          )}
          {isFeedback && <div onClick={() => setIsModal(true)} className={styles.feedbackModalOnButton}>최종 피드백</div>}
          <components.MessageForm onSendMessage={handleSendMessage} messagesLength={messages.length} />
        </div>
      </section>
    </main>
  );
};

export default Chat;
