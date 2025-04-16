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

    const productCategoryData = await Product.aggregate([
      { $unwind: "$cartItems" },
  
  // Lookup product details from the "products" collection
  {
    $lookup: {
      from: "products",              // use the collection name "products"
      localField: "cartItems.productId",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  
  // Unwind the productDetails array, it should contain exactly one matching product
  { $unwind: "$productDetails" },
  
  // Group by the product category and sum up sales from price * quantity
  {
    $group: {
      _id: "$productDetails.category",
      totalSales: {
        $sum: {
          $multiply: [
            { $toDouble: "$cartItems.price" },  // Convert price string to number if needed
            "$cartItems.quantity"
          ]
        }
      }
    }
  },
  
  // Format the result to output { category, totalSales }
  {
    $project: {
      category: "$_id",
      totalSales: 1,
      _id: 0
    }
  },
  
  // Optionally, sort results descending by totalSales
  { $sort: { totalSales: -1 } },
]);

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
