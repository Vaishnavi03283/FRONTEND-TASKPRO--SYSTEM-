export default function Loader({ message = "Loading..." }) {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <span>{message}</span>
    </div>
  );
}