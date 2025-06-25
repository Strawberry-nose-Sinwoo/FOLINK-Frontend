import styles from './style.module.css';

import { useState, useEffect } from 'react';

interface LoadingType {
  status?: string | 'loading' | 'success'
}
const Loading = ({ status }: LoadingType) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if(status === 'success') {
      const timer = setTimeout(() => {
        setFadeOut(true)
      }, 500)
      return () => clearTimeout(timer)
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

export default Loading;