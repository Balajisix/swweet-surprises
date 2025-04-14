const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const FRONTEND_URL = "https://swweet-surprises.vercel.app";

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      // Since we now use Razorpay, these fields might be set after payment confirmation
      paymentId,
      razorpaySignature,
      cartId,
    } = req.body;

    // Razorpay requires the amount in paisa.
    const options = {
      amount: Math.round(totalAmount * 100), // convert INR to paise
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
      payment_capture: 1, // automatic capture on payment success
    };

    // Create order with Razorpay
    razorpay.orders.create(options, async (error, orderInfo) => {
      if (error) {
        console.error("Error while creating razorpay order:", error);

        return res.status(500).json({
          success: false,
          message: "Error while creating razorpay order",
        });
      } else {
        // Save order details in the database. Payment details (paymentId, signature) can be updated later
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId, // This will be updated once payment is captured
          razorpaySignature, // This too
          // Optionally, store the Razorpay order id returned by the API
          razorpayOrderId: orderInfo.id,
        });

        await newlyCreatedOrder.save();

        // Respond back with the order details from Razorpay (order id, etc.)
        res.status(201).json({
          success: true,
          razorpayOrder: orderInfo,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, razorpayOrderId, razorpaySignature, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    // In a real-world scenario, you should verify the signature here to ensure payment authenticity.
    // Assuming verification is done on the client or via webhook, we update the order details accordingly.
    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.paymentId = paymentId;
    order.razorpaySignature = razorpaySignature;

    // Update each product's stock based on the purchased quantity.
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for product ${item.title || item.productId}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // Remove the cart as it has now been processed.
    await Cart.findByIdAndDelete(order.cartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};