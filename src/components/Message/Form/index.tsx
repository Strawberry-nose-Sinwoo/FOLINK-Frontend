import styles from './style.module.css';
import { useState, useEffect, useRef } from 'react';
import { ArrowUpBlue } from '@/assets';

interface MessageFormProps {
  onSendMessage: (message: string) => void;
  isSubmitting?: boolean;
  isAiTyping?: boolean;
  messagesLength: number;
}

const MessageForm = ({ onSendMessage, isSubmitting = false, isAiTyping = false, messagesLength }: MessageFormProps) => {
  const [message, setMessage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
      textarea.scrollTop = textarea.scrollHeight; 
    }
  }, [message]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim() || isSubmitting || isAiTyping) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event); 
    }
  };

  return (
    <form className={styles.message_form} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={styles.message_input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Add keydown handler
        placeholder="면접 질문에 대한 답을 입력하세요."
        aria-label="메시지 입력"
        disabled={isSubmitting || isAiTyping || messagesLength >= 9}
      />
      <button
        className={styles.send_button}
        type="submit"
        aria-label="메시지 전송"
        disabled={isSubmitting || isAiTyping || !message.trim()}
      >
        <img src={ArrowUpBlue} alt="윗화살" />
      </button>
    </form>
  );
};

export default MessageForm;