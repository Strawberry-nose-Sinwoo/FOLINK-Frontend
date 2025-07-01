import { Write } from '@/assets';
import styles from './style.module.css';
import { useState, useEffect } from 'react';

interface LoadingProps {
  status?: 'loading' | 'success';
  type: 'page' | 'question' | 'feedback';
  progress?: number; 
}

export const Loading = ({ status, type, progress = 0 }: LoadingProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [textFadeIn, setTextFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (type === 'question') {
      setTextFadeIn(false);
      const timer = setTimeout(() => {
        setTextFadeIn(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [type, progress]);

  const renderContent = () => {
    switch (type) {
      case 'page':
        return <div className={styles.loading} />;
      case 'question':
        const loadingText =
          progress <= 50 ? '면접 질문을 생성중입니다..' : '면접 질문을 검토중입니다!';
        return (
          <div className={styles.loadingContainer}>
            <span className={`${styles.progressText} ${textFadeIn ? styles.textFadeIn : ''}`}>
              {loadingText}
            </span>
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      case 'feedback':
        return <img src={Write} alt="피드백 이미지" width={200}/>
      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.overlay} ${fadeIn ? styles.fadeIn : ''} ${
        fadeOut ? styles.fadeOut : ''
      }`}
    >
      {renderContent()}
    </div>
  );
};