const express = require("express");
const router = express.Router();
const Chemical = require("../models/Chemical");
const ActivityLog = require("../models/ActivityLog");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

router.get("/", verifyToken, async (req, res) => {
  try {
    const allChemicals = await Chemical.find().sort({ name: 1 });
    res.status(200).json(allChemicals);
  } catch (error) {
    console.log("Error getting chemicals:", error);
    res.status(500).json({ message: "Something went wrong getting chemicals" });
  }
});

// e.g. /api/chemicals/search?name=acetone
router.get("/search", verifyToken, async (req, res) => {
  try {
    const searchName = req.query.name;
    if (!searchName) {
      return res.status(400).json({ message: "Please provide a name to search for" });
    }

    const results = await Chemical.find({
      name: { $regex: searchName, $options: "i" },
    });

    res.status(200).json(results);
  } catch (error) {
    console.log("Error searching chemicals:", error);
    res.status(500).json({ message: "Something went wrong searching chemicals" });
  }
});

router.post("/", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const {
      name,
      casNumber,
      quantity,
      unit,
      location,
      supplier,
      purchaseDate,
      expiryDate,
      minimumStockThreshold,
    } = req.body;

    const newChemical = new Chemical({
      name,
      casNumber,
      quantity,
      unit,
      location,
      supplier,
      purchaseDate,
      expiryDate,
      minimumStockThreshold,
    });
    await newChemical.save();

    await ActivityLog.create({
      userName: req.user.name,
      action: `Added new chemical: ${name}`,
    });

    res.status(201).json(newChemical);
  } catch (error) {
    console.log("Error adding chemical:", error);
    res.status(500).json({ message: "Something went wrong adding the chemical" });
  }
});

router.post("/bulk", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const { chemicals } = req.body;

    if (!Array.isArray(chemicals) || chemicals.length === 0) {
      return res.status(400).json({ message: "Please provide at least one chemical row" });
    }

    const validationErrors = [];
    const normalizedChemicals = chemicals.map((chemical, index) => {
      const rowNumber = index + 2;
      const normalized = {
        name: String(chemical.name || "").trim(),
        casNumber: String(chemical.casNumber || "").trim(),
        quantity: Number(chemical.quantity),
        unit: String(chemical.unit || "").trim(),
        location: String(chemical.location || "").trim(),
        supplier: String(chemical.supplier || "").trim(),
        purchaseDate: new Date(chemical.purchaseDate),
        expiryDate: new Date(chemical.expiryDate),
        minimumStockThreshold: Number(chemical.minimumStockThreshold),
        isStockedOut: chemical.isStockedOut === true || chemical.isStockedOut === "true",
      };

      if (!normalized.name) validationErrors.push(`Row ${rowNumber}: name is required`);
      if (!normalized.casNumber) validationErrors.push(`Row ${rowNumber}: casNumber is required`);
      if (!Number.isFinite(normalized.quantity)) validationErrors.push(`Row ${rowNumber}: quantity must be a number`);
      if (!normalized.unit) validationErrors.push(`Row ${rowNumber}: unit is required`);
      if (!normalized.location) validationErrors.push(`Row ${rowNumber}: location is required`);
      if (!normalized.supplier) validationErrors.push(`Row ${rowNumber}: supplier is required`);
      if (Number.isNaN(normalized.purchaseDate.getTime())) validationErrors.push(`Row ${rowNumber}: purchaseDate must be a valid date`);
      if (Number.isNaN(normalized.expiryDate.getTime())) validationErrors.push(`Row ${rowNumber}: expiryDate must be a valid date`);
      if (!Number.isFinite(normalized.minimumStockThreshold)) {
        validationErrors.push(`Row ${rowNumber}: minimumStockThreshold must be a number`);
      }

      return normalized;
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: "CSV data has errors", errors: validationErrors });
    }

    const createdChemicals = await Chemical.insertMany(normalizedChemicals);

    await ActivityLog.create({
      userName: req.user.name,
      action: `Imported ${createdChemicals.length} chemicals from CSV`,
    });

    res.status(201).json({
      message: `Imported ${createdChemicals.length} chemicals successfully`,
      count: createdChemicals.length,
      chemicals: createdChemicals,
    });
  } catch (error) {
    console.log("Error importing chemicals in bulk:", error);
    res.status(500).json({ message: "Something went wrong importing the CSV" });
  }
});

router.put("/:id", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const updatedChemical = await Chemical.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedChemical) {
      return res.status(404).json({ message: "Chemical not found" });
    }

    await ActivityLog.create({
      userName: req.user.name,
      action: `Edited chemical: ${updatedChemical.name}`,
    });

    res.status(200).json(updatedChemical);
  } catch (error) {
    console.log("Error editing chemical:", error);
    res.status(500).json({ message: "Something went wrong editing the chemical" });
  }
});

router.delete("/:id", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const deletedChemical = await Chemical.findByIdAndDelete(req.params.id);
    if (!deletedChemical) {
      return res.status(404).json({ message: "Chemical not found" });
    }

    await ActivityLog.create({
      userName: req.user.name,
      action: `Deleted chemical: ${deletedChemical.name}`,
    });

    res.status(200).json({ message: "Chemical deleted successfully" });
  } catch (error) {
    console.log("Error deleting chemical:", error);
    res.status(500).json({ message: "Something went wrong deleting the chemical" });
  }
});

// just flips the stocked-out flag, doesn't touch quantity
router.put("/:id/reportstockout", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ message: "Chemical not found" });
    }

    chemical.isStockedOut = true;
    await chemical.save();

    await ActivityLog.create({
      userName: req.user.name,
      action: `Reported stock-out for chemical: ${chemical.name}`,
    });

    res.status(200).json(chemical);
  } catch (error) {
    console.log("Error reporting stock out:", error);
    res.status(500).json({ message: "Something went wrong reporting stock out" });
  }
});

router.put("/:id/markstocked", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ message: "Chemical not found" });
    }

    chemical.isStockedOut = false;
    await chemical.save();

    await ActivityLog.create({
      userName: req.user.name,
      action: `Marked chemical as stocked (back in stock): ${chemical.name}`,
    });

    res.status(200).json(chemical);
  } catch (error) {
    console.log("Error marking chemical as stocked:", error);
    res.status(500).json({ message: "Something went wrong marking the chemical as stocked" });
  }
});

router.put("/:id/addstock", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const amountToAdd = Number(req.body.amountToAdd);
    if (!amountToAdd || amountToAdd <= 0) {
      return res.status(400).json({ message: "Please provide a valid amount to add" });
    }

    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ message: "Chemical not found" });
    }

    chemical.quantity += amountToAdd;
    await chemical.save();

    await ActivityLog.create({
      userName: req.user.name,
      action: `Added stock for ${chemical.name}: +${amountToAdd} ${chemical.unit}`,
    });

    res.status(200).json(chemical);
  } catch (error) {
    console.log("Error adding stock:", error);
    res.status(500).json({ message: "Something went wrong adding stock" });
  }
});

module.exports = router;
