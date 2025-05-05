import * as components from "@/allFiles";
import styles from './style.module.css';

import { useMessage } from "@/hooks";

const Chat = () => {
  const { message, currentTypingId, handleSendMessage, handleEndTyping } = useMessage();

  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        
      </nav>
      <section className={styles.main}>
        <components.MessageList
          messages={message}
          currentTypingId={currentTypingId}
          onEndTyping={handleEndTyping}
        />
        <components.MessageForm onSendMessage={handleSendMessage} />
      </section>
    </main>
  );
};

export default Chat;