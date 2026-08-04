import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function LabManagerDashboard() {
  const [chemicals, setChemicals] = useState([]);
  const [lowStockChemicals, setLowStockChemicals] = useState([]);
  const [nearExpiryChemicals, setNearExpiryChemicals] = useState([]);

  useEffect(() => {
    loadChemicals();
  }, []);

  const loadChemicals = async () => {
    try {
      const response = await api.get("/chemicals", getAuthHeader());
      const today = new Date();

      setChemicals(response.data);
      setLowStockChemicals(
        response.data.filter((c) => c.quantity <= c.minimumStockThreshold)
      );
      setNearExpiryChemicals(
        response.data.filter((c) => Math.floor((new Date(c.expiryDate) - today) / MS_PER_DAY) <= 30)
      );
    } catch (error) {
      console.log("Error loading chemicals:", error);
    }
  };

  return (
    <div>
      <h1>Lab Manager Dashboard</h1>

      <div className="stats-row">
        <div className="stat-box">
          <h2>{chemicals.length}</h2>
          <p>Total Chemicals</p>
        </div>
        <div className="stat-box">
          <h2>{lowStockChemicals.length}</h2>
          <p>Low Stock Items</p>
        </div>
        <div className="stat-box">
          <h2>{nearExpiryChemicals.length}</h2>
          <p>Near-Expiry Items</p>
        </div>
      </div>

      <h2>Low Stock Items</h2>
      {lowStockChemicals.length === 0 ? (
        <p>No low stock items right now.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Minimum Threshold</th>
            </tr>
          </thead>
          <tbody>
            {lowStockChemicals.map((chemical) => (
              <tr key={chemical._id}>
                <td>{chemical.name}</td>
                <td className="warning-text">
                  {chemical.quantity} {chemical.unit}
                </td>
                <td>{chemical.minimumStockThreshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Near-Expiry Items (within 30 days)</h2>
      {nearExpiryChemicals.length === 0 ? (
        <p>No items expiring soon.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {nearExpiryChemicals.map((chemical) => (
              <tr key={chemical._id}>
                <td>{chemical.name}</td>
                <td className="warning-text">
                  {new Date(chemical.expiryDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LabManagerDashboard;
