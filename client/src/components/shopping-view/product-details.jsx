import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  StarIcon, 
  ShoppingBag, 
  Heart, 
  Share2, 
  ChevronRight, 
  Gift, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StarRatingComponent from "@/components/common/star-rating";
import { 
  fetchProductDetails, 
  setProductDetails 
} from "@/store/shop/products-slice";
import { 
  addToCart, 
  fetchCartItems 
} from "@/store/shop/cart-slice";
import { 
  addReview, 
  getReviews 
} from "@/store/shop/review-slice";

function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // State
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Redux state
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  
  // Calculate average review
  const averageReview = reviews && reviews.length > 0
    ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
    : 0;
  
  // Sample related products (replace with actual data from your API)
  const relatedProducts = [
    {
      _id: "prod1",
      title: "Personalized Photo Frame",
      image: "/api/placeholder/200/200",
      price: 499,
      salePrice: 399
    },
    {
      _id: "prod2",
      title: "Custom Mug",
      image: "/api/placeholder/200/200",
      price: 299,
      salePrice: 0
    },
    {
      _id: "prod3",
      title: "Photo Keychain",
      image: "/api/placeholder/200/200",
      price: 199,
      salePrice: 149
    },
    {
      _id: "prod4",
      title: "Memory Book",
      image: "/api/placeholder/200/200",
      price: 699,
      salePrice: 599
    }
  ];
  
  // Mock product images (replace with actual data)
  const productImages = productDetails?.image 
    ? [
        productDetails.image,
        "/api/placeholder/600/600",  
        "/api/placeholder/600/600",
        "/api/placeholder/600/600"
      ]
    : [];
  
  // Handlers
  function handleQuantityChange(change) {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= productDetails?.totalStock) {
      setQuantity(newQuantity);
    }
  }
  
  function handleRatingChange(newRating) {
    setRating(newRating);
  }
  
  function handleAddToCart() {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === productDetails?._id
      );
      if (indexOfCurrentItem > -1) {
        const existingQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (existingQuantity + quantity > productDetails?.totalStock) {
          toast({
            title: `Only ${productDetails?.totalStock - existingQuantity} more units available`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails?._id,
        quantity: quantity,
        giftWrapped: isGiftWrapped,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: `${quantity} item${quantity > 1 ? 's' : ''} added to your cart`,
          description: isGiftWrapped ? "Gift wrapping included!" : "",
          className: "bg-pink-50 border-pink-200",
        });
      }
    });
  }
  
  function handleBuyNow() {
    handleAddToCart();
    navigate('/shop/checkout');
  }
  
  function handleAddReview() {
    if (!user?.id) {
      toast({
        title: "Please login to add a review",
        variant: "destructive",
      });
      return;
    }
    
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName || "User",
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Thank you for your review!",
          className: "bg-pink-50 border-pink-200",
        });
      }
    });
  }
  
  function handleNavigateToProduct(id) {
    navigate(`/shop/product/${id}`);
  }
  
  // Effects
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
    
    return () => {
      dispatch(setProductDetails(null));
    };
  }, [dispatch, productId]);
  
  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [dispatch, productDetails]);
  
  // Loading state
  if (!productDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-pink-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-pink-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <button 
            onClick={() => navigate('/shop/home')}
            className="flex items-center hover:text-pink-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Shop
          </button>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span>Products</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-pink-600 font-medium">{productDetails.title}</span>
        </div>
      </div>
      
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 md:p-8">
            {/* Product Images Section */}
            <div className="lg:col-span-1">
              <div className="relative aspect-square mb-4 overflow-hidden rounded-xl border border-pink-100">
                <img
                  src={productImages[selectedImage] || productDetails.image}
                  alt={productDetails.title}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
                {productDetails.salePrice > 0 && (
                  <Badge className="absolute top-4 left-4 bg-pink-500 text-white">
                    Sale
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-pink-500" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Details Section */}
            <div className="lg:col-span-2">
              <div className="flex flex-col h-full">
                {/* Title and Rating */}
                <div>
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      {productDetails.title}
                    </h1>
                    <button 
                      className={`p-2 rounded-full ${
                        isFavorite ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500"
                      }`}
                      onClick={() => setIsFavorite(!isFavorite)}
                      aria-label="Add to favorites"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-pink-600" : ""}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <StarRatingComponent rating={averageReview} />
                    <span className="text-gray-500 text-sm">
                      {averageReview.toFixed(1)} ({reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 mb-6">{productDetails.description}</p>
                
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  {productDetails.salePrice > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-pink-600">
                        ₹{productDetails.salePrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{productDetails.price}
                      </span>
                      <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-sm font-medium">
                        {Math.round(((productDetails.price - productDetails.salePrice) / productDetails.price) * 100)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-pink-600">
                      ₹{productDetails.price}
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="mb-6">
                  {productDetails.totalStock > 0 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      In Stock ({productDetails.totalStock} available)
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      Out of Stock
                    </span>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                {/* Gift Wrapping Option */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-pink-50 rounded-lg">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <div className="flex-grow">
                    <label htmlFor="giftWrap" className="font-medium text-gray-700">
                      Add Gift Wrapping
                    </label>
                    <p className="text-sm text-gray-500">
                      We'll wrap your gift in premium paper with a personalized note
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="giftWrap"
                    checked={isGiftWrapped}
                    onChange={() => setIsGiftWrapped(!isGiftWrapped)}
                    className="w-5 h-5 accent-pink-500"
                  />
                </div>
                
                {/* Quantity Selector and Add to Cart */}
                {productDetails.totalStock > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                      <button 
                        className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= productDetails.totalStock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 flex-grow">
                      <Button 
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white border-none"
                        onClick={handleAddToCart}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        className="flex-1 bg-pink-100 text-pink-600 hover:bg-pink-200 border-none"
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-gray-300 text-white cursor-not-allowed mb-6"
                    disabled
                  >
                    Out of Stock
                  </Button>
                )}
                
                {/* Shipping Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-full">
                      <Truck className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Free Shipping</p>
                      <p className="text-sm text-gray-500">On orders above ₹499</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-full">
                      <ShieldCheck className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Secure Payment</p>
                      <p className="text-sm text-gray-500">100% secure checkout</p>
                    </div>
                  </div>
                </div>
                
                {/* Share */}
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-gray-500">Share:</span>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Details Tabs */}
          <div className="border-t border-gray-200 pt-6 pb-8 px-6 md:px-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <h3 className="text-lg font-semibold">Product Details</h3>
                <p>
                  {productDetails.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Nulla facilisi. Phasellus id justo vel nunc faucibus feugiat. 
                  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; 
                  Etiam vestibulum, neque vel facilisis placerat.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-gray-800">Features:</h4>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                      <li>High-quality materials</li>
                      <li>Personalized design</li>
                      <li>Durable construction</li>
                      <li>Perfect gift for any occasion</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Specifications:</h4>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li><span className="font-medium">Material:</span> Premium quality</li>
                      <li><span className="font-medium">Dimensions:</span> Custom size</li>
                      <li><span className="font-medium">Weight:</span> Lightweight</li>
                      <li><span className="font-medium">Care:</span> Easy to clean</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                {/* Average Rating */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">{averageReview.toFixed(1)}</div>
                    <StarRatingComponent rating={averageReview} />
                    <div className="text-sm text-gray-500 mt-1">{reviews?.length || 0} reviews</div>
                  </div>
                  <div className="flex-grow">
                    {/* Rating Distribution */}
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews?.filter(r => Math.round(r.reviewValue) === star).length || 0;
                      const percentage = reviews?.length ? (count / reviews.length) * 100 : 0;
                      
                      return (
                        <div className="flex items-center gap-2" key={star}>
                          <div className="text-sm text-gray-500 w-4">{star}</div>
                          <StarIcon className="w-4 h-4 text-amber-400" />
                          <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-400 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500 w-8">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <Separator />
                
                {/* Review List */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  
                  {reviews?.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((reviewItem, index) => (
                        <div className="flex gap-4" key={index}>
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-pink-100 text-pink-600">
                              {reviewItem?.userName[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-gray-800">{reviewItem?.userName}</h4>
                            <div className="flex items-center gap-2">
                              <StarRatingComponent rating={reviewItem?.reviewValue} />
                              <span className="text-sm text-gray-500">1 month ago</span>
                            </div>
                            <p className="text-gray-600 mt-1">{reviewItem.reviewMessage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                  )}
                </div>
                
                <Separator />
                
                {/* Add Review Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Your Rating</label>
                      <StarRatingComponent 
                        rating={rating} 
                        handleRatingChange={handleRatingChange} 
                        size={6}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Your Review</label>
                      <Input
                        name="reviewMsg"
                        value={reviewMsg}
                        onChange={(event) => setReviewMsg(event.target.value)}
                        placeholder="Share your thoughts about this product..."
                        className="bg-white"
                      />
                    </div>
                    
                    <Button
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                      onClick={handleAddReview}
                      disabled={reviewMsg.trim() === "" || rating === 0}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Standard Shipping</h4>
                      <p className="text-gray-600">3-5 business days</p>
                      <p className="text-gray-600">Free on orders above ₹499</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">30-Day Returns</h4>
                      <p className="text-gray-600">
                        If you're not completely satisfied with your purchase, you can return it within 30 days
                        for a full refund. Please note that personalized items cannot be returned unless damaged.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Gift className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Gift Options</h4>
                      <p className="text-gray-600">
                        Add gift wrapping to your order and include a personalized message. 
                        We use premium wrapping paper and elegant gift tags.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Related Products Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">You May Also Like</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <div 
              key={product._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleNavigateToProduct(product._id)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
                <div className="flex items-baseline gap-2">
                  {product.salePrice > 0 ? (
                    <>
                      <span className="font-bold text-pink-600">₹{product.salePrice}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                    </>
                  ) : (
                    <span className="font-bold text-pink-600">₹{product.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;