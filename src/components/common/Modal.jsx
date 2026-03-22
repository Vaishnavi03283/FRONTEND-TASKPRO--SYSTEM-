export default function Modal({ children, close }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={close}>×</button>
        {children}
      </div>
    </div>
  );
}