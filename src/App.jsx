import './styles/design-tokens.css';
import './styles/global.css';
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { TaskProvider } from "./context/TaskContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ProjectProvider>
          <TaskProvider>
            <AppRoutes />
          </TaskProvider>
        </ProjectProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;