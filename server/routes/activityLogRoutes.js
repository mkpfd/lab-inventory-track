const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

router.get("/", verifyToken, checkRole(["depthead"]), async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.log("Error getting activity logs:", error);
    res.status(500).json({ message: "Something went wrong getting the activity logs" });
  }
});

module.exports = router;
