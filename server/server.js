require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/db");

const authRoutes = require("./routes/authRoutes");
// const chemicalRoutes = require("./routes/chemicalRoutes");
// const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDatabase();

// route mounting
app.use("/api/auth", authRoutes);
// app.use("/api/chemicals", chemicalRoutes);
// app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activitylogs", activityLogRoutes);

app.get("/", (req, res) => {
  res.send("LabTrack server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
