import { useEffect, useState } from "react";
import api, { getAuthHeader } from "../api";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getExpiryStatus(expiryDateString) {
  const daysUntilExpiry = Math.floor((new Date(expiryDateString) - new Date()) / MS_PER_DAY);

  if (daysUntilExpiry < 0) return "Expired";
  if (daysUntilExpiry <= 30) return "Expiring Soon";
  return "OK";
}

function SearchChemicals() {
  const [searchText, setSearchText] = useState("");
  const [chemicals, setChemicals] = useState([]);

  useEffect(() => {
    loadAllChemicals();
  }, []);

  const loadAllChemicals = async () => {
    try {
      const response = await api.get("/chemicals", getAuthHeader());
      setChemicals(response.data);
    } catch (error) {
      console.log("Error loading chemicals:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmedSearch = searchText.trim();

    if (!trimmedSearch) {
      await loadAllChemicals();
      return;
    }

    try {
      const response = await api.get(
        `/chemicals/search?name=${encodeURIComponent(trimmedSearch)}`,
        getAuthHeader()
      );
      setChemicals(response.data);
    } catch (error) {
      console.log("Error searching chemicals:", error);
    }
  };

  return (
    <div>
      <h1>Search Chemicals</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Type a chemical name and press Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={loadAllChemicals} style={{ marginLeft: "10px" }}>
          Show All
        </button>
      </form>

      {chemicals.length === 0 && <p>No chemicals found.</p>}

      {chemicals.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Expiry Status</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {chemicals.map((chemical) => {
              const status = getExpiryStatus(chemical.expiryDate);
              return (
                <tr key={chemical._id}>
                  <td>{chemical.name}</td>
                  <td>
                    {chemical.quantity} {chemical.unit}
                  </td>
                  <td>{chemical.location}</td>
                  <td className={status !== "OK" ? "warning-text" : ""}>{status}</td>
                  <td className={chemical.isStockedOut ? "warning-text" : ""}>
                    {chemical.isStockedOut ? "Stocked Out" : "Available"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SearchChemicals;
