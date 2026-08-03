// add/edit/delete chemicals + stock in/out actions, all lab manager only
import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

const emptyForm = {
  name: "",
  casNumber: "",
  quantity: "",
  unit: "",
  location: "",
  supplier: "",
  purchaseDate: "",
  expiryDate: "",
  minimumStockThreshold: "",
};

function ManageChemicals() {
  const [chemicals, setChemicals] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding a new chemical

  useEffect(() => {
    loadChemicals();
  }, []);

  const loadChemicals = async () => {
    try {
      const response = await api.get("/chemicals", getAuthHeader());
      setChemicals(response.data);
    } catch (error) {
      console.log("Error loading chemicals:", error);
    }
  };

  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setFormData({ ...formData, [fieldName]: fieldValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/chemicals/${editingId}`, formData, getAuthHeader());
      } else {
        await api.post("/chemicals", formData, getAuthHeader());
      }

      setFormData(emptyForm);
      setEditingId(null);
      loadChemicals();
    } catch (error) {
      console.log("Error saving chemical:", error);
    }
  };

  const handleEditClick = (chemical) => {
    setEditingId(chemical._id);
    setFormData({
      name: chemical.name,
      casNumber: chemical.casNumber,
      quantity: chemical.quantity,
      unit: chemical.unit,
      location: chemical.location,
      supplier: chemical.supplier,
      // date inputs need YYYY-MM-DD
      purchaseDate: chemical.purchaseDate.substring(0, 10),
      expiryDate: chemical.expiryDate.substring(0, 10),
      minimumStockThreshold: chemical.minimumStockThreshold,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDeleteClick = async (chemicalId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chemical?");
    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/chemicals/${chemicalId}`, getAuthHeader());
      loadChemicals();
    } catch (error) {
      console.log("Error deleting chemical:", error);
    }
  };

  const handleReportStockOut = async (chemicalId) => {
    try {
      await api.put(`/chemicals/${chemicalId}/reportstockout`, {}, getAuthHeader());
      loadChemicals();
    } catch (error) {
      console.log("Error reporting stock out:", error);
    }
  };

  const handleMarkAsStocked = async (chemicalId) => {
    try {
      await api.put(`/chemicals/${chemicalId}/markstocked`, {}, getAuthHeader());
      loadChemicals();
    } catch (error) {
      console.log("Error marking chemical as stocked:", error);
    }
  };

  const handleAddStock = async (chemicalId) => {
    const amountText = window.prompt("How much stock do you want to add?");
    if (!amountText) return;

    const amountToAdd = Number(amountText);
    if (!amountToAdd || amountToAdd <= 0) {
      window.alert("Please enter a valid positive number");
      return;
    }

    try {
      await api.put(`/chemicals/${chemicalId}/addstock`, { amountToAdd }, getAuthHeader());
      loadChemicals();
    } catch (error) {
      console.log("Error adding stock:", error);
    }
  };

  return (
    <div>
      <h1>Manage Chemicals</h1>

      <h2>{editingId ? "Edit Chemical" : "Add New Chemical"}</h2>
      <form className="form-box" onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

        <label>CAS Number</label>
        <input
          type="text"
          name="casNumber"
          value={formData.casNumber}
          onChange={handleInputChange}
          required
        />

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          required
        />

        <label>Unit (e.g. mL, g, bottles)</label>
        <input type="text" name="unit" value={formData.unit} onChange={handleInputChange} required />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />

        <label>Supplier</label>
        <input
          type="text"
          name="supplier"
          value={formData.supplier}
          onChange={handleInputChange}
          required
        />

        <label>Purchase Date</label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleInputChange}
          required
        />

        <label>Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleInputChange}
          required
        />

        <label>Minimum Stock Threshold</label>
        <input
          type="number"
          name="minimumStockThreshold"
          value={formData.minimumStockThreshold}
          onChange={handleInputChange}
          required
        />

        <button type="submit">{editingId ? "Update Chemical" : "Add Chemical"}</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        )}
      </form>

      <h2>All Chemicals</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Expiry Date</th>
            <th>Stock-Out?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chemicals.map((chemical) => (
            <tr key={chemical._id}>
              <td>{chemical.name}</td>
              <td>
                {chemical.quantity} {chemical.unit}
              </td>
              <td>{chemical.location}</td>
              <td>{new Date(chemical.expiryDate).toLocaleDateString()}</td>
              <td>{chemical.isStockedOut ? <span className="warning-text">Yes</span> : "No"}</td>
              <td>
                <button onClick={() => handleEditClick(chemical)}>Edit</button>{" "}
                <button className="danger-button" onClick={() => handleDeleteClick(chemical._id)}>
                  Delete
                </button>{" "}
                <button onClick={() => handleAddStock(chemical._id)}>Add Stock</button>{" "}
                {chemical.isStockedOut ? (
                  <button className="approve-button" onClick={() => handleMarkAsStocked(chemical._id)}>
                    Mark as Stocked
                  </button>
                ) : (
                  <button onClick={() => handleReportStockOut(chemical._id)}>Report Stock-Out</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageChemicals;
