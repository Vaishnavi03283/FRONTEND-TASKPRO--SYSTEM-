import { updateStatus } from "../../api/task.api";
import "./TaskCard.css";

export default function TaskCard({ task, refresh }) {
  const handleChange = async (e) => {
    await updateStatus(task.id, { status: e.target.value });
    refresh();
  };

  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>{task.priority}</p>

      <select value={task.status} onChange={handleChange}>
        <option>PENDING</option>
        <option>IN_PROGRESS</option>
        <option>COMPLETED</option>
      </select>
    </div>
  );
}