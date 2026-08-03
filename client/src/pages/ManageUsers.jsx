import { useState, useEffect } from "react";
import api, { getAuthHeader } from "../api";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "student",
};

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get("/users", getAuthHeader());
      setUsers(response.data);
    } catch (error) {
      console.log("Error loading users:", error);
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
        const { name, email, role } = formData;
        await api.put(`/users/${editingId}`, { name, email, role }, getAuthHeader());
      } else {
        await api.post("/users", formData, getAuthHeader());
      }

      setFormData(emptyForm);
      setEditingId(null);
      loadUsers();
    } catch (error) {
      console.log("Error saving user:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDeleteClick = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`, getAuthHeader());
      loadUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>

      <h2>{editingId ? "Edit User" : "Create New User"}</h2>
      <form className="form-box" onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        {!editingId && (
          <>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </>
        )}

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleInputChange}>
          <option value="student">Student</option>
          <option value="labmanager">Lab Manager</option>
          <option value="depthead">Department Head</option>
        </select>

        <button type="submit">{editingId ? "Update User" : "Create User"}</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        )}
      </form>

      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Edit</button>{" "}
                <button className="danger-button" onClick={() => handleDeleteClick(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;
