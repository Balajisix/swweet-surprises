const transporter = require("../config/nodemailer");
const User = require("../models/User");

const sendOrderConfirmationEmail = async (userId, order) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.warn("Email not sent: user email missing.");
      return;
    }

    // Send the email using the existing transporter configuration
    await transporter.sendMail({
      from: '"Sweet Surprise 🎁" <swweetsurprise@gmail.com>',
      to: user.email,
      subject: `🎉 Order Confirmation - Order #${order._id}`,
      html: `
        <h2>Hello ${user.name || "Customer"},</h2>
        <p>Thank you for your order from Sweet Surprise!</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p>We are processing your order and will update you once it ships.</p>
        <br/>
        <p>Warm regards, <br/>Team Sweet Surprise 💖</p>
      `,
    });

    console.log(`Confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

module.exports = sendOrderConfirmationEmail;
