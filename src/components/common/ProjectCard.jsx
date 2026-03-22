export default function ProjectCard({ project, onClick }) {
  return (
    <div className={styles.projectCard} onClick={onClick}>
      <div className={styles.cardHeader}>
        <h3>{project.name}</h3>
        <span className={`${styles.statusBadge} ${project.status === 'completed' ? styles.completed : project.status === 'in-progress' ? styles.inProgress : styles.pending}`}>
          {project.status}
        </span>
      </div>
      <div className={styles.cardBody}>
        <p>{project.description}</p>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.priorityBadge}>
          Priority: {project.priority || 'Medium'}
        </span>
        <div className={styles.actionButtons}>
          <button onClick={onClick}>View Details</button>
        </div>
      </div>
    </div>
  );
}