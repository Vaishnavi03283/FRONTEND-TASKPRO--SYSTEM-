import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1>TaskFlow</h1>
      </div>
      
      <div className={styles.headerRight}>
        <div className={styles.userInfo}>
          <Link to="/auth/me" className={styles.userNameLink}>
            <span className={styles.welcomeText}>Welcome, {user?.name || "User"}</span>
          </Link>
          <span className={styles.userRole}>{user?.role}</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
}