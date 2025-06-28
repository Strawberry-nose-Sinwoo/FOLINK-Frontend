import React from 'react';
import styles from './style.module.css';
import FeedbackIcon from '../../assets/FeedbackIcon.png'
import { useNavigate } from 'react-router-dom';

interface ModalProps {
    feedbackContent: string;
    feedbackStrengths: string;
    feedbackOverallImpression: string;
    feedbackImprovementPoints: string;
    feedbackAdditionalAdvice: string;
}

const Feedback = ({ feedbackContent, feedbackStrengths, feedbackOverallImpression, feedbackImprovementPoints, feedbackAdditionalAdvice }: ModalProps) => {
    const navigate = useNavigate()

    const handlerGoMainPage = () => {
        navigate('/')
        localStorage.removeItem('question_history')
    }
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
                <button 
                    className={styles.meetOtherInterviewer}
                    onClick={() => handlerGoMainPage()}
                >
                    다른 면접관 만나기
                </button>
            </div>
        </div>
    );
};

export default Feedback;