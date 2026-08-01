const mongoose = require("mongoose");

// just tracks who did what and when, shown on the dept head's activity log page
const activityLogSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
