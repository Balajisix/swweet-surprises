import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-gradient-to-br from-pink-100 to-pink-200 shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-xl overflow-hidden">
      {/* Product Image Section */}
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative group">
          {/* Product Image with zoom effect */}
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110"
          />
          {/* Stock, Sale, or Limited Stock Badge */}
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white shadow-md animate-pulse">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-orange-500 text-white shadow-md animate-bounce">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-green-500 text-white shadow-md">
              Sale
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-5 text-center">
        <h2 className="text-lg font-extrabold text-pink-700 hover:text-pink-800 transition-colors">
          {product?.title}
        </h2>
        <div className="flex justify-center items-center text-sm text-gray-600 mt-2">
          <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs font-semibold">
            {categoryOptionsMap[product?.category] || "Swweet Surprise Products"}
          </span>
        </div>
        {/* Price Display */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <span
            className={`text-lg font-semibold ${
              product?.salePrice > 0 ? "line-through text-gray-500" : "text-pink-700"
            }`}
          >
            ₹{product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-xl font-bold text-green-600">
              ₹{product?.salePrice}
            </span>
          )}
        </div>

      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-4">
        {product?.totalStock === 0 ? (
          <Button
            className="w-full bg-gray-400 text-white cursor-not-allowed rounded-lg opacity-60"
            disabled
          >
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
