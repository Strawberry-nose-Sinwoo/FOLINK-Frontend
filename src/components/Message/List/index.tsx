import styles from './style.module.css';
import { TypeAnimation } from 'react-type-animation';
import { MessageType } from '@/types';
import { ArrowDown, ArrowUp } from '@/assets';
import { useMessageStore } from '@/store';

interface MessageListProps {
  messages: MessageType[];
  currentTypingId: null | number;
  onEndTyping: (id: number) => void;
}

const MessageList = ({
  messages,
  currentTypingId,
  onEndTyping,
}: MessageListProps) => {
  const { evaluatorFeedbackStates, toggleEvaluatorFeedback } = useMessageStore();

  return (
    <section className={styles.messages_list}>
      {messages.map(message => {
        const isEvaluatorFeedbackOpen = evaluatorFeedbackStates.get(message.id) ?? false;

        return (
          <div key={String(message.id)} className={styles.message_container}>
            {message.isTyping && message.id === currentTypingId ? (
              <div
                className={
                  message.isUser ? styles.user_message : styles.ai_message
                }
              >
                <TypeAnimation
                  sequence={[
                    message.userResponse,
                    () => onEndTyping(message.id),
                  ]}
                  wrapper="div"
                  cursor={true}
                  className={styles.message_userResponse}
                  speed={50}
                />
              </div>
            ) : (
              <div
                className={
                  message.isUser ? styles.user_message : styles.ai_message
                }
              >
                <div className={styles.message_userResponse}>
                  {message.userResponse}
                </div>
                {message.evaluatorFeedback && (
                  <div className={styles.inner_thought_wrapper}>
                    <div
                      className={styles.toggle_label}
                      onClick={() => toggleEvaluatorFeedback(message.id)}
                      role="button"
                      aria-label="Toggle evaluator feedback"
                    >
                      면접관의 속마음 펼쳐보기
                      <img
                        src={isEvaluatorFeedbackOpen ? ArrowUp : ArrowDown}
                        alt={isEvaluatorFeedbackOpen ? '접기' : '펼치기'}
                        className={styles.toggle_icon}
                      />
                    </div>
                    {isEvaluatorFeedbackOpen && (
                      <div className={styles.inner_thought}>
                        {message.evaluatorFeedback}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default MessageList;