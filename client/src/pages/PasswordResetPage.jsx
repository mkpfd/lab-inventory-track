import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getAuthHeader } from "../api";

function PasswordResetPage({ onPasswordReset }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match");
      return;
    }

    try {
      await api.post(
        "/auth/reset-password",
        { currentPassword, newPassword },
        getAuthHeader()
      );

      setSuccessMessage("Password updated. Please sign in again.");
      onPasswordReset();
      navigate("/login");
    } catch (error) {
      console.log("Error resetting password:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong resetting the password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <h1>Reset Password</h1>
          <p>Update the password for your signed-in account without leaving the app.</p>
        </div>

        <form className="form-box auth-form" onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Update Password</button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default PasswordResetPage;
