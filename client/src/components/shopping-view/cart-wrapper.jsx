import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-gradient-to-b from-pink-100 to-pink-200 rounded-lg shadow-lg animate-fade-in">
      {/* Cart Header Section */}
      <SheetHeader className="text-center">
        <SheetTitle className="text-2xl font-bold text-pink-600">
          Your Cart 🛒
        </SheetTitle>
        <p className="text-sm text-pink-500 mt-1">
          Review your selected items before checking out.
        </p>
      </SheetHeader>

      {/* Cart Items Section */}
      <div className="mt-8 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <UserCartItemsContent
              key={index}
              cartItem={item}
              className="transform hover:scale-105 transition-transform duration-300"
            />
          ))
        ) : (
          <div className="text-center text-pink-500 font-medium">
            Your cart is empty! Start adding your favorite items now. 💖
          </div>
        )}
      </div>

      {/* Total and Checkout Section */}
      <div className="mt-8 p-4 bg-white bg-opacity-70 rounded-lg shadow-md">
        <div className="flex justify-between text-lg font-semibold text-pink-700">
          <span>Total</span>
          <span>₹{totalCartAmount}</span>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full mt-4 py-3 text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-all shadow-lg"
        >
          Proceed to Checkout
        </Button>
      </div>

      {/* Add Some Subtle Decorative Elements */}
      <div className="mt-4 text-center text-sm text-pink-500">
        Fast and secure checkout ensures your order gets processed instantly. 🎉
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
