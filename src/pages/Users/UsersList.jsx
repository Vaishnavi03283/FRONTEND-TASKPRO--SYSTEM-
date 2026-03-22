import React from "react";
import { useUser } from "../../hooks/useUser";
import "./UsersList.css";

const UsersList = () => {
  const { users, activeUsers, removeUser, changeRole } = useUser();

  return (
    <div className="users-page">
      <h2>User Management</h2>

      <h3>Active Users</h3>
      <div className="active-users">
        {activeUsers.map((u) => (
          <span key={u.id}>{u.name}</span>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>

              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    changeRole(u.id, e.target.value)
                  }
                >
                  <option>USER</option>
                  <option>MANAGER</option>
                  <option>ADMIN</option>
                </select>
              </td>

              <td>
                <button onClick={() => removeUser(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;