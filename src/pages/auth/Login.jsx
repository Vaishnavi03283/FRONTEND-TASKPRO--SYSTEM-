import React, { useState } from "react";
import { login } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle } from "../../components/common/Card";
import { cn } from "../../utils";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await login({ email, password });
      // Handle response - API returns { token, user } from auth.api.js
      if (res && res?.token) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>TaskPro</span>
        </div>
        <nav className={styles.nav}>
          <a href="/docs" className={styles.navLink}>Documentation</a>
          <a href="/support" className={styles.navLink}>Support</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.loginContainer}>
          <Card variant="primary" shadow="xl" className={styles.loginCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.welcomeText}>Welcome Back</CardTitle>
              <p className={styles.subtitle}>Enter your credentials to access your workspace.</p>
            </CardHeader>
            
            <CardBody className={styles.cardBody}>
              <form className={styles.form} onSubmit={handleSubmit}>
                {error && (
                  <div className={cn(styles.error, styles.errorCard)}>
                    <span className={styles.errorIcon}>⚠️</span>
                    {error}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Work Email</label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(styles.input, { [styles.inputError]: error })}
                      required
                      disabled={loading}
                      aria-label="Email address"
                      aria-describedby={error ? "email-error" : undefined}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(styles.input, { [styles.inputError]: error })}
                      required
                      disabled={loading}
                      aria-label="Password"
                      aria-describedby={error ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.eyeIcon}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.eyeIcon}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    disabled={loading || !email || !password}
                    className={styles.submitButton}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </div>
              </form>
              
              <div className={styles.footer}>
                <p className={styles.footerText}>
                  Don't have an account? <a href="/register" className={styles.link}>Sign up</a>
                </p>
                <a href="/forgot-password" className={styles.link}>Forgot your password?</a>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/privacy" className={styles.footerLink}>PRIVACY POLICY</a>
          <span className={styles.separator}>•</span>
          <a href="/terms" className={styles.footerLink}>TERMS OF SERVICE</a>
          <span className={styles.separator}>•</span>
          <a href="/security" className={styles.footerLink}>SECURITY</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;