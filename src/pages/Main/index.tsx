import styles from './style.module.css';

import { useState } from 'react';
import { Toastify } from '@/allFiles';
import { ArrowRight } from '@/assets';
import { useFileUpload } from '@/hooks';

const Main = () => {
  const { fileInputRef, isFileSelected, handleClick, handleFileChange, resetFile } = useFileUpload();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toastOnClick = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    Toastify({
      type: 'loading',
      message: '면접 질문을 불러오는 중입니다..',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title_container}>
          <h1>포트폴리오 내용으로 예상 면접 질문을 받아보세요!</h1>
        </div>
        <div className={styles.chat_container}>
          <input
            type="text"
            className={styles.chat_input}
            placeholder="포트폴리오 내용을 입력하세요."
          />
          <div className={styles.btn_container}>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <button
                className={styles.pdf_btn}
                onClick={handleClick}
                aria-label={isFileSelected ? 'PDF 삽입됨' : '+ PDF 삽입'}
                disabled={isFileSelected}
              >
                {isFileSelected ? '삽입됨' : '+ PDF 삽입'}
              </button>
              {isFileSelected && (
                <button
                  className={styles.reset_btn}
                  onClick={resetFile}
                  aria-label="파일 선택 초기화"
                >
                  초기화
                </button>
              )}
            </div>
            <button
              className={styles.send_btn}
              onClick={toastOnClick}
              aria-label={isSubmitting ? '전송 중' : '전송'}
              disabled={isSubmitting}
            >
              <img
                src={ArrowRight}
                alt="오른쪽 화살표"
                width={15}
                height={15}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Main;