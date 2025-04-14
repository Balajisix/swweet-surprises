import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.png";
import bannerThree from "../../assets/banner-1.webp";
import { Button } from "@/components/ui/button";
import { Frame, WalletCards, ChevronLeftIcon, ChevronRightIcon, Key, Book, Coffee, CalendarHeart, Gem, Handshake, CandyCane, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "frame", label: "Photo frame", icon: Frame },
  { id: "wallet", label: "Wallet cards", icon: WalletCards },
  { id: "keychain", label: "Keychains", icon: Key },
  { id: "mugs", label: "Mugs", icon: Coffee },
  { id: "photoBook", label: "Mini Photo Book", icon: Book },
];

const occasionsWithIcon = [
  { id: "valentine", label: "Valentine's day", icon: CalendarHeart },
  { id: "wedding", label: "Wedding Gift", icon: Gem },
  { id: "friends", label: "Friendship day", icon: Handshake },
  { id: "christmas", label: "Christmas", icon: CandyCane },
  { id: "mother", label: "Mother's day", icon: Gift },
  { id: "father", label: "Father's day", icon: Gift },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Navigate with filtered parameters for listing page
  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  // Fetch product details and navigate to the product page.
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId)).then(() => {
      // Navigate to /shop/productspage after the details are fetched.
      navigate(`/shop/productpage`);
    });
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  // Auto slide feature images every 8 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % (featureImageList?.length || 3));
    }, 8000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({
      filterParams: {},
      sortParams: "price-lowtohigh",
    }));
    dispatch(getFeatureImages());
  }, [dispatch]);

  // Banner images and copy (update with your actual images and texts)
  const banners = [
    { 
      image: bannerOne, 
      title: "Sweet Surprises For Your Loved Ones",
      subtitle: "Personalized gifts for every special moment"
    },
    { 
      image: bannerTwo, 
      title: "Create Lasting Memories",
      subtitle: "Turn your favorite moments into treasured keepsakes"
    },
    { 
      image: bannerThree, 
      title: "Special Occasion Gifts",
      subtitle: "Celebrate every milestone with unique personalized gifts"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fff5f8]">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-pink-100 to-pink-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center py-8 md:py-12">
            {/* Text content */}
            <div className="w-full md:w-1/2 text-center md:text-left z-10 mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-pink-700 mb-4">
                {banners[currentSlide]?.title || "Sweet Personalized Gifts"}
              </h1>
              <p className="text-lg md:text-xl text-pink-600 mb-6">
                {banners[currentSlide]?.subtitle || "Make every moment special with our customized gifts"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2"
                  onClick={() => navigate('/shop/listing')}
                >
                  Shop Now
                </Button>
                <Button 
                  variant="outline" 
                  className="border-pink-600 text-pink-600 hover:bg-pink-100"
                  onClick={() => navigate('/custom-order')}
                >
                  Custom Order
                </Button>
              </div>
            </div>
            {/* Banner image */}
            <div className="w-full md:w-1/2 relative h-48 sm:h-64 md:h-80">
              {banners.map((banner, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                >
                  <img
                    src={banner.image}
                    alt={`Sweet Surprise Banner ${index + 1}`}
                    className="rounded-lg shadow-md object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Banner controls */}
          <div className="flex justify-center md:justify-end gap-2 pb-4">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-pink-600" : "bg-pink-300"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-8 md:py-12 bg-[#fff5f8]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-[#d63384]">
            Find Your Perfect Gift
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {categoriesWithIcon.map((categoryItem, index) => (
              <Card
                key={index}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border border-[#ffd6e0] overflow-hidden"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                  <div className="bg-pink-50 p-3 rounded-full mb-3">
                    <categoryItem.icon className="w-6 h-6 md:w-8 md:h-8 text-[#d63384]" />
                  </div>
                  <span className="font-medium text-sm md:text-base text-center text-[#d63384]">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-[#d63384]">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {productList && productList.length > 0
              ? productList.slice(0, 8).map((productItem, index) => (
                  <ShoppingProductTile
                    key={index}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="bg-pink-50 animate-pulse rounded-lg h-64"></div>
                  ))}
          </div>
          {productList && productList.length > 8 && (
            <div className="text-center mt-8">
              <Button 
                className="bg-pink-600 hover:bg-pink-700 text-white"
                onClick={() => navigate('/shop/listing')}
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-8 md:py-12 bg-[#fff0f5]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-[#d63384]">
            Shop by Occasion
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {occasionsWithIcon.map((occasionItem, index) => (
              <Card
                key={index}
                onClick={() => handleNavigateToListingPage(occasionItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border border-[#ffd6e0]"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                  <div className="bg-pink-50 p-3 rounded-full mb-3">
                    <occasionItem.icon className="w-6 h-6 md:w-8 md:h-8 text-[#d63384]" />
                  </div>
                  <span className="font-medium text-sm md:text-base text-center text-[#d63384]">
                    {occasionItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-[#d63384]">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-pink-100 rounded-full p-4 mb-4">
                <Frame className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-pink-600 mb-2">Choose Your Gift</h3>
              <p className="text-gray-600">Browse our collection of personalized gifts for every occasion</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-pink-100 rounded-full p-4 mb-4">
                <Book className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-pink-600 mb-2">Customize It</h3>
              <p className="text-gray-600">Add your personal touch with photos, messages, and more</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-pink-100 rounded-full p-4 mb-4">
                <Gift className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-pink-600 mb-2">Delight Someone</h3>
              <p className="text-gray-600">We'll craft and deliver your unique gift to spread joy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
