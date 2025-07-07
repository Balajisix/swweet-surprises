const transporter = require("../config/nodemailer");
const User = require("../models/User");

const sendOrderConfirmationEmail = async (userId, order) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.warn("Email not sent: user email missing.");
      return;
    }

    const orderItemsHtml = order.items?.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #fce7f3;">
          <div style="display: flex; align-items: center;">
            <div style="flex: 1;">
              <h4 style="margin: 0 0 4px 0; color: #831843; font-size: 16px;">${item.name || 'Product'}</h4>
              <p style="margin: 0; color: #9f1239; font-size: 14px;">Qty: ${item.quantity || 1}</p>
            </div>
            <div style="text-align: right;">
              <span style="color: #831843; font-weight: bold; font-size: 16px;">₹${item.price || 0}</span>
            </div>
          </div>
        </td>
      </tr>
    `).join('') || '<tr><td style="padding: 12px; text-align: center; color: #9f1239;">Order details not available</td></tr>';

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Sweet Surprise</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(236, 72, 153, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
                animation: float 20s infinite linear;
            }
            
            @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); }
                100% { transform: translate(-50px, -50px) rotate(360deg); }
            }
            
            .header h1 {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                position: relative;
                z-index: 1;
            }
            
            .header p {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
                position: relative;
                z-index: 1;
            }
            
            .celebration-icon {
                font-size: 48px;
                margin-bottom: 20px;
                display: block;
                animation: bounce 2s infinite;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .greeting h2 {
                color: #831843;
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 10px;
            }
            
            .greeting p {
                color: #9f1239;
                font-size: 16px;
            }
            
            .order-card {
                background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
                border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                border: 2px solid #f9a8d4;
                position: relative;
                overflow: hidden;
            }
            
            .order-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #ec4899, #be185d, #ec4899);
                background-size: 200% 100%;
                animation: shimmer 3s infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .order-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .order-id {
                color: #831843;
                font-weight: 600;
                font-size: 18px;
            }
            
            .order-status {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
            }
            
            .order-items {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                margin: 20px 0;
                box-shadow: 0 4px 12px rgba(236, 72, 153, 0.1);
            }
            
            .order-items table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .order-items th {
                background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 600;
                font-size: 16px;
            }
            
            .total-section {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-top: 20px;
                box-shadow: 0 4px 12px rgba(236, 72, 153, 0.1);
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #fce7f3;
            }
            
            .total-row:last-child {
                border-bottom: none;
                font-weight: 700;
                font-size: 20px;
                color: #831843;
                margin-top: 10px;
                padding-top: 15px;
                border-top: 2px solid #ec4899;
            }
            
            .info-box {
                background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                border-left: 4px solid #3b82f6;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
            }
            
            .info-box p {
                margin: 0;
                color: #1e40af;
                font-weight: 500;
            }
            
            .footer {
                background: linear-gradient(135deg, #831843 0%, #9f1239 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .footer h3 {
                margin-bottom: 15px;
                font-size: 20px;
                font-weight: 600;
            }
            
            .footer p {
                margin-bottom: 10px;
                opacity: 0.9;
            }
            
            .social-links {
                margin-top: 20px;
            }
            
            .social-links a {
                color: white;
                text-decoration: none;
                margin: 0 10px;
                font-size: 24px;
                transition: transform 0.3s ease;
            }
            
            .social-links a:hover {
                transform: scale(1.2);
            }
            
            .heart-pulse {
                animation: pulse 2s infinite;
                display: inline-block;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .header, .content, .footer {
                    padding: 20px;
                }
                
                .order-card {
                    padding: 20px;
                }
                
                .order-header {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .total-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <span class="celebration-icon">🎉</span>
                <h1>Sweet Surprise 🎁</h1>
                <p>Your order has been confirmed!</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    <h2>Hello ${user.name || "Dear Customer"}! 👋</h2>
                    <p>Thank you for choosing Sweet Surprise for your special moments!</p>
                </div>
                
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-id">Order #${order._id}</div>
                        <div class="order-status">✅ Confirmed</div>
                    </div>
                    
                    <div class="order-items">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderItemsHtml}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="total-section">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>₹${(order.totalAmount * 0.85).toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Taxes & Fees:</span>
                            <span>₹${(order.totalAmount * 0.15).toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Total Amount:</span>
                            <span>₹${order.totalAmount}</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-box">
                    <p>📦 <strong>What's Next?</strong> We're carefully preparing your order with love! You'll receive a tracking notification once your sweet surprise ships.</p>
                </div>
                
                <div class="info-box">
                    <p>🚚 <strong>Estimated Delivery:</strong> 2-3 business days</p>
                </div>
            </div>
            
            <div class="footer">
                <h3>Thank you for trusting Sweet Surprise! <span class="heart-pulse">💖</span></h3>
                <p>We're committed to making your moments sweeter</p>
                <p>Need help? Reply to this email or contact our support team</p>
                <p style="font-size: 14px; margin-top: 20px; opacity: 0.8;">
                    Sweet Surprise Team<br>
                    Making every moment special since 2024
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: '"Sweet Surprise 🎁" <swweetsurprise@gmail.com>',
      to: user.email,
      subject: `🎉 Order Confirmation - Your Sweet Surprise is Coming! #${order._id}`,
      html: htmlTemplate,
    });

    console.log(`Confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

module.exports = sendOrderConfirmationEmail;