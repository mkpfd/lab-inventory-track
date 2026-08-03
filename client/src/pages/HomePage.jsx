import { Link } from "react-router-dom";

const dashboardByRole = {
  student: "/student",
  labmanager: "/manager",
  depthead: "/depthead",
  admin: "/depthead",
};

function HomePage({ currentUser }) {
  const dashboardLink = currentUser ? dashboardByRole[currentUser.role] || "/" : "/login";

  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">LabTrack</span>
          <h1>Track chemicals, requests, and stock with less friction.</h1>
          <p>
            LabTrack gives students a simple request flow, lab managers a practical inventory console,
            and department heads a clear oversight layer with audit logging.
          </p>
          <div className="hero-actions">
            <Link className="hero-button primary" to={dashboardLink}>
              {currentUser ? "Go to dashboard" : "Login"}
            </Link>
            {!currentUser && (
              <Link className="hero-button secondary" to="/register">
                Register
              </Link>
            )}
          </div>
        </div>

        <div className="hero-highlights">
          <div className="highlight-card">
            <strong>Default admin</strong>
            <span>admin@system.com / admin123</span>
          </div>
          <div className="highlight-card">
            <strong>Bulk upload</strong>
            <span>Lab managers can import chemicals from CSV files.</span>
          </div>
          <div className="highlight-card">
            <strong>Audit trail</strong>
            <span>Key actions are logged for departmental review.</span>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h2>Students</h2>
          <p>Search chemicals, submit order requests, and track what is coming next.</p>
        </article>
        <article className="feature-card">
          <h2>Lab Managers</h2>
          <p>Add inventory manually or upload a CSV to create many chemical records at once.</p>
        </article>
        <article className="feature-card">
          <h2>Department Heads</h2>
          <p>Review inventory, inspect activity logs, and manage users from one place.</p>
        </article>
      </section>
    </div>
  );
}

export default HomePage;
