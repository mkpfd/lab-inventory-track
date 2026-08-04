// top nav bar - which links show up depends on the logged in user's role
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar({ currentUser, onLogout, theme, onToggleTheme }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  if (!currentUser) {
    return (
      <nav className="navbar">
        <Link to="/" className="navbar-title">
          LabTrack
        </Link>
        <button type="button" className="theme-toggle" onClick={onToggleTheme}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        LabTrack
      </Link>

      <div className="navbar-links">
        {currentUser.role === "admin" ? (
          <>
            <NavLink to="/depthead" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Dept Head Dashboard
            </NavLink>
            <NavLink
              to="/depthead/chemicals"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              All Chemicals
            </NavLink>
            <NavLink
              to="/depthead/activitylog"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Activity Log
            </NavLink>
            <NavLink
              to="/depthead/users"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Manage Users
            </NavLink>

            <NavLink
              to="/manager/chemicals"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Manage Chemicals
            </NavLink>
            <NavLink
              to="/manager/orders"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Order Requests
            </NavLink>
          </>
        ) : (
          <>
            {currentUser.role === "student" && (
              <>
                <NavLink to="/student" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Dashboard
                </NavLink>
                <NavLink
                  to="/student/search"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Search Chemicals
                </NavLink>
                <NavLink
                  to="/student/order"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  New Order Request
                </NavLink>
              </>
            )}

            {currentUser.role === "labmanager" && (
              <>
                <NavLink to="/manager" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Dashboard
                </NavLink>
                <NavLink
                  to="/manager/chemicals"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Manage Chemicals
                </NavLink>
                <NavLink
                  to="/manager/orders"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Order Requests
                </NavLink>
              </>
            )}

            {currentUser.role === "depthead" && (
              <>
                <NavLink to="/depthead" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  Dashboard
                </NavLink>
                <NavLink
                  to="/depthead/chemicals"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  All Chemicals
                </NavLink>
                <NavLink
                  to="/depthead/activitylog"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Activity Log
                </NavLink>
                <NavLink
                  to="/depthead/users"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Manage Users
                </NavLink>
              </>
            )}
          </>
        )}

        <Link to="/reset-password" className="navbar-action-link">
          Reset Password
        </Link>
        <button type="button" className="theme-toggle" onClick={onToggleTheme}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <span className="navbar-username">Logged in as: {currentUser.name}</span>
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
