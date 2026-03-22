import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
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
      // Call POST /api/v1/auth/register
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

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
    <div className="register-wrapper">
      {/* TOP BAR */}
      <div className="top-bar">
        <h2 className="brand">TaskPro</h2>
        <div className="top-links">
          <span>Documentation</span>
          <span>Support</span>
        </div>
      </div>

      {/* REGISTER CARD */}
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join our task management platform</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>NAME</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>PASSWORD</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>ROLE</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign In</span>
        </p>
        <p className="footer-text">
          <span onClick={() => navigate("/")}>🏠 Go Home</span>
        </p>

        <div className="bottom-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Security</span>
        </div>
      </div>
    </div>
  );
};

export default Register;