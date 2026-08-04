const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Chemical = require("../models/Chemical");
const ActivityLog = require("../models/ActivityLog");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// body: { items: [{ chemical, chemicalName, quantity }, ...], neededByDate, reason }
router.post("/", verifyToken, checkRole(["student"]), async (req, res) => {
  try {
    const { items, neededByDate, reason } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Please add at least one chemical to the request" });
    }

    for (const item of items) {
      const chemical = await Chemical.findById(item.chemical);
      if (chemical && chemical.isStockedOut) {
        return res.status(400).json({
          message: `${chemical.name} is currently stocked out and cannot be requested`,
        });
      }
    }

    const newOrder = new Order({ items, neededByDate, reason, requestedBy: req.user.id });
    await newOrder.save();

    const itemsText = items.map((item) => `${item.chemicalName} (x${item.quantity})`).join(", ");
    await ActivityLog.create({
      userName: req.user.name,
      action: `Requested order for: ${itemsText}`,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ message: "Something went wrong creating the order" });
  }
});

router.get("/", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(allOrders);
  } catch (error) {
    console.log("Error getting orders:", error);
    res.status(500).json({ message: "Something went wrong getting orders" });
  }
});

router.get("/myorders", verifyToken, checkRole(["student"]), async (req, res) => {
  try {
    const myOrders = await Order.find({ requestedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(myOrders);
  } catch (error) {
    console.log("Error getting my orders:", error);
    res.status(500).json({ message: "Something went wrong getting your orders" });
  }
});

router.put("/:id", verifyToken, checkRole(["labmanager"]), async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "approved" && order.status !== "approved") {
      for (const item of order.items) {
        const chemical = await Chemical.findById(item.chemical);
        if (chemical) {
          chemical.quantity = Math.max(0, chemical.quantity - item.quantity);
          await chemical.save();
        }
      }
    }

    order.status = status;
    await order.save();

    const itemsText = order.items.map((item) => item.chemicalName).join(", ");
    await ActivityLog.create({
      userName: req.user.name,
      action: `Marked order for ${itemsText} as ${status}`,
    });

    res.status(200).json(order);
  } catch (error) {
    console.log("Error updating order:", error);
    res.status(500).json({ message: "Something went wrong updating the order" });
  }
});

module.exports = router;
