import * as components from '@/allFiles';
import styles from './style.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useMessage, useFeedback } from '@/hooks';
import { ArrowLeftGray } from '@/assets';
import { CommonQuestionType } from '@/types';
import { useEffect, useState } from 'react';

const Chat = () => {
  const { state: groupedQuestions } = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  // 메시지 관련 훅
  const {
    messages,
    currentTypingId,
    handleSendMessage,
    handleEndTyping,
    messagesLoading,
  } = useMessage(selectedConversationId ? String(selectedConversationId) : 'default');

  // 피드백 관련 훅
  const {
    feedbackContent,
    feedbackStrengths,
    feedbackOverallImpression,
    feedbackImprovementPoints,
    feedbackAdditionalAdvice,
    isModal,
    isLoadingFeedback,
    isFeedback,
    setIsFeedback,
    setIsModal,
    handleFeedback,
  } = useFeedback();

  // 모든 질문 가져오기
  const getAllQuestions = (): CommonQuestionType[] => {
    if (!groupedQuestions) {
      return [];
    }
    const questions = Object.entries(groupedQuestions).flatMap(
      ([groupName, questionList]) =>
        (questionList as CommonQuestionType[]).map(q => ({
          ...q,
          title: groupName,
        }))
    );
    return questions;
  };

  // 질문 텍스트 렌더링 (15자 이상 시 생략)
  const renderQuestion = (question: CommonQuestionType): string => {
    try {
      const questionText = question.question;
      return questionText.length >= 15 ? `${questionText.slice(0, 15)}...` : questionText;
    } catch (error) {
      return '유효하지 않은 질문';
    }
  };

  // 선택된 질문 찾기
  const findSelectedQuestion = (): CommonQuestionType | null => {
    if (!selectedConversationId) return null;
    const allQuestions = getAllQuestions();
    const selected = allQuestions.find(q => q.conversationId === selectedConversationId) || null;
    return selected;
  };

  // 질문 클릭 핸들러
  const handleQuestionClick = (conversationId: number) => {
    setSelectedConversationId(conversationId);
  };

  // 초기 질문 설정
  useEffect(() => {
    if (!selectedConversationId && getAllQuestions().length > 0) {
      const firstQuestion = getAllQuestions()[0];
      setSelectedConversationId(firstQuestion.conversationId);
    }
  }, [groupedQuestions]);

  // 메시지 길이가 10개 이상일 때 피드백 요청
  useEffect(() => {
    if (messages.length >= 10) {
      handleFeedback(selectedConversationId);
    } else {
      setIsModal(false);
    }
  }, [messages, selectedConversationId, handleFeedback, setIsModal]);

  useEffect(() => {
    if (messages.length >= 10) {
      handleFeedback(selectedConversationId);
    } else if (messages.length < 10) {
      setIsModal(false)
      setIsFeedback(false)
    }
  }, [messages, selectedConversationId]);

  return (
    <main className={styles.container}>
      {isModal && (
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
                    questions.map((question: CommonQuestionType) => (
                      <li
                        key={`${groupName}-question-${question.id}`}
                        className={`${styles.question} ${
                          selectedConversationId === question.conversationId ? styles.active : ''
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
            <components.PageLoading />
          ) : (
            <components.MessageList
              messages={messages}
              currentTypingId={currentTypingId}
              onEndTyping={handleEndTyping}
            />
          )}
           {isFeedback && <div onClick={() => setIsModal(true)} className={styles.feedbackModalOnButton}>최종 피드백 보기</div>}
          <div className={styles.message_form_container}>
            <components.MessageForm
              onSendMessage={handleSendMessage}
              messagesLength={messages.length}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Chat;