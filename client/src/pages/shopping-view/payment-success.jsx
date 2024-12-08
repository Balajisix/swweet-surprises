import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-300 via-white to-pink-300"
    >
      <Card className="p-10 bg-white shadow-lg rounded-xl border border-gray-200">
        <CardHeader className="p-0 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CardTitle className="text-4xl font-bold text-pink-500">
              🎉 Payment Successful! 🎉
            </CardTitle>
            <CardDescription className="mt-4 text-lg text-gray-600">
              Thank you for your purchase! Your order is being processed and will be on its way soon.
            </CardDescription>
          </motion.div>
        </CardHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Button
            className="mt-8 px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/shop/account")}
          >
            View Orders
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-center text-gray-500"
        >
          <p>
            Need help? <span className="text-pink-500 font-semibold cursor-pointer hover:underline">Contact Us</span>
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default PaymentSuccessPage;
