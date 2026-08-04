import axios from "axios";

// backend runs on port 5000, see server/server.js
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// pass this as the second arg to api.get/post/etc so the token gets attached
// e.g. api.get("/chemicals", getAuthHeader())
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export default api;
