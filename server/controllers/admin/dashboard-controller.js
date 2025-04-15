// backend/controllers/adminController.js
const Order = require("../../models/Order");
const User = require("../../models/User");
const Product = require("../../models/Product");

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const totalSalesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalSales = totalSalesData[0]?.total || 0;

    // For graph: group orders by day (using createdAt)
    const graphData = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate product category data using the Product model's category field.
    // Ensure your Product model has a "category" field.
    const productCategoryData = await Product.aggregate([
      { $unwind: "$cartItems" },
      {
        $lookup: {
          from: "products", // Make sure this matches the name of your Product collection
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalSales: { $sum: "$cartItems.price" }, // Adjust if your order line items differ
        },
      },
      {
        $project: {
          category: "$_id",
          totalSales: 1,
          _id: 0,
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    // Provide placeholder values for growth if needed.
    const salesGrowth = 5;
    const ordersGrowth = 10;
    const usersGrowth = 2;
    const conversionRate = 2.5;
    const conversionGrowth = -1;

    res.status(200).json({
      success: true,
      totalSales,
      totalOrders,
      totalUsers,
      conversionRate,
      salesGrowth,
      ordersGrowth,
      usersGrowth,
      conversionGrowth,
      graphData,
      productCategoryData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching dashboard data" });
  }
};

module.exports = { getAdminDashboardStats };
