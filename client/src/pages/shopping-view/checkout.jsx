import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import {
  Check,
  ShoppingBag,
  MapPin,
  CreditCard,
  Gift,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { razorpayOrder, orderId } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  // New state: paymentMethod can be "Razorpay" (online) or "COD"
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  // New state to flag when the order is completed along with order details (if needed)
  const [orderCompleted, setOrderCompleted] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Calculate the total cart amount
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            ((currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity),
          0
        )
      : 0;

  // This function handles both COD and Razorpay flows.
  const handleInitiatePayment = () => {
    if (!cartItems || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "Pending",
      paymentMethod, // "Razorpay" or "COD"
      paymentStatus: "Pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      razorpaySignature: "",
    };

    if (paymentMethod === "COD") {
      // For COD, create order immediately without Razorpay integration.
      dispatch(createNewOrder(orderData)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "COD Order placed successfully!",
            description:
              "Your order is confirmed and will be processed shortly.",
            variant: "default",
          });
          // Mark order as complete so that UI updates accordingly.
          setOrderCompleted(true);
        } else {
          toast({
            title: "COD Order creation failed.",
            variant: "destructive",
          });
        }
      });
    } else if (paymentMethod === "Razorpay") {
      // For Razorpay, create order and then trigger payment process.
      dispatch(createNewOrder(orderData)).then((data) => {
        if (data?.payload?.success) {
          setIsPaymentStart(true);
        } else {
          setIsPaymentStart(false);
        }
      });
    }
  };

  // When a Razorpay order exists and the method is online, launch Razorpay checkout.
  useEffect(() => {
    if (razorpayOrder && paymentMethod === "Razorpay") {
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: process.env.RZP_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Sweet Surprises",
          description: "Delightful treats delivered to your door",
          order_id: razorpayOrder.id,
          handler: function (response) {
            dispatch(
              capturePayment({
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderId,
              })
            ).then((res) => {
              if (res?.payload?.success) {
                toast({
                  title: "Payment successful. Order confirmed!",
                  description: "Your sweet surprises are on the way!",
                  variant: "default",
                });
                // Mark order as complete in the UI.
                setOrderCompleted(true);
              } else {
                toast({
                  title: "Payment verification failed.",
                  variant: "destructive",
                });
              }
            });
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: currentSelectedAddress?.phone,
          },
          notes: {
            address: currentSelectedAddress?.address,
          },
          theme: {
            color: "#FF4D8D",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error("Razorpay script not loaded. Please check index.html.");
      }
    }
  }, [
    razorpayOrder,
    dispatch,
    orderId,
    user,
    currentSelectedAddress,
    toast,
    paymentMethod,
  ]);

  // Navigation functions
  const goToNextStep = () => {
    if (checkoutStep === 1 && (!cartItems || cartItems.items.length === 0)) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (checkoutStep === 2 && !currentSelectedAddress) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (checkoutStep < 3) {
      setCheckoutStep(checkoutStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (checkoutStep > 1) {
      setCheckoutStep(checkoutStep - 1);
    }
  };

  // If order is completed, show a confirmation screen.
  if (orderCompleted) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <Gift className="text-pink-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-pink-600 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Your order has been successfully placed.
          </p>
          <p className="text-gray-600 mb-4">
            Order Number: <span className="font-bold">{orderId}</span>
          </p>
          {/* You can navigate to order details, home, or elsewhere */}
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl px-4 py-2"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // Otherwise, render the checkout flow.
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-x-hidden">
      <div className="absolute top-0 right-0 w-1/4 h-64 bg-pink-100 rounded-full md:-mr-12 md:-mt-32 -mr-0 -mt-0 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-purple-100 rounded-full md:-ml-16 md:-mb-32 -ml-0 -mb-0 opacity-50"></div>

      {/* Header Section */}
      <div className="relative bg-white text-pink-600 p-4 md:p-6 rounded-b-3xl shadow-lg border-t-8 border-pink-400 mx-auto max-w-full">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-300 via-purple-400 to-pink-300"></div>
        <div className="flex items-center justify-center mb-2">
          <Gift className="text-pink-500 mr-2" size={28} />
          <h1 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            Swweet Surprises
          </h1>
        </div>
        <p className="text-center text-pink-400 font-medium text-sm md:text-base">
          Complete your order and sweeten someone's day
        </p>
      </div>

      {/* Main Content Wrapper */}
      <div className="max-w-4xl mx-auto mt-6 px-4 md:px-6">
        {/* Checkout Progress */}
        <div className="flex justify-between mb-6 md:mb-8 relative">
          <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 z-0"></div>
          <div
            className={`absolute top-5 left-5 h-1 bg-gradient-to-r from-pink-400 to-purple-500 z-0 transition-all duration-500 ease-in-out`}
            style={{
              width:
                checkoutStep === 1 ? "0%" : checkoutStep === 2 ? "50%" : "100%",
              right: checkoutStep === 3 ? "5px" : "auto",
            }}
          ></div>

          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                checkoutStep >= 1
                  ? "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md shadow-pink-200"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <ShoppingBag size={18} />
            </div>
            <span
              className={`text-xs mt-2 text-center font-medium ${
                checkoutStep >= 1 ? "text-pink-600" : "text-gray-500"
              }`}
            >
              Cart
            </span>
          </div>

          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                checkoutStep >= 2
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md shadow-pink-200"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <MapPin size={18} />
            </div>
            <span
              className={`text-xs mt-2 text-center font-medium ${
                checkoutStep >= 2 ? "text-pink-600" : "text-gray-500"
              }`}
            >
              Address
            </span>
          </div>

          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                checkoutStep >= 3
                  ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-md shadow-purple-200"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <CreditCard size={18} />
            </div>
            <span
              className={`text-xs mt-2 text-center font-medium ${
                checkoutStep >= 3 ? "text-purple-600" : "text-gray-500"
              }`}
            >
              Payment
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6 border border-pink-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-pink-100 to-transparent rounded-bl-full opacity-80"></div>

          {/* Step 1: Cart Review */}
          {checkoutStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-pink-600 mb-4 flex items-center">
                <ShoppingBag size={20} className="mr-2 text-pink-500 flex-shrink-0" />
                <span className="break-words">Review Your Sweet Selections</span>
              </h2>

              {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1 md:pr-2">
                  {cartItems.items.map((item, index) => (
                    <UserCartItemsContent
                      key={index}
                      cartItem={item}
                      className="border border-pink-100 rounded-xl p-3 md:p-4 hover:shadow-md transition-all hover:border-pink-200 bg-gradient-to-r from-white to-pink-50"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12 bg-pink-50 rounded-xl">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-full bg-pink-100 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-pink-400" />
                  </div>
                  <p className="text-pink-600 font-medium mb-2">
                    Your cart is empty!
                  </p>
                  <p className="text-pink-400 text-sm">
                    Add sweet surprises to proceed with checkout
                  </p>
                </div>
              )}

              {cartItems && cartItems.items && cartItems.items.length > 0 && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mt-5 shadow-sm border border-pink-100">
                  <div className="flex justify-between text-base md:text-lg font-medium text-pink-800">
                    <span>Total</span>
                    <span className="font-bold">₹{totalCartAmount}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Address Selection */}
          {checkoutStep === 2 && (
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-pink-600 mb-4 flex items-center">
                <MapPin size={20} className="mr-2 text-pink-500 flex-shrink-0" />
                <span className="break-words">Where to Deliver Your Sweets?</span>
              </h2>
              <Address
                selectedId={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </div>
          )}

          {/* Step 3: Payment */}
          {checkoutStep === 3 && (
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-pink-600 mb-4 md:mb-6 flex items-center">
                <CreditCard size={20} className="mr-2 text-pink-500 flex-shrink-0" />
                <span className="break-words">Complete Your Sweet Order</span>
              </h2>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4 md:mb-6 shadow-sm border border-pink-100">
                <h3 className="font-medium text-pink-700 mb-2 md:mb-3 flex items-center">
                  <Gift size={16} className="mr-2 flex-shrink-0" />
                  Order Summary
                </h3>
                <div className="flex justify-between mb-2 text-gray-700 text-sm md:text-base">
                  <span>Items ({cartItems?.items?.length || 0})</span>
                  <span>₹{totalCartAmount}</span>
                </div>
                <div className="flex justify-between mb-2 text-gray-700 text-sm md:text-base">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-pink-200 my-2 md:my-3"></div>
                <div className="flex justify-between font-bold text-base md:text-lg text-gradient bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  <span>Total</span>
                  <span>₹{totalCartAmount}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-4">
                <p className="mb-2 font-medium text-pink-700">Select Payment Method</p>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === "Razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-radio text-pink-600"
                    />
                    <span>Online Payment</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-radio text-pink-600"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-xl mb-4 md:mb-6 shadow-sm border border-pink-100">
                <h3 className="font-medium text-pink-700 mb-2 md:mb-3 flex items-center">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  Delivery Address
                </h3>
                {currentSelectedAddress ? (
                  <div className="text-gray-700 bg-white p-3 md:p-4 rounded-lg border border-pink-100">
                    <p className="font-medium text-pink-600">{user?.name}</p>
                    <p className="mt-1 break-words">
                      {currentSelectedAddress.address}
                    </p>
                    <p>
                      {currentSelectedAddress.city} - {currentSelectedAddress.pincode}
                    </p>
                    <p className="mt-1 flex items-center">
                      <span className="flex-shrink-0 w-4 h-4 bg-pink-100 rounded-full text-pink-500 flex items-center justify-center mr-2 text-xs">
                        <Check size={10} />
                      </span>
                      <span className="break-all">{currentSelectedAddress.phone}</span>
                    </p>
                    {currentSelectedAddress.notes && (
                      <p className="mt-2 text-sm bg-pink-50 p-2 rounded border border-pink-100 break-words">
                        Note: {currentSelectedAddress.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-white rounded-lg">
                    <p className="text-pink-500">
                      Please go back and select an address
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleInitiatePayment}
                  disabled={isPaymentStart || !currentSelectedAddress}
                  className="w-full md:w-2/3 py-3 md:py-4 text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:shadow-lg transition-all shadow-md disabled:opacity-70 font-medium text-base md:text-lg"
                >
                  {paymentMethod === "Razorpay" && isPaymentStart ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2 md:mr-3"></div>
                      Processing Payment...
                    </div>
                  ) : paymentMethod === "Razorpay" ? (
                    <div className="flex items-center justify-center">
                      Pay Now ₹{totalCartAmount}
                      <ArrowRight size={16} className="ml-2 flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Place COD Order of ₹{totalCartAmount}
                      <ArrowRight size={16} className="ml-2 flex-shrink-0" />
                    </div>
                  )}
                </Button>
                <p className="text-xs text-pink-400 mt-2 md:mt-3">
                  {paymentMethod === "Razorpay"
                    ? "Safe & Secure Payment via Razorpay"
                    : "You will pay on delivery"}
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6 md:mt-8 pt-4 border-t border-gray-100">
            {checkoutStep > 1 ? (
              <Button
                onClick={goToPreviousStep}
                variant="outline"
                className="border-pink-300 text-pink-500 hover:bg-pink-50 rounded-xl px-4 md:px-6 flex items-center"
              >
                <ArrowLeft size={14} className="mr-1 md:mr-2 flex-shrink-0" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {checkoutStep < 3 && (
              <Button
                onClick={goToNextStep}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-md text-white rounded-xl px-4 md:px-6 flex items-center"
              >
                Continue
                <ArrowRight size={14} className="ml-1 md:ml-2 flex-shrink-0" />
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-pink-400 text-xs md:text-sm mb-6 md:mb-8">
          Swweet Surprises • Spreading joy, one sweet at a time
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
