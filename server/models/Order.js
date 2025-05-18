const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  cartId: String,
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        index: true,
      },
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
}, { timestamps: true });

OrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);
