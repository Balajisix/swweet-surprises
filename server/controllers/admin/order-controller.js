const Order = require("../../models/Order");

const getRecentorders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("cartItems.productId", "title price image")
      .populate("userId", "userName email")
      .lean();

    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error fetching recent orders" });
  }
};

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("cartItems.productId", "title price image")
      .populate("userId", "userName email")
      .lean();

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found!" });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("cartItems.productId", "title price description image")
      .populate("userId", "userName email")
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus, orderUpdateDate: new Date() },
      { new: true }
    ).lean(); 
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    res.status(200).json({ success: true, message: "Order status updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getRecentorders,
};
