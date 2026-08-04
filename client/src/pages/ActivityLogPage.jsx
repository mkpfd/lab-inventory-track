import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

function ActivityLogPage() {
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const loadActivityLogs = async () => {
      try {
        const response = await api.get("/activitylogs", getAuthHeader());
        setActivityLogs(response.data);
      } catch (error) {
        console.log("Error loading activity logs:", error);
      }
    };

    loadActivityLogs();
  }, []);

  return (
    <div>
      <h1>Activity Log</h1>

      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {activityLogs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.userName}</td>
              <td>{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityLogPage;
