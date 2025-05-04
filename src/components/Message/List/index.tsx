import styles from './style.module.css';

import { TypeAnimation } from 'react-type-animation';
import { MessageType } from '@/types';

interface MessageListProps {
  messages: MessageType[];
  currentTypingId: null | number;
  onEndTyping: (id: number) => void;
}

const MessageList = ({ messages, currentTypingId, onEndTyping }: MessageListProps) => (
  <section className={styles.messages_list}>
    {messages.map((message) =>
      message.isTyping && message.id === currentTypingId ? (
        <TypeAnimation
          key={String(message.id)}
          sequence={[message.text, () => onEndTyping(message.id)]}
          wrapper="div"
          cursor={true}
          className={message.isUser ? styles.user_message : styles.ai_message}
        />
      ) : (
        <div
          key={String(message.id)}
          className={message.isUser ? styles.user_message : styles.ai_message}
        >
          {message.text}
        </div>
      )
    )}
  </section>
);

export default MessageList;