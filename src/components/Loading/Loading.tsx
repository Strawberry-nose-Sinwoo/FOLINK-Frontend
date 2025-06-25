import styles from './style.module.css';
import { useState, useEffect } from 'react';

interface LoadingType {
  status?: string | 'loading' | 'success';
}

export const PageLoading = ({ status }: LoadingType) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

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

  return (
    <div
      className={`${styles.overlay} ${fadeIn ? styles.fadeIn : ''} ${
        fadeOut ? styles.fadeOut : ''
      }`}
    >
      <div className={styles.loading} />
    </div>
  );
};

interface QuestionLoadingType {
  status?: 'loading' | 'success';
  progress?: number;
}

export const QuestionLoading = ({ status, progress = 0 }: QuestionLoadingType) => {
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
    setTextFadeIn(false); 
    const timer = setTimeout(() => {
      setTextFadeIn(true); 
    }, 10);
    return () => clearTimeout(timer);
  }, [progress <= 50]); 

  const loadingText = progress <= 50 ? '면접 질문을 생성중입니다..' : '면접 질문을 검토중입니다!';

  return (
    <div
      className={`${styles.overlay} ${fadeIn ? styles.fadeIn : ''} ${
        fadeOut ? styles.fadeOut : ''
      }`}
    >
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
    </div>
  );
};