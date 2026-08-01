const mongoose = require("mongoose");

const chemicalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  casNumber: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  supplier: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  // used to flag low-stock items on the manager dashboard
  minimumStockThreshold: {
    type: Number,
    required: true,
    default: 1,
  },
  isStockedOut: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chemical", chemicalSchema);
