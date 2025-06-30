import styles from './style.module.css';

const Skeleton = () => {
  const messageCount = Math.floor(Math.random() * 3) + 1;
  const randomWidth = () => Math.floor(Math.random() * 400 + 100);

  return (
    <div className={styles.chat_container}>
      <div className={styles.message_list}>
        {Array.from({ length: Math.max(messageCount) }).map((_, index) => (
          <div
            key={`skeleton-message-${index}`}
            className={styles.message_container}
          >
            <div className={styles.ai_message}>
              <div
                className={styles.skeleton_item}
                style={{ width: `${randomWidth()}px`, height: '14.5px' }}
              />
            </div>
            <div className={styles.user_message}>
              <div
                className={styles.skeleton_item}
                style={{ width: `${randomWidth()}px`, height: '15px' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;