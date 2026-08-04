import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

function ReviewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders", getAuthHeader());
      setOrders(response.data);
    } catch (error) {
      console.log("Error loading orders:", error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus }, getAuthHeader());
      loadOrders();
    } catch (error) {
      console.log("Error updating order status:", error);
    }
  };

  return (
    <div>
      <h1>Student Order Requests</h1>

      {orders.length === 0 ? (
        <p>No order requests yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Items Requested</th>
              <th>Needed By</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.requestedBy ? order.requestedBy.name : "Unknown"}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: "18px" }}>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.chemicalName} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{new Date(order.neededByDate).toLocaleDateString()}</td>
                <td>{order.reason}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === "pending" ? (
                    <>
                      <button
                        className="approve-button"
                        onClick={() => handleUpdateStatus(order._id, "approved")}
                      >
                        Approve
                      </button>{" "}
                      <button
                        className="reject-button"
                        onClick={() => handleUpdateStatus(order._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>Already {order.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReviewOrders;
