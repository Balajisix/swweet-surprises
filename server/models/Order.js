const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Product model
        ref: "Product",
      },
      title: String, // You can keep this if you want to save the title at order creation time
      image: String, // Optional: You can still save image as a static copy
      price: String, // Optional: Keep price if you don't want to recalculate from the product
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

module.exports = mongoose.model("Order", OrderSchema);
