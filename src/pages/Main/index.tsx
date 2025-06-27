import * as components from '@/allFiles'
import styles from './style.module.css';

import { useNavigate } from 'react-router-dom';
import { useFileUpload } from '@/hooks';
import { PdfUploadTypes } from '@/types';
import { Upload } from '@/assets';
import LastQuestioonModal from '@/components/LastQuestionModal/Index';
import { useEffect } from 'react';

const Main = () => {
  const navigation = useNavigate();
  const historyQuesitonId = localStorage.getItem("question_history")
  const {
    fileInputRef,
    isDragging,
    isUploading,
    handleClick,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileUpload({
    onUploadSuccess: (response: PdfUploadTypes) => {
      navigation(`/question/${response.data.questionSet.id}`);
    },
  });

  useEffect(() => {
    historyQuesitonId
  }, [historyQuesitonId])

  return (
    <main className={styles.container}>
      {isUploading && <components.Loading status="loading" />}
      {
        historyQuesitonId !== null && <LastQuestioonModal />
      }
      <section className={styles.main}>
        <header className={styles.title_container}>
          <h1>
            포트폴리오로 <span>면접</span>을 준비하세요!
          </h1>
        </header>
        <section
          className={`${styles.chat_container} ${isDragging ? styles.dragging : ''
            } ${isUploading ? styles.uploading : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <section className={styles.btn_container}>
            <div className={styles.btn_introduce_container}>
              <span>AI 기반 질문 생성</span>
            </div>
            <img
              src={Upload}
              alt="업로드 이미지"
              className={styles.upload_img}
            />
            <h1>포트폴리오 PDF를 올려주세요!</h1>
            <p>이곳에 파일을 드래그해서 놓거나 클릭하여서 선택해주세요.</p>
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
              disabled={isUploading}
            >
              파일 선택
            </button>
          </section>
        </section>
        <div className={styles.demoButtonContainer}>
          <button className={styles.demoButton} onClick={() => navigation('/demo/all')}>전체 면접 연습</button>
          <button className={styles.demoButton} onClick={() => navigation('/demo/frontend')}>프론트엔드 면접 연습</button>
          <button className={styles.demoButton} onClick={() => navigation('/demo/backend')}>백엔드 면접 연습</button>
        </div>
      </section>
    </main>
  );
};

export default Main;