import React from "react";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "../../components/common/Card";
import { cn } from "../../utils";
import "./UsersList.css";

const UsersList = () => {
  const { users, activeUsers, removeUser, changeRole } = useUser();

  return (
    <div className="users-page">
      <Card variant="default" shadow="md" className="page-header">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
      </Card>

      <Card variant="default" shadow="sm" className="active-users-section">
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="active-users">
            {activeUsers.map((u) => (
              <span key={u.id}>{u.name}</span>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card variant="default" shadow="md" className="users-table-card">
        <CardBody>
          <table className="users-table">
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
                  className="role-select"
                >
                  <option>USER</option>
                  <option>MANAGER</option>
                  <option>ADMIN</option>
                </select>
              </td>

              <td>
                <Button onClick={() => removeUser(u.id)} variant="danger" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default UsersList;