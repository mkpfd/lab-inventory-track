// run with: npm run seed
// wipes everything and puts back a fixed set of demo data so the app is in a known state for a demo/grading
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDatabase = require("./config/db");

const User = require("./models/User");
const Chemical = require("./models/Chemical");
const Order = require("./models/Order");
const ActivityLog = require("./models/ActivityLog");

const seedDatabase = async () => {
  await connectDatabase();

  await User.deleteMany({});
  await Chemical.deleteMany({});
  await Order.deleteMany({});
  await ActivityLog.deleteMany({});
  console.log("Cleared old data");

  // all demo users share this password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const demoStudent = await User.create({
    name: "Student",
    email: "student@labtrack.com",
    password: hashedPassword,
    role: "student",
  });

  const demoLabManager = await User.create({
    name: "Labmanager",
    email: "manager@labtrack.com",
    password: hashedPassword,
    role: "labmanager",
  });

  const demoDeptHead = await User.create({
    name: "Depthead",
    email: "depthead@labtrack.com",
    password: hashedPassword,
    role: "depthead",
  });

  await User.create({
    name: "System Admin",
    email: "admin@system.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Created demo users");

  const today = new Date();

  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const twoYearsFromNow = new Date(today);
  twoYearsFromNow.setFullYear(today.getFullYear() + 2);

  const tenDaysFromNow = new Date(today);
  tenDaysFromNow.setDate(today.getDate() + 10);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const createdChemicals = await Chemical.create([
    {
      name: "Acetone",
      casNumber: "67-64-1",
      quantity: 500,
      unit: "mL",
      location: "Cabinet A - Shelf 1",
      supplier: "ChemSupply Co.",
      purchaseDate: oneYearAgo,
      expiryDate: twoYearsFromNow,
      minimumStockThreshold: 100,
      isStockedOut: false,
    },
    {
      name: "Sodium Chloride",
      casNumber: "7647-14-5",
      quantity: 50,
      unit: "g",
      location: "Cabinet B - Shelf 3",
      supplier: "ChemSupply Co.",
      purchaseDate: oneYearAgo,
      expiryDate: twoYearsFromNow,
      minimumStockThreshold: 200, // below quantity on purpose - shows as LOW STOCK
      isStockedOut: false,
    },
    {
      name: "Ethanol",
      casNumber: "64-17-5",
      quantity: 1000,
      unit: "mL",
      location: "Flammables Cabinet",
      supplier: "LabChem Inc.",
      purchaseDate: oneYearAgo,
      expiryDate: tenDaysFromNow, // shows as NEAR-EXPIRY
      minimumStockThreshold: 200,
      isStockedOut: false,
    },
    {
      name: "Hydrochloric Acid",
      casNumber: "7647-01-0",
      quantity: 250,
      unit: "mL",
      location: "Acid Cabinet",
      supplier: "LabChem Inc.",
      purchaseDate: oneYearAgo,
      expiryDate: thirtyDaysAgo, // shows as EXPIRED
      minimumStockThreshold: 50,
      isStockedOut: false,
    },
    {
      name: "Potassium Permanganate",
      casNumber: "7722-64-7",
      quantity: 0,
      unit: "g",
      location: "Cabinet C - Shelf 1",
      supplier: "ChemSupply Co.",
      purchaseDate: oneYearAgo,
      expiryDate: twoYearsFromNow,
      minimumStockThreshold: 20,
      isStockedOut: true,
    },
  ]);

  console.log("Created demo chemicals");

  // references real chemicals from the array above
  await Order.create({
    items: [
      {
        chemical: createdChemicals[0]._id,
        chemicalName: createdChemicals[0].name,
        quantity: 50,
      },
      {
        chemical: createdChemicals[1]._id,
        chemicalName: createdChemicals[1].name,
        quantity: 10,
      },
    ],
    neededByDate: tenDaysFromNow,
    reason: "Needed for titration practical",
    requestedBy: demoStudent._id,
    status: "pending",
  });

  console.log("Created demo order request");

  await ActivityLog.create({
    userName: "System",
    action: "Database was seeded with demo data",
  });

  console.log("\nSeeding complete! You can log in with these accounts (all use password: password123):");
  console.log("  Student:      student@labtrack.com");
  console.log("  Lab Manager:  manager@labtrack.com");
  console.log("  Dept Head:    depthead@labtrack.com");
  console.log("  Admin:        admin@system.com");

  mongoose.connection.close();
};

seedDatabase();
