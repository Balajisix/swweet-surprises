const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const sendOrderConfirmationEmail = require('../../helpers/confirmationMail');
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
      paymentId,
      razorpaySignature,
      cartId,
    } = req.body;

    // If payment method is COD, simply create the order without Razorpay integration
    if (paymentMethod === "COD") {
      // You can choose your own order status for COD. Here, we use "Pending" for orders awaiting delivery/payment collection.
      const codOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus: "Pending", // or use "Confirmed" if you want to confirm it immediately
        paymentMethod,
        paymentStatus: "Pending", // COD orders remain pending until delivered/received payment
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId: "", // Not applicable for COD
        razorpaySignature: "",
        razorpayOrderId: "", // Not applicable for COD
      });
      await codOrder.save();

      // Optionally update product stock (if you want to reserve inventory immediately)
      for (let item of cartItems) {
        let product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found for ${item.title || item.productId}`,
          });
        }
        product.totalStock -= item.quantity;
        await product.save();
      }

      // Clear the cart if needed.
      await Cart.findByIdAndDelete(cartId);

      sendOrderConfirmationEmail(userId, codOrder);

      return res.status(201).json({
        success: true,
        message: "COD order created successfully",
        orderId: codOrder._id,
        data: codOrder,
      });
    }

    // If payment method is Razorpay, then create a Razorpay order.
    const options = {
      amount: Math.round(totalAmount * 100), // convert INR to paise
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
      payment_capture: 1, // automatic capture on payment success
    };

    razorpay.orders.create(options, async (error, orderInfo) => {
      if (error) {
        console.error("Error while creating razorpay order:", error);
        return res.status(500).json({
          success: false,
          message: "Error while creating razorpay order",
        });
      } else {
        // Save order details in the database. Payment details (paymentId, signature) will be updated after payment confirmation.
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
          paymentId, 
          razorpaySignature,
          razorpayOrderId: orderInfo.id, 
        });

        await newlyCreatedOrder.save();

        // Respond with the Razorpay order details required for payment on the frontend.
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

    // Verify the Razorpay signature in a production setup

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.paymentId = paymentId;
    order.razorpaySignature = razorpaySignature;

    // Update the stock for each product purchased.
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

    // Remove the cart after processing the order.
    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    sendOrderConfirmationEmail(order.userId, order);

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
