import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import FeedbackIcon from '../../assets/FeedbackIcon.png';
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

    //버튼을 눌렀을때 실행
    const handlerClickButton = () => {
        if (selectedConversationId === null) return;

        //현재 선택되어있는 질문이 몇번째인지
        const currentIndex = allQuestions.findIndex(
            (q) => q.conversationId === selectedConversationId
        );
        const nextIndex = currentIndex + 1;

        //현재 질문의 번지수와 모든 질문의 갯수를 비교 하여 만약 작다면 다음 질문으로
        if (nextIndex < allQuestions.length) {
            setSelectedConversationId(allQuestions[nextIndex].conversationId);
        }
        //만약 현재 질문의 번지수와 모든 질문의 갯수가 같다면 메인 페이지로 이동 및 히스토리 삭제 
        else {
            navigate('/');
            localStorage.removeItem('question_history');
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>AI 면접관의 피드백</h2>
                <img src={FeedbackIcon} alt="" width={150} />
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
