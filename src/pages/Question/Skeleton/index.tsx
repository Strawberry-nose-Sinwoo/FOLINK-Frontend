import styles from './style.module.css';

const Skeleton = () => {
  const messageCount = 5;

  const randomPadding = () => `${Math.floor(Math.random() * 40 + 22)}px`;

  return (
    <>
      {Array.from({ length: messageCount }).map((_, index) => (
        <div
          className={styles.list_container_3}
          key={`skeleton-message-${index}`}
          style={{
            width: '100%',
            padding: randomPadding(),
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;