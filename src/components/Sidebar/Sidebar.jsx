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
          label: "My Tasks",
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
        },
        {
          path: "/admin/users",
          label: "User Management",
          roles: ["ADMIN"]
        },
        {
          path: "/projects",
          label: "Projects",
          roles: ["ADMIN"]
        },
        {
          path: "/tasks",
          label: "Tasks",
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
      <h2 className={styles.logo}>TaskFlow</h2>

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
        
        {/* Profile Link */}
        {user && (
          <Link
            to="/auth/me"
            className={`${styles.navLink} ${isActiveLink('/auth/me') ? styles.active : ""}`}
          >
            Profile
          </Link>
        )}
      </div>
    </nav>
  );
}
