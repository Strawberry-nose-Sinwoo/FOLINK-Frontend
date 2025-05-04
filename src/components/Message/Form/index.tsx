import styles from './style.module.css';

import { useState } from 'react';

interface MessageFormProps {
  onSendMessage: (message: string) => void;
  isSubmitting?: boolean; // 제출 중 상태 추가
}

const MessageForm = ({ onSendMessage, isSubmitting = false }: MessageFormProps) => {
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim() || isSubmitting) return; // 빈 메시지 또는 제출 중이면 제출 방지
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form className={styles.message_form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.message_input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="면접 질문에 대한 답을 입력하세요."
        aria-label="메시지 입력"
        disabled={isSubmitting}
      />
      <button
        className={styles.send_button}
        type="submit"
        aria-label="메시지 전송"
        disabled={isSubmitting || !message.trim()}
      >
        답변 하기
      </button>
    </form>
  );
};

export default MessageForm;