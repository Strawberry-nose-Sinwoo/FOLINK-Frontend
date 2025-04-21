import styles from './style.module.css';

import { Toastify } from '@/allFiles';
import { useRef, useState } from 'react';
import { ArrowRight } from '@/assets';

export default function Main() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      Toastify({
        type: 'error',
        message: '파일 입력 요소를 찾을 수 없습니다.',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsFileSelected(true);
      Toastify({
        type: 'success',
        message: `${file.name} 파일이 선택되었습니다.`,
      });
    } else {
      setIsFileSelected(false);
      Toastify({
        type: 'error',
        message: '파일을 선택하지 않았습니다.',
      });
    }
  };

  const resetFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setIsFileSelected(false);
      Toastify({
        type: 'success',
        message: '파일 선택이 초기화되었습니다.',
      });
    }
  };

  const toastOnClick = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    Toastify({
      type: 'loading',
      message: '면접 질문을 불러오는 중입니다...',
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
