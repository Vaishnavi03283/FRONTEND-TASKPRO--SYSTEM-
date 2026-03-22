import React, { useEffect, useState } from "react";
import { getUserById } from "../../api/user.api";
import { useParams } from "react-router-dom";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserById(id).then(res => setUser(res.data));
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default UserDetails;