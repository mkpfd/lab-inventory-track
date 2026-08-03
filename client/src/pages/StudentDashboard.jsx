import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

// no "practicals" model on the backend, just hardcoding the lab schedule here for now
const staticPracticals = [
  { title: "Titration Lab", date: "2026-08-01" },
  { title: "Organic Synthesis Lab", date: "2026-08-08" },
  { title: "Spectroscopy Lab", date: "2026-08-15" },
];

function StudentDashboard({ currentUser }) {
  const [upcomingItems, setUpcomingItems] = useState([]);

  useEffect(() => {
    loadUpcomingItems();
  }, []);

  const loadUpcomingItems = async () => {
    const combinedList = staticPracticals.map((p) => ({
      type: "Practical",
      title: p.title,
      date: p.date,
    }));

    try {
      const response = await api.get("/orders/myorders", getAuthHeader());

      for (const order of response.data) {
        // e.g. "Acetone x50, Ethanol x10"
        const itemsText = order.items
          .map((item) => `${item.chemicalName} x${item.quantity}`)
          .join(", ");

        combinedList.push({
          type: `Chemical Order (${order.status})`,
          title: itemsText,
          date: order.neededByDate,
        });
      }
    } catch (error) {
      console.log("Error loading my orders:", error);
    }

    combinedList.sort((a, b) => new Date(a.date) - new Date(b.date));
    setUpcomingItems(combinedList);
  };

  return (
    <div>
      <h1>Welcome, {currentUser ? currentUser.name : "Student"}!</h1>
      <p>This is your student dashboard. Use the links above to search chemicals or submit an order request.</p>

      <h2>Upcoming Practicals</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Title / Items</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {upcomingItems.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.title}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;
