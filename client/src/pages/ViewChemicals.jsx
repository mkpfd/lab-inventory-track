import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

function ViewChemicals() {
  const [chemicals, setChemicals] = useState([]);

  useEffect(() => {
    const loadChemicals = async () => {
      try {
        const response = await api.get("/chemicals", getAuthHeader());
        setChemicals(response.data);
      } catch (error) {
        console.log("Error loading chemicals:", error);
      }
    };

    loadChemicals();
  }, []);

  return (
    <div>
      <h1>All Chemicals (Read Only)</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>CAS Number</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Supplier</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {chemicals.map((chemical) => (
            <tr key={chemical._id}>
              <td>{chemical.name}</td>
              <td>{chemical.casNumber}</td>
              <td>
                {chemical.quantity} {chemical.unit}
              </td>
              <td>{chemical.location}</td>
              <td>{chemical.supplier}</td>
              <td>{new Date(chemical.expiryDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewChemicals;
