import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Check, ShoppingBag, MapPin, CreditCard } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { razorpayOrder, orderId } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Review Cart, 2: Address, 3: Payment
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

  // Create a new order on the backend and prepare for Razorpay payment
  const handleInitiateRazorpayPayment = () => {
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
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      razorpaySignature: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  };

  // Whenever we get a new razorpayOrder from the store, open the Razorpay checkout
  useEffect(() => {
    if (razorpayOrder) {
      // Make sure the script is available on window
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: 'rzp_test_BN58I09Ntf1QYq', // your public Razorpay key
          amount: razorpayOrder.amount, // amount is in paise
          currency: razorpayOrder.currency,
          name: "Swweet Surprises",
          description: "Test Transaction",
          order_id: razorpayOrder.id, // Razorpay order ID
          handler: function (response) {
            // response contains razorpay_payment_id, razorpay_order_id, and razorpay_signature
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
                  variant: "default",
                });
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
            color: "#F37254",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error("Razorpay script not loaded. Please check index.html.");
      }
    }
  }, [razorpayOrder, dispatch, orderId, user, currentSelectedAddress, toast]);

  // Step navigation functions
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header Section - Smaller and more elegant */}
      <div className="bg-pink-500 text-white p-4 md:p-6 rounded-b-lg shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Checkout</h1>
        <p className="text-center text-pink-100 mt-1">Complete your order</p>
      </div>

      {/* Checkout Progress */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${checkoutStep >= 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <ShoppingBag size={20} />
            </div>
            <span className="text-xs mt-2 text-center">Cart</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className={`h-1 w-full ${checkoutStep >= 2 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${checkoutStep >= 2 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <MapPin size={20} />
            </div>
            <span className="text-xs mt-2 text-center">Address</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className={`h-1 w-full ${checkoutStep >= 3 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${checkoutStep >= 3 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <CreditCard size={20} />
            </div>
            <span className="text-xs mt-2 text-center">Payment</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-8">
          {/* Step 1: Cart Review */}
          {checkoutStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-pink-700 mb-4">Review Your Cart</h2>
              
              {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {cartItems.items.map((item, index) => (
                    <UserCartItemsContent
                      key={index}
                      cartItem={item}
                      className="border border-pink-100 rounded-lg p-3 hover:shadow-md transition-all"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag size={48} className="mx-auto text-pink-300 mb-3" />
                  <p className="text-pink-500 font-medium">Your cart is empty! Add items to proceed.</p>
                </div>
              )}
              
              {cartItems && cartItems.items && cartItems.items.length > 0 && (
                <div className="bg-pink-50 p-4 rounded-md mt-4">
                  <div className="flex justify-between text-lg font-medium text-pink-800">
                    <span>Total</span>
                    <span>₹{totalCartAmount}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Address Selection */}
          {checkoutStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-pink-700 mb-4">Select Delivery Address</h2>
              <Address
                selectedId={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </div>
          )}

          {/* Step 3: Payment */}
          {checkoutStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-pink-700 mb-4">Payment</h2>
              
              <div className="bg-pink-50 p-4 rounded-md mb-6">
                <h3 className="font-medium text-pink-700 mb-2">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Items ({cartItems?.items?.length || 0})</span>
                  <span>₹{totalCartAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-pink-200 my-2"></div>
                <div className="flex justify-between font-bold text-pink-800">
                  <span>Total</span>
                  <span>₹{totalCartAmount}</span>
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-md mb-6">
                <h3 className="font-medium text-pink-700 mb-2">Delivery Address</h3>
                {currentSelectedAddress ? (
                  <div className="text-gray-700">
                    <p className="font-medium">{user?.name}</p>
                    <p>{currentSelectedAddress.address}</p>
                    <p>{currentSelectedAddress.city} - {currentSelectedAddress.pincode}</p>
                    <p>Phone: {currentSelectedAddress.phone}</p>
                    {currentSelectedAddress.notes && <p>Notes: {currentSelectedAddress.notes}</p>}
                  </div>
                ) : (
                  <p className="text-pink-500">Please go back and select an address</p>
                )}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleInitiateRazorpayPayment}
                  disabled={isPaymentStart || !currentSelectedAddress}
                  className="w-full md:w-2/3 py-3 text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-all shadow-md"
                >
                  {isPaymentStart ? (
                    <>Processing Razorpay Payment...</>
                  ) : (
                    <>Pay Now with Razorpay</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            {checkoutStep > 1 ? (
              <Button 
                onClick={goToPreviousStep}
                variant="outline" 
                className="border-pink-300 text-pink-500 hover:bg-pink-50"
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            {checkoutStep < 3 && (
              <Button 
                onClick={goToNextStep}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;