import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const roleSpecificItems = {
      USER: [
        {
          path: "/dashboard/user",
          label: "Dashboard",
          roles: ["USER"]
        },
        {
          path: "/tasks",
          label: "Tasks",
          roles: ["USER"]
        }
      ],
      MANAGER: [
        {
          path: "/dashboard/manager",
          label: "Dashboard",
          roles: ["MANAGER"]
        },
        {
          path: "/projects",
          label: "Projects",
          roles: ["MANAGER"]
        }
      ],
      ADMIN: [
        {
          path: "/dashboard/admin",
          label: "Dashboard",
          roles: ["ADMIN"]
        }
      ]
    };

    const userRole = user?.role;
    return roleSpecificItems[userRole] || [];
  };

  const navigationItems = getNavItems();

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.sidebar}>
      <h2 className={styles.logo}>TaskPro</h2>

      <div className={styles.nav}>
        {navigationItems.map((item) => (
          item.roles.includes(user?.role) && (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActiveLink(item.path) ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          )
        ))}
        
        {/* Logout Link - Always Visible */}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className={`${styles.navLink} ${styles.logoutBtn}`}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
