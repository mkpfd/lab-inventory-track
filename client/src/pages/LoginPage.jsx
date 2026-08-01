import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const dashboardByRole = {
  student: "/student",
  labmanager: "/manager",
  depthead: "/depthead",
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
    <div>
      <h1>Login</h1>

      <form className="form-box" onSubmit={handleSubmit}>
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

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
