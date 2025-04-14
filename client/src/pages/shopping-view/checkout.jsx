import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { razorpayOrder, orderId, redirect_urls } = useSelector(
    (state) => state.shopOrder
  );
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
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

  // Initiate a new Razorpay order
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

  // When razorpayOrder becomes available, open Razorpay checkout with redirection enabled.
  useEffect(() => {
    if (razorpayOrder) {
      if (typeof window !== "undefined" && window.Razorpay) {
        // Use the return URL provided by the backend (you could also use cancel_url as needed)
        const callbackUrl = redirect_urls?.return_url;
        const options = {
          key: 'rzp_test_BN58I09Ntf1QYq', // ensure this is set in your env variables
          amount: razorpayOrder.amount, // amount in paise
          currency: razorpayOrder.currency,
          name: "Swweet Surprises",
          description: "Test Transaction",
          order_id: razorpayOrder.id, // Razorpay order ID
          // Enable redirection after payment (both for success and failure)
          redirect: true,
          callback_url: callbackUrl,
          // Optional handler if you prefer to handle without redirect
          handler: function (response) {
            // In case you decide not to redirect automatically,
            // you can capture payment manually here.
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
        console.error("Razorpay script not loaded. Check index.html");
      }
    }
  }, [razorpayOrder, redirect_urls, dispatch, orderId, user, currentSelectedAddress, toast]);

  return (
    <div className="flex flex-col">
      {/* Header Image Section */}
      <div className="relative h-[300px] w-full overflow-hidden bg-gradient-to-b from-pink-100 to-pink-300">
        <img
          src={img}
          alt="Checkout Header"
          className="h-full w-full object-cover object-center brightness-90"
        />
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 px-6 py-4 bg-gradient-to-b from-pink-50 to-pink-100 rounded-lg shadow-md">
        {/* Address Section */}
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        {/* Cart and Payment Section */}
        <div className="flex flex-col gap-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems && cartItems.items && cartItems.items.length > 0 ? (
              cartItems.items.map((item, index) => (
                <UserCartItemsContent
                  key={index}
                  cartItem={item}
                  className="border-b pb-4 transition-transform hover:scale-105"
                />
              ))
            ) : (
              <p className="text-pink-500 font-medium text-center">
                Your cart is empty! Add items to proceed.
              </p>
            )}
          </div>

          {/* Total Section */}
          <div className="flex justify-between bg-pink-200 bg-opacity-60 p-4 rounded-md shadow">
            <span className="font-bold text-pink-700">Total</span>
            <span className="font-bold text-pink-700">₹{totalCartAmount}</span>
          </div>

          {/* Payment Button */}
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiateRazorpayPayment}
              className="w-full py-3 text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-transform shadow-md"
            >
              {isPaymentStart
                ? "Processing Razorpay Payment..."
                : "Checkout with Razorpay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
