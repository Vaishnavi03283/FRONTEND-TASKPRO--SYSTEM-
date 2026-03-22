import { useState, useEffect } from "react";
import {
  getComments,
  addComment,
  deleteComment,
} from "../../api/comment.api";

export default function CommentsSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const res = await getComments(taskId);
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAdd = async () => {
    await addComment(taskId, { text });
    setText("");
    fetchComments();
  };

  return (
    <div>
      <h3>Comments</h3>

      {comments.map((c) => (
        <div key={c.id}>
          <p>{c.text}</p>
          <button onClick={() => deleteComment(c.id)}>
            Delete
          </button>
        </div>
      ))}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}