const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

router.get("/", verifyToken, checkRole(["depthead"]), async (req, res) => {
  try {
    const allUsers = await User.find().select("-password").sort({ name: 1 });
    res.status(200).json(allUsers);
  } catch (error) {
    console.log("Error getting users:", error);
    res.status(500).json({ message: "Something went wrong getting users" });
  }
});

router.post("/", verifyToken, checkRole(["depthead"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    await ActivityLog.create({
      userName: req.user.name,
      action: `Created new user account: ${name} (${role})`,
    });

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ message: "Something went wrong creating the user" });
  }
});

router.put("/:id", verifyToken, checkRole(["depthead"]), async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await ActivityLog.create({
      userName: req.user.name,
      action: `Edited user account: ${updatedUser.name}`,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error editing user:", error);
    res.status(500).json({ message: "Something went wrong editing the user" });
  }
});

router.delete("/:id", verifyToken, checkRole(["depthead"]), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await ActivityLog.create({
      userName: req.user.name,
      action: `Deleted user account: ${deletedUser.name}`,
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).json({ message: "Something went wrong deleting the user" });
  }
});

module.exports = router;