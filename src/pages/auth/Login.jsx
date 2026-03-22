import React, { useState } from "react";
import { login } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Inline styles
  const styles = {
    login: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: spacing.md,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    logoText: {
      fontSize: typography['2xl'],
      fontWeight: typography.bold,
      color: colors.primary,
      letterSpacing: '-0.5px',
    },
    loginContainer: {
      display: 'flex',
      maxWidth: '900px',
      width: '100%',
      background: colors.bgPrimary,
      borderRadius: borderRadius.lg,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      minHeight: '500px',
      maxHeight: '600px',
      position: 'relative',
      zIndex: 1,
    },
    loginSection: {
      flex: '1.2',
      padding: spacing['2xl'],
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    loginHeader: {
      marginBottom: spacing.xl,
    },
    loginHeaderH1: {
      color: colors.gray900,
      fontSize: typography['2xl'],
      fontWeight: typography.bold,
      margin: '0 0 ' + spacing.sm + ' 0',
      lineHeight: '1.2',
    },
    loginHeaderP: {
      color: colors.gray600,
      fontSize: typography.sm,
      lineHeight: '1.5',
      margin: '0',
    },
    form: {
      maxWidth: '600px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.md,
    },
    errorMessage: {
      color: colors.danger,
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
      fontSize: typography.sm,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
    },
    formGroup: {
      marginBottom: spacing.lg,
    },
    label: {
      display: 'block',
      fontSize: typography.xs,
      fontWeight: typography.semibold,
      color: colors.gray700,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    inputWrapper: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: spacing.sm,
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.gray400,
      fontSize: typography.base,
      pointerEvents: 'none',
      zIndex: 1,
    },
    input: {
      width: '100%',
      padding: spacing.sm + ' ' + spacing.sm + ' ' + spacing.sm + ' ' + spacing['8'],
      border: '2px solid ' + colors.gray200,
      borderRadius: borderRadius.md,
      fontSize: typography.sm,
      background: colors.gray50,
      transition: transitions.base,
    },
    inputFocus: {
      outline: 'none',
      borderColor: colors.primary,
      background: colors.bgPrimary,
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    togglePassword: {
      position: 'absolute',
      right: spacing.sm,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: colors.gray400,
      cursor: 'pointer',
      padding: spacing.xs,
      borderRadius: borderRadius.sm,
      transition: transitions.fast,
      fontSize: typography.sm,
    },
    togglePasswordHover: {
      color: colors.primary,
      background: 'rgba(59, 130, 246, 0.1)',
    },
    forgotPassword: {
      textAlign: 'right',
      marginBottom: spacing.lg,
    },
    forgotPasswordLink: {
      color: colors.primary,
      textDecoration: 'none',
      fontSize: typography.xs,
      fontWeight: typography.medium,
    },
    loginButton: {
      width: '100%',
      padding: spacing.sm + ' ' + spacing.md,
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: colors.bgPrimary,
      border: 'none',
      borderRadius: borderRadius.md,
      fontSize: typography.sm,
      fontWeight: typography.semibold,
      cursor: 'pointer',
      transition: transitions.base,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      position: 'relative',
      overflow: 'hidden',
    },
    loginButtonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    arrowIcon: {
      fontSize: typography.base,
      transition: transitions.fast,
    },
    footer: {
      marginTop: 'auto',
      paddingTop: spacing.lg,
      textAlign: 'center',
    },
    footerP: {
      color: colors.gray500,
      fontSize: typography.xs,
      margin: '0 0 ' + spacing.sm + ' 0',
    },
    footerLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
    },
    footerLink: {
      color: colors.gray600,
      fontSize: typography.xs,
      textDecoration: 'none',
      transition: transitions.base,
    },
    separator: {
      color: colors.gray400,
    },
    homeLink: {
      background: colors.primary,
      color: colors.bgPrimary,
      border: 'none',
      padding: spacing.xs + ' ' + spacing.sm,
      borderRadius: borderRadius.sm,
      fontSize: typography.xs,
      cursor: 'pointer',
      transition: transitions.base,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
    },
    homeLinkHover: {
      background: colors.primaryHover,
      transform: 'translateY(-1px)',
    },
    illustrationSection: {
      flex: '0.8',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      padding: spacing.xl,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    illustrationCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxWidth: '220px',
      position: 'relative',
      zIndex: 1,
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    cardTitle: {
      fontSize: typography.sm,
      fontWeight: typography.semibold,
      color: colors.gray900,
    },
    cardBadge: {
      background: colors.primary,
      color: colors.bgPrimary,
      padding: spacing.xs + ' ' + spacing.sm,
      borderRadius: borderRadius.sm,
      fontSize: typography.xs,
      fontWeight: typography.semibold,
    },
    cardContent: {},
    metric: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    metricLabel: {
      color: colors.gray600,
      fontSize: typography.xs,
      fontWeight: typography.medium,
    },
    metricValue: {
      color: colors.success,
      fontSize: typography.lg,
      fontWeight: typography.bold,
    },
    progressIndicator: {
      height: '6px',
      background: colors.gray200,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      width: '75%',
      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
      borderRadius: borderRadius.xl,
    },
    illustrationContent: {
      textAlign: 'center',
      color: colors.bgPrimary,
      position: 'relative',
      zIndex: 1,
      maxWidth: '280px',
    },
    illustrationContentH2: {
      fontSize: typography.lg,
      fontWeight: typography.bold,
      margin: '0 0 ' + spacing.sm + ' 0',
      lineHeight: '1.2',
    },
    illustrationContentP: {
      fontSize: typography.xs,
      lineHeight: '1.4',
      margin: '0',
      opacity: '0.9',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      
      // Handle response - API returns res.data.data with token and user
      if (res && res.token) {
        localStorage.setItem("token", res.token);
      }
      
      if (res && res.user) {
        dispatch({ type: "SET_USER", payload: res.user });

        switch (res.user.role) {
          case "USER":
            navigate("/dashboard/user");
            break;
          case "MANAGER":
            navigate("/dashboard/manager");
            break;
          case "ADMIN":
            navigate("/dashboard/admin");
            break;
          default:
            navigate("/login");
        }
      } else {
        setError("Invalid response format from server - missing user data");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password"
      );
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes progressAnimation {
            from { width: 0; }
            to { width: 75%; }
          }
        `}
      </style>
      <div style={styles.login}>
        <div style={styles.logo}>
          <span style={styles.logoText}>TaskPro</span>
        </div>
        
        <div style={styles.loginContainer}>
          {/* Left Section - Login Form */}
          <div style={styles.loginSection}>
            <div style={styles.loginHeader}>
              <h1 style={styles.loginHeaderH1}>Welcome Back</h1>
              <p style={styles.loginHeaderP}>Sign in to your account to continue managing your tasks and projects efficiently.</p>
            </div>

            <form style={styles.form} onSubmit={handleSubmit}>
              {error && <div style={styles.errorMessage}>⚠️ {error}</div>}

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>WORK EMAIL</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>PASSWORD</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <button
                    type="button"
                    style={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div style={styles.forgotPassword}>
                <a href="/forgot-password" style={styles.forgotPasswordLink}>Forgot password?</a>
              </div>

              <button type="submit" style={styles.loginButton}>
                Login to TaskPro
                <span style={styles.arrowIcon}>→</span>
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerP}>© 2024 TaskPro. All rights reserved.</p>
              <div style={styles.footerLinks}>
                <a href="/security" style={styles.footerLink}>Security Policy</a>
                <span style={styles.separator}>•</span>
                <a href="/terms" style={styles.footerLink}>Terms of Service</a>
                <span style={styles.separator}>•</span>
                <button 
                  type="button" 
                  style={styles.homeLink}
                  onClick={() => navigate("/")}
                  title="Go to Home"
                >
                  🏠 Go Home
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Illustration */}
          <div style={styles.illustrationSection}>
            <div style={styles.illustrationCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Quarterly Review</span>
                <span style={styles.cardBadge}>Q4 2024</span>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.metric}>
                  <span style={styles.metricLabel}>Efficiency</span>
                  <span style={styles.metricValue}>+14.2%</span>
                </div>
                <div style={styles.progressIndicator}>
                  <div style={{...styles.progressBar, animation: 'progressAnimation 2s ease-in-out'}}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.illustrationContent}>
              <h2 style={styles.illustrationContentH2}>Enterprise Intelligence</h2>
              <p style={styles.illustrationContentP}>
                TaskPro empowers teams with intelligent task management, real-time collaboration, 
                and data-driven insights to accelerate productivity and achieve exceptional results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;