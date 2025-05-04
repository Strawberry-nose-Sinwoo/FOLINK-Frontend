import * as components from "@/allFiles";
import styles from './style.module.css';

import { useMessage } from "@/hooks";

const Chat = () => {
  const { message, currentTypingId, handleSendMessage, handleEndTyping } = useMessage();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>

      </nav>
      <main className={styles.main}>
      <components.MessageList
        messages={message}
        currentTypingId={currentTypingId}
        onEndTyping={handleEndTyping}
      />
      <components.MessageForm onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default Chat;