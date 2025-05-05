import styles from './style.module.css';

import { useState } from 'react';
import { Toastify } from '@/allFiles';
import { ArrowRight, Close } from '@/assets';
import { useFileUpload } from '@/hooks';
import { PostType } from '@/types';
import { useGenerateQuestion } from '@/hooks/useGenerateQuestion';

const Main = () => {
  const { fileInputRef, isFileSelected, handleClick, handleFileChange, resetFile } = useFileUpload();
  const { mutate, isPending } = useGenerateQuestion();
  const [inputText, setInputText] = useState('');
  const toastId = 'question-generate-toast';

  const handleSubmit = () => {
    if (isPending || !inputText.trim()) return;
    Toastify({
      type: 'dismiss',
      toastId: toastId,
    });

    Toastify({
      type: 'loading',
      message: '면접 질문을 불러오는 중입니다..',
      toastId: toastId,
    });

    const data: PostType = { text: inputText };
    mutate(data, {
      onSuccess: (response) => {
        console.log('질문 추출 결과:', response);
        Toastify({
          type: 'update',
          iconType: 'success',
          message: '질문 생성이 완료되었습니다!',
          toastId: toastId,
          render: 'success',
        });
      },
      onError: (error) => {
        console.error('질문 생성 실패:', error);
        Toastify({
          type: 'error',
          message: '질문 생성에 실패했습니다.',
        });
      },
    });
  };

  const selectedFileName = fileInputRef.current?.files?.[0]?.name || '';

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
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <section className={styles.btn_container}>
            <article className={styles.file_upload_container}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {!isFileSelected && (
                <button className={styles.pdf_btn} onClick={handleClick}>
                  + PDF 삽입
                </button>
              )}
              {isFileSelected && (
                <div className={styles.file_info}>
                  <span className={styles.file_name}>{selectedFileName}</span>
                  <button className={styles.cancel_btn} onClick={resetFile}>
                    <img 
                      src={Close}
                      alt="취소 버튼" 
                      width={10} 
                      height={10} />
                  </button>
                </div>
              )}
            </article>
            <button
              className={styles.send_btn}
              onClick={handleSubmit}
              disabled={isPending || !inputText.trim()}
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