import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import { FinallyFeedbackIcon } from '@/assets';
import { useNavigate } from 'react-router-dom';
import { CommonQuestionType } from '@/types';

interface ModalProps {
    feedbackContent: string;
    feedbackStrengths: string;
    feedbackOverallImpression: string;
    feedbackImprovementPoints: string;
    feedbackAdditionalAdvice: string;
    selectedConversationId: number | null;
    allQuestions: CommonQuestionType[];
    setSelectedConversationId: React.Dispatch<React.SetStateAction<number | null>>;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Feedback = ({
    feedbackContent,
    feedbackStrengths,
    feedbackOverallImpression,
    feedbackImprovementPoints,
    feedbackAdditionalAdvice,
    selectedConversationId,
    setSelectedConversationId,
    allQuestions,
    setIsModal
}: ModalProps) => {
    const navigate = useNavigate();
    const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);

    //선택한 질문의 id가 변할때마다 실행
    useEffect(() => {
        if (selectedConversationId === null) return;
        const currentIndex = allQuestions.findIndex(
            (q) => q.conversationId === selectedConversationId
        );
        setIsLastQuestion(currentIndex === allQuestions.length - 1);
    }, [selectedConversationId, allQuestions]);

    const handlerClickButton = () => {
        setIsModal(false)
        if (selectedConversationId === null) return;

        const currentIndex = allQuestions.findIndex(
            (q) => q.conversationId === selectedConversationId
        );
        const nextIndex = currentIndex + 1;

        if (nextIndex < allQuestions.length) {
            // 다음 질문 있으면 -> 다음 질문으로 이동 + 모달 닫기
            setSelectedConversationId(allQuestions[nextIndex].conversationId);
            setIsModal(false);
        } else {
            // 마지막 질문이면 모달은 그대로 유지 -> 홈으로 이동
            navigate('/');
            localStorage.removeItem('question_history');
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.closeButton} onClick={() => setIsModal(false)}>X</div>
                <h2 className={styles.title}>AI 면접관의 피드백</h2>
                <img src={FinallyFeedbackIcon} alt="" width={150} />
                <h3>전반적인 평가</h3>
                <p className={styles.content}>{feedbackContent}</p>
                <h3>면접관의 감정</h3>
                <p className={styles.content}>{feedbackStrengths}</p>
                <h3>전반적인 인상</h3>
                <p className={styles.content}>{feedbackOverallImpression}</p>
                <h3>개선 포인트</h3>
                <p className={styles.content}>{feedbackImprovementPoints}</p>
                <h3>추가 조언</h3>
                <p className={styles.content}>{feedbackAdditionalAdvice}</p>
                <button className={styles.meetOtherInterviewer} onClick={handlerClickButton}>
                    {isLastQuestion ? '다른 면접관 만나기' : '다음 질문 넘어가기'}
                </button>
            </div>
        </div>
    );
};

export default Feedback;