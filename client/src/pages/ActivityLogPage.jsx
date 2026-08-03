import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

function ActivityLogPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await api.get("/activitylogs", getAuthHeader());
        setLogs(response.data);
      } catch (error) {
        console.log("Error loading activity logs:", error);
      }
    };

    loadLogs();
  }, []);

  return (
    <div>
      <h1>Activity Log</h1>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.userName}</td>
              <td>{log.action}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityLogPage;
