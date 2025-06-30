import styles from './style.module.css'

import { Link } from 'react-router-dom';

export const Error = ({ errorCode }: { errorCode: number }) => {
  let title = '';
  let message = '';

  switch (errorCode) {
    case 404:
      title = '404 - 페이지를 찾을 수 없어요';
      message = '존재하지 않는 경로를 요청하셨어요.';
      break;
    case 500:
      title = '500 - 서버 에러';
      message = '문제가 발생했어요. 잠시 후 다시 시도해주세요.';
      break;
    case 403:
      title = '403 - 접근 금지';
      message = '이 페이지에 접근할 수 없어요.';
      break;
    default:
      title = `${errorCode} 에러`;
      message = '알 수 없는 오류가 발생했어요.';
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.code}>{title}</h1>
      <p className={styles.message}>{message}</p>
      <Link to="/" className={styles.homeButton}>홈으로 돌아가기</Link>
    </div>
  );
};