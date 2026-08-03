require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const connectDatabase = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chemicalRoutes = require("./routes/chemicalRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

const ensureDefaultAdmin = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  await User.findOneAndUpdate(
    { email: "admin@system.com" },
    {
      name: "System Admin",
      email: "admin@system.com",
      password: hashedPassword,
      role: "admin",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Ensured default admin account: admin@system.com");
};

const startServer = async () => {
  try {
    await connectDatabase();
    await ensureDefaultAdmin();

    app.use("/api/auth", authRoutes);
    app.use("/api/chemicals", chemicalRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/activitylogs", activityLogRoutes);

    app.get("/", (req, res) => {
      res.send("LabTrack server is running!");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
