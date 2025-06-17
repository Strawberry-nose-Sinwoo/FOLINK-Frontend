import * as components from '@/allFiles';
import styles from './style.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Toastify } from '@/allFiles';
import { ArrowRight, Close } from '@/assets';
import { useFileUpload } from '@/hooks';
import { PostType } from '@/types';
import { useGenerateQuestion } from '@/hooks';

const Main = () => {
  const { fileInputRef, isFileSelected, handleClick, handleFileChange, resetFile, selectedFileName } = useFileUpload();
  const { mutate, isPending } = useGenerateQuestion();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('loading'); 

  const navigation = useNavigate();
  // const toastId = 'question-generate-toast';

  const handleSubmit = () => {
    if (isPending || !inputText.trim()) return;

    // Toastify({
    //   type: 'dismiss',
    //   toastId: toastId,
    // });

    setIsLoading(true);
    setLoadingStatus('loading'); 

    const data: PostType = { userResponse: inputText };
    mutate(data, {
      onSuccess: (response) => {
        // Toastify({
        //   type: 'update',
        //   iconType: 'success',
        //   message: '질문 생성이 완료되었습니다!',
        //   toastId: toastId,
        //   render: 'success',
        // });

        setLoadingStatus('success'); 
        setTimeout(() => {
          // Toastify({ type: 'dismiss', toastId });
          setIsLoading(false); 
          navigation(`/question/${response.data.questionSet.id}`);
        }, 1000);
      },
      onError: (error) => {
        console.error('질문 생성 실패:', error);
        // Toastify({
        //   type: 'update',
        //   iconType: 'error',
        //   message: '질문 생성에 실패했습니다.',
        //   toastId: toastId,
        //   render: 'error',
        // });
        setIsLoading(false); 
      },
    });
  };

  return (
    <>
      {isLoading && <components.Loading status={loadingStatus} />}
      <main className={styles.container}>
        <section className={styles.main}>
          <header className={styles.title_container}>
            <h1>포트폴리오 내용으로 예상 면접 질문을 받아보세요!</h1>
          </header>
          <section className={styles.chat_container}>
            <input
              type="text"
              className={styles.chat_input}
              placeholder="포트폴리오 내용을 입력하세요"
              aria-label="포트폴리오 내용 입력"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isFileSelected || isPending}
            />
            <section className={styles.btn_container}>
              <article className={styles.file_upload_container}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {!isFileSelected && (
                  <button
                    className={styles.pdf_btn}
                    onClick={handleClick}
                    disabled={inputText.trim().length > 0}
                  >
                    + PDF 삽입
                  </button>
                )}
                {isFileSelected && (
                  <div className={styles.file_info}>
                    <span className={styles.file_name}>{selectedFileName}</span>
                    <button className={styles.cancel_btn} onClick={resetFile}>
                      <img src={Close} alt="취소 버튼" width={10} height={10} />
                    </button>
                  </div>
                )}
              </article>
              <button
                className={styles.send_btn}
                onClick={handleSubmit}
                disabled={isPending || (!inputText.trim() && !isFileSelected)}
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
    </>
  );
};

export default Main;