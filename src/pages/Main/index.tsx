import styles from './style.module.css';
import { useState } from 'react';
import { Toastify } from '@/allFiles';
import { ArrowRight } from '@/assets';
import { useFileUpload } from '@/hooks';

const Main = () => {
  const { fileInputRef, isFileSelected, handleClick, handleFileChange, resetFile } = useFileUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    Toastify({
      type: "loading",
      message: "면접 질문을 불러오는 중입니다..",
    });
  };

  return (
    <main className={styles.container}>
      <section className={styles.main}>
        <header className={styles.title_container}>
          <h1>포트폴리오 내용으로 예상 면접 질문을 받아보세요!</h1>
        </header>
        <section className={styles.chat_container}>
          <input
            type="text"
            className={styles.chat_input}
            placeholder="포트폴리오 내용을 입력하세요."
            aria-label="포트폴리오 내용 입력"
          />
          <section className={styles.btn_container}>
            <article>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="application/pdf"
                onChange={handleFileChange}
                aria-label="PDF 파일 업로드"
              />
              <button
                className={styles.pdf_btn}
                onClick={handleClick}
                aria-label={isFileSelected ? 'PDF 파일 삽입됨' : 'PDF 파일 삽입'}
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
            </article>
            <button
              className={styles.send_btn}
              onClick={handleSubmit}
              aria-label={isSubmitting ? '질문 생성 중' : '질문 생성'}
              disabled={isSubmitting}
            >
              <img
                src={ArrowRight}
                alt="질문 생성 버튼"
                width={15}
                height={15}
              />
            </button>
          </section>
        </section>
      </section>
    </main>
  );
};

export default Main;