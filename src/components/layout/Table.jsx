import "./Table.css";

export default function Table({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>

      <tbody>
        {data.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}