import styles from './style.module.css';
import { useState } from 'react';
import { Toastify } from '@/allFiles';
import { ArrowRight } from '@/assets';
import { useFileUpload } from '@/hooks';
import { postWithToken } from '@/api/auth'; 
import { PostType } from '@/types';
import { useMutation } from '@tanstack/react-query';

const Main = () => {
  const { fileInputRef, isFileSelected, handleClick, handleFileChange, resetFile } = useFileUpload();
  const [inputText, setInputText] = useState(''); 
  const toastId = 'question-generate-toast';

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PostType) => {
      const response = await postWithToken(null, '/question/generate-by-text', data);
      return response;
    },
  })

  const handleSubmit = () => {
    if (isPending || !inputText.trim()) return;
    Toastify({
      type: 'dismiss',
      toastId: toastId,
    })
    
    Toastify({
      type: 'loading',
      message: '면접 질문을 불러오는 중입니다..',
      toastId: toastId
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
              { isFileSelected && (
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