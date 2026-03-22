import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ChangePassword from "../pages/Auth/ChangePassword";
import Unauthorized from "../pages/Unauthorized";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import ManagerDashboard from "../pages/Dashboard/ManagerDashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import AdminProjects from "../pages/Admin/AdminProjects";
import AdminTasks from "../pages/Admin/AdminTasks";
import AdminUsers from "../pages/Admin/AdminUsers";
import ProjectsList from "../pages/Projects/ProjectsList";
import CreateProject from "../pages/Projects/CreateProject";
import ProjectDetails from "../pages/Projects/ProjectDetails";
import ManageMembers from "../pages/Projects/ManageMembers";
import TasksList from "../pages/tasks/TaskList";
import ManagerTasks from "../pages/Tasks/ManagerTasks";
import TasksWrapper from "../pages/Tasks/TasksWrapper";
import TaskDetails from "../pages/Tasks/TaskDetails";
import CreateTask from "../pages/Tasks/CreateTask";
import UpdateTask from "../pages/Tasks/UpdateTask";
import ProjectTasks from "../pages/Tasks/ProjectTasks";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import Layout from "../components/Layout/Layout";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ DEFAULT ROUTE - Home Page */}
      <Route path="/" element={<Home />} />
      
      {/* ✅ AUTH PAGES (No Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* ✅ PROTECTED ROUTES WITH LAYOUT */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        
        {/* USER ROUTES */}
        <Route path="dashboard/user" element={
          <RoleRoute role="USER">
            <UserDashboard />
          </RoleRoute>
        } />
        
        {/* MANAGER ROUTES */}
        <Route path="dashboard/manager" element={
          <RoleRoute role="MANAGER">
            <ManagerDashboard />
          </RoleRoute>
        } />
        
        {/* PROJECT ROUTES */}
        <Route path="projects" element={
          <RoleRoute roles={["MANAGER", "ADMIN"]}>
            <ProjectsList />
          </RoleRoute>
        } />
        
        <Route path="projects/create" element={
          <RoleRoute roles={["MANAGER", "ADMIN"]}>
            <CreateProject />
          </RoleRoute>
        } />
        
        <Route path="projects/:id" element={
          <RoleRoute roles={["MANAGER", "ADMIN"]}>
            <ProjectDetails />
          </RoleRoute>
        } />
        
        <Route path="projects/:id/members" element={
          <RoleRoute roles={["MANAGER", "ADMIN"]}>
            <ManageMembers />
          </RoleRoute>
        } />
        
        {/* TASKS ROUTES */}
        <Route path="tasks" element={
          <RoleRoute roles={["USER", "MANAGER", "ADMIN"]}>
            <TasksWrapper />
          </RoleRoute>
        } />
        
        <Route path="tasks/create" element={
          <RoleRoute roles={["MANAGER", "ADMIN"]}>
            <CreateTask />
          </RoleRoute>
        } />
        
        <Route path="tasks/:id" element={
          <RoleRoute roles={["USER", "MANAGER", "ADMIN"]}>
            <TaskDetails />
          </RoleRoute>
        } />
        
        <Route path="tasks/:id/edit" element={
          <RoleRoute roles={["MANAGER", "ADMIN"]}>
            <UpdateTask />
          </RoleRoute>
        } />
        
        <Route path="projects/:id/tasks" element={
          <RoleRoute roles={["USER", "MANAGER", "ADMIN"]}>
            <ProjectTasks />
          </RoleRoute>
        } />
        
        <Route path="projects/:id/tasks/create" element={
          <RoleRoute roles={["MANAGER", "ADMIN"]}>
            <CreateTask />
          </RoleRoute>
        } />
        
        {/* ADMIN ROUTES */}
        <Route path="dashboard/admin" element={
          <RoleRoute role="ADMIN">
            <AdminDashboard />
          </RoleRoute>
        } />
        
        <Route path="admin/projects" element={
          <RoleRoute role="ADMIN">
            <AdminProjects />
          </RoleRoute>
        } />
        
        <Route path="admin/tasks" element={
          <RoleRoute role="ADMIN">
            <AdminTasks />
          </RoleRoute>
        } />
        
        <Route path="admin/users" element={
          <RoleRoute role="ADMIN">
            <AdminUsers />
          </RoleRoute>
        } />
        
        {/* PROFILE ROUTE */}
        <Route path="auth/me" element={
          <RoleRoute roles={["USER", "MANAGER", "ADMIN"]}>
            <Profile />
          </RoleRoute>
        } />
        
        {/* CHANGE PASSWORD ROUTE */}
        <Route path="auth/change-password" element={
          <RoleRoute roles={["USER", "MANAGER", "ADMIN"]}>
            <ChangePassword />
          </RoleRoute>
        } />
        
      </Route>
      
      {/* ✅ FALLBACK ROUTE */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;