import React, { useEffect, useState } from "react";
import { getUserById } from "../../api/user.api";
import { useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "../../components/common/Card";
import { cn } from "../../utils";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserById(id).then(res => setUser(res.data));
  }, [id]);

  if (!user) return (
    <div style={{ padding: "20px" }}>
      <Card variant="default" shadow="md">
        <CardBody>
          <div>Loading...</div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <Card variant="default" shadow="md">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardBody>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserDetails;