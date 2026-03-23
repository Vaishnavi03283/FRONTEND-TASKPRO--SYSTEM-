import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Call register API
      const response = await register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      // On success, redirect to login
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err);
      
      if (err.response?.status === 400) {
        setError('User already exists or invalid data');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
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
        <div className={styles.registerContainer}>
          <div className={styles.registerForm}>
            <div className={styles.registerHeader}>
              <h1 className={styles.createAccountText}>Create account</h1>
              <p className={styles.subtitle}>Join the ecosystem of elite task management.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.error}>⚠️ {error}</div>}

              <div className={styles.formGroup}>
                <label htmlFor="fullName" className={styles.label}>FULL NAME</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>EMAIL ADDRESS</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>PASSWORD</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="role" className={styles.label}>ORGANIZATION ROLE</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button type="submit" className={styles.registerButton} disabled={loading}>
                {loading ? (
                  <>
                    <span className={styles.loading}></span>
                    Creating Account...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className={styles.registerSection}>
              <p className={styles.registerText}>
                Already have an account? <a href="/login" className={styles.loginLink}>Login</a>
              </p>
              <p className={styles.curatedText}>CURATED ACCESS</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/privacy" className={styles.footerLink}>PRIVACY</a>
          <span className={styles.separator}>•</span>
          <a href="/terms" className={styles.footerLink}>TERMS</a>
          <span className={styles.separator}>•</span>
          <a href="/security" className={styles.footerLink}>SECURITY</a>
        </div>
      </footer>
    </div>
  );
};

export default Register;