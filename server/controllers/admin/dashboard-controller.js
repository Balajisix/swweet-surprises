const Order = require("../../models/Order");
const User = require("../../models/User");

const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalSalesData,
      graphData,
      productCategoryData
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $unwind: "$cartItems" },
        {
          $lookup: {
            from: "products",
            localField: "cartItems.productId",
            foreignField: "_id",
            as: "productInfo"
          }
        },
        { $unwind: "$productInfo" },
        {
          $group: {
            _id: "$productInfo.category",
            totalSales: {
              $sum: {
                $multiply: [
                  { $toDouble: "$cartItems.price" },
                  "$cartItems.quantity"
                ]
              }
            }
          }
        },
        {
          $project: {
            category: "$_id",
            totalSales: 1,
            _id: 0
          }
        },
        { $sort: { totalSales: -1 } }
      ])
    ]);

    const totalSales = totalSalesData[0]?.total || 0;

    res.status(200).json({
      success: true,
      totalSales,
      totalOrders,
      totalUsers,
      conversionRate: 2.5,
      salesGrowth: 5,
      ordersGrowth: 10,
      usersGrowth: 2,
      conversionGrowth: -1,
      graphData,
      productCategoryData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data"
    });
  }
};

module.exports = { getAdminDashboardStats };
