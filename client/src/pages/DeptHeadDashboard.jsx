import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

function DeptHeadDashboard() {
  const [totalCount, setTotalCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get("/chemicals", getAuthHeader());
      const allChemicals = response.data;
      const today = new Date();

      setTotalCount(allChemicals.length);
      setLowStockCount(allChemicals.filter((c) => c.quantity <= c.minimumStockThreshold).length);
      setExpiredCount(allChemicals.filter((c) => new Date(c.expiryDate) < today).length);
    } catch (error) {
      console.log("Error loading dashboard stats:", error);
    }
  };

  return (
    <div>
      <h1>Department Head Dashboard</h1>

      <div className="stats-row">
        <div className="stat-box">
          <h2>{totalCount}</h2>
          <p>Total Chemicals</p>
        </div>
        <div className="stat-box">
          <h2>{lowStockCount}</h2>
          <p>Low Stock</p>
        </div>
        <div className="stat-box">
          <h2>{expiredCount}</h2>
          <p>Expired</p>
        </div>
      </div>
    </div>
  );
}

export default DeptHeadDashboard;
