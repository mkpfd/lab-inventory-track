// top nav bar - which links show up depends on the logged in user's role
import { Link, useNavigate } from "react-router-dom";

function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  if (!currentUser) {
    return (
      <nav className="navbar">
        <span className="navbar-title">LabTrack</span>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <span className="navbar-title">LabTrack</span>

      <div className="navbar-links">
        {currentUser.role === "student" && (
          <>
            <Link to="/student">Dashboard</Link>
            <Link to="/student/search">Search Chemicals</Link>
            <Link to="/student/order">New Order Request</Link>
          </>
        )}

        {currentUser.role === "labmanager" && (
          <>
            <Link to="/manager">Dashboard</Link>
            <Link to="/manager/chemicals">Manage Chemicals</Link>
            <Link to="/manager/orders">Order Requests</Link>
          </>
        )}

        {currentUser.role === "depthead" && (
          <>
            <Link to="/depthead">Dashboard</Link>
            <Link to="/depthead/chemicals">All Chemicals</Link>
            <Link to="/depthead/activitylog">Activity Log</Link>
            <Link to="/depthead/users">Manage Users</Link>
          </>
        )}

        <span className="navbar-username">Logged in as: {currentUser.name}</span>
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
