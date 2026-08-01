const mongoose = require("mongoose");

// an order can have several chemicals in it, hence the items array

const orderSchema = new mongoose.Schema({
  items: [
    {
      chemical: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chemical",
        required: true,
      },
      chemicalName: {
        type: String, // saved so it still shows even if the chemical is deleted later
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  neededByDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
