import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const dashboardByRole = {
  student: "/student",
  labmanager: "/manager",
  depthead: "/depthead",
  admin: "/depthead",
};

function LoginPage({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);

      navigate(dashboardByRole[user.role]);
    } catch (error) {
      console.log("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong logging in");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <h1>Login</h1>
          <p>Sign in to manage inventory, review orders, or submit requests from one shared dashboard.</p>
          <div className="callout-card">
            <strong>Default admin</strong>
            <span>admin@system.com / admin123</span>
          </div>
        </div>

        <form className="form-box auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
