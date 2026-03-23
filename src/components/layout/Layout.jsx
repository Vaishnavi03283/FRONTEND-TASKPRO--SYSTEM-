import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ToastProvider, ToastContainer } from '../common/Toast';
import { cn } from '../../utils';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const roleSpecificItems = {
      USER: [
        { path: '/dashboard/user', label: 'Dashboard', icon: '📊' },
        { path: '/tasks', label: 'Tasks', icon: '📋' }
      ],
      MANAGER: [
        { path: '/dashboard/manager', label: 'Dashboard', icon: '📊' },
        { path: '/projects', label: 'Projects', icon: '📁' }
      ],
      ADMIN: [
        { path: '/dashboard/admin', label: 'Dashboard', icon: '📊' }
      ]
    };

    const items = roleSpecificItems[user?.role] || [];
    
    // Add logout for all roles
    return [
      ...items,
      { path: '/logout', label: 'Logout', icon: '🚪', onClick: handleLogout, isLogout: true }
    ];
  };

  const navItems = getNavItems();
  const isActiveLink = (path) => {
    if (path === '/logout') return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleNavClick = (item) => {
    if (item.isLogout) {
      item.onClick();
    } else {
      navigate(item.path);
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ToastProvider>
      <div className={styles.layoutContainer}>
        <div className={styles.layoutContent}>
          {/* Sidebar */}
          <aside className={cn(styles.layoutSidebar, { [styles.layoutSidebarOpen]: sidebarOpen })}>
            <div className={styles.layoutSidebarHeader}>
              <Link to="/dashboard" className={styles.layoutSidebarLogo}>
                TaskPro
              </Link>
            </div>
            
            <nav className={styles.layoutSidebarNav}>
              {navItems.map((item) => (
                item.isLogout ? (
                  <button
                    key={item.path}
                    onClick={item.onClick}
                    className={cn(styles.layoutSidebarLink, styles.logoutBtn)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(styles.layoutSidebarLink, { [styles.active]: isActiveLink(item.path) })}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              ))}
            </nav>
            
            <div className={styles.layoutSidebarFooter}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{user?.name || 'User'}</div>
                  <div className={styles.userRole}>{user?.role}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className={cn(styles.layoutMain, { [styles.layoutMainSidebarCollapsed]: !sidebarOpen })}>
            {/* Header */}
            <header className={styles.layoutHeader}>
              <div className={styles.layoutHeaderLeft}>
                <button
                  onClick={toggleSidebar}
                  className={styles.layoutMenuToggle}
                  aria-label="Toggle sidebar"
                >
                  ☰
                </button>
                
                <div>
                  <h1 className={styles.layoutHeaderTitle}>
                    {navItems.find(item => item.path !== '/logout' && isActiveLink(item.path))?.label || 'Dashboard'}
                  </h1>
                  {location.pathname !== '/login' && (
                    <p className={styles.layoutHeaderSubtitle}>
                      Welcome back, {user?.name || 'User'}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.layoutHeaderRight}>
                {/* Search Bar */}
                <div className={styles.layoutHeaderSearch}>
                  <svg className={styles.layoutHeaderSearchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.layoutHeaderSearchInput}
                    aria-label="Search"
                  />
                </div>

                {/* Notifications */}
                <button className={styles.layoutHeaderButton} aria-label="Notifications">
                  🔔
                </button>

                {/* Settings */}
                <button className={styles.layoutHeaderButton} aria-label="Settings">
                  ⚙️
                </button>

                {/* User Profile */}
                <div className={styles.layoutHeaderAvatar}>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              </div>
            </header>

            {/* Page Content */}
            <div className={styles.layoutPage}>
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className={styles.mobileOverlay}
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          />
        )}

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </ToastProvider>
  );
};

export default Layout;