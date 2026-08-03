// pick chemicals from a dropdown, build up a list, fill in the rest, then submit
import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

function OrderRequestForm() {
  const [allChemicals, setAllChemicals] = useState([]);

  const [selectedChemicalId, setSelectedChemicalId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");

  const [itemsList, setItemsList] = useState([]);

  const [neededByDate, setNeededByDate] = useState("");
  const [reason, setReason] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadChemicals = async () => {
      try {
        const response = await api.get("/chemicals", getAuthHeader());
        setAllChemicals(response.data);
      } catch (error) {
        console.log("Error loading chemicals: ", error);
      }
    };

    loadChemicals();
  }, []);

  const handleAddItem = () => {
    setErrorMessage("");

    if (!selectedChemicalId) {
      setErrorMessage("Please select a chemical first");
      return;
    }

    if (!selectedQuantity || selectedQuantity <= 0) {
      setErrorMessage("Please enter a quantity greater than 0");
      return;
    }

    if (itemsList.some((item) => item.chemicalId === selectedChemicalId)) {
      setErrorMessage("That chemical is already in your request list");
      return;
    }

    const chosenChemical = allChemicals.find((c) => c._id === selectedChemicalId);

    if (chosenChemical.isStockedOut) {
      setErrorMessage(`${chosenChemical.name} is currently stocked out and cannot be requested`);
      return;
    }

    const newItem = {
      chemicalId: chosenChemical._id,
      chemicalName: chosenChemical.name,
      unit: chosenChemical.unit,
      quantity: selectedQuantity,
    };

    setItemsList([...itemsList, newItem]);
    setSelectedChemicalId("");
    setSelectedQuantity("");
  };

  const handleRemoveItem = (chemicalIdToRemove) => {
    setItemsList(itemsList.filter((item) => item.chemicalId !== chemicalIdToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (itemsList.length === 0) {
      setErrorMessage("Please add at least one chemical to your request");
      return;
    }

    const itemsForRequest = itemsList.map((item) => ({
      chemical: item.chemicalId,
      chemicalName: item.chemicalName,
      quantity: item.quantity,
    }));

    try {
      await api.post("/orders", { items: itemsForRequest, neededByDate, reason }, getAuthHeader());

      setSuccessMessage("Order request submitted! You will see it on your dashboard.");
      setItemsList([]);
      setNeededByDate("");
      setReason("");
    } catch (error) {
      console.log("Error submitting order:", error);
      setErrorMessage("Something went wrong submitting your order request");
    }
  };

  return (
    <div>
      <h1>Submit Chemical Order Request</h1>

      <h2>Step 1: Add Chemicals</h2>
      <div className="form-box">
        <label>Chemical</label>
        <select value={selectedChemicalId} onChange={(e) => setSelectedChemicalId(e.target.value)}>
          <option value="">-- Select a chemical --</option>
          {allChemicals.map((chemical) => (
            <option key={chemical._id} value={chemical._id} disabled={chemical.isStockedOut}>
              {chemical.name}
              {chemical.isStockedOut
                ? " (Stocked Out - cannot request)"
                : ` (available: ${chemical.quantity} ${chemical.unit})`}
            </option>
          ))}
        </select>

        <label>Quantity</label>
        <input
          type="number"
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(e.target.value)}
        />

        <button type="button" onClick={handleAddItem}>
          Add Item to Request
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {itemsList.length > 0 && (
        <>
          <h2>Items in this Request</h2>
          <table>
            <thead>
              <tr>
                <th>Chemical</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((item) => (
                <tr key={item.chemicalId}>
                  <td>{item.chemicalName}</td>
                  <td>
                    {item.quantity} {item.unit}
                  </td>
                  <td>
                    <button className="danger-button" onClick={() => handleRemoveItem(item.chemicalId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Step 2: Request Details</h2>
      <form className="form-box" onSubmit={handleSubmit}>
        <label>Needed By Date</label>
        <input
          type="date"
          value={neededByDate}
          onChange={(e) => setNeededByDate(e.target.value)}
          required
        />

        <label>Reason</label>
        <textarea
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        ></textarea>

        <button type="submit">Submit Request</button>

        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
}

export default OrderRequestForm;
