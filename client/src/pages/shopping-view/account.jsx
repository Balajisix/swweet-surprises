import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MapPin, Heart, Settings, CreditCard, Gift } from "lucide-react";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { useSelector } from "react-redux";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);
  const orders = useSelector((state) => state.orders?.orderList || []);

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  
  // Animation effect on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Premium Status Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center py-2 px-4 text-sm">
        <span className="font-medium">✨ Sweet Rewards Member ✨</span>
      </div>

      {/* Stylish Header */}
      <div className="bg-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-pink-100 opacity-10 
                        [mask-image:radial-gradient(ellipse_at_top_right,_black_30%,_transparent_70%)]"></div>
        <div className="container mx-auto py-8 px-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.userName}!
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your sweet experiences</p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-200 to-pink-400 p-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                <User size={42} className="text-white" />
              </div>
              <span className="absolute -top-2 -right-2 bg-green-500 rounded-full w-5 h-5 border-2 border-white"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - New Section */}
      <div className="container mx-auto px-4 -mt-4 z-10">
        <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
            <Package className="text-pink-600 mb-2" size={24} />
            <p className="text-gray-800 font-medium">{orders.length} Orders</p>
            <p className="text-xs text-gray-500">This month</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
            <Heart className="text-pink-600 mb-2" size={24} />
            <p className="text-gray-800 font-medium">5 Favorites</p>
            <p className="text-xs text-gray-500">Saved items</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
            <Gift className="text-pink-600 mb-2" size={24} />
            <p className="text-gray-800 font-medium">235 Points</p>
            <p className="text-xs text-gray-500">Rewards balance</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
            <CreditCard className="text-pink-600 mb-2" size={24} />
            <p className="text-gray-800 font-medium">Gold Tier</p>
            <p className="text-xs text-gray-500">Member status</p>
          </div>
        </div>
      </div>

      {/* Main Account Content */}
      <div className="container mx-auto flex-grow py-6 px-4">
        <div className="bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden
                     transform transition-all duration-500 hover:shadow-xl">
          {/* Enhanced Tabs */}
          <Tabs defaultValue="orders" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="w-full flex border-b-0 bg-pink-50 p-1">
              <TabsTrigger 
                value="orders" 
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-base font-medium rounded-t-lg
                          transition-all duration-300 ${activeTab === "orders" ? "bg-white shadow-md" : "hover:bg-pink-100"}`}
              >
                <Package size={18} className={activeTab === "orders" ? "text-pink-600" : "text-gray-600"} />
                <span className="hidden sm:inline">My Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="address" 
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-base font-medium rounded-t-lg
                          transition-all duration-300 ${activeTab === "address" ? "bg-white shadow-md" : "hover:bg-pink-100"}`}
              >
                <MapPin size={18} className={activeTab === "address" ? "text-pink-600" : "text-gray-600"} />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-base font-medium rounded-t-lg
                          transition-all duration-300 ${activeTab === "settings" ? "bg-white shadow-md" : "hover:bg-pink-100"}`}
              >
                <Settings size={18} className={activeTab === "settings" ? "text-pink-600" : "text-gray-600"} />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content with Elegant Animation */}
            <div className="p-4 md:p-6">
              <TabsContent value="orders" className="mt-2 focus:outline-none">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">My Sweet Surprises</h2>
                  <button className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-sm font-medium transition-colors">
                    View All
                  </button>
                </div>
                <ShoppingOrders />
              </TabsContent>
              
              <TabsContent value="address" className="mt-2 focus:outline-none">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Delivery Addresses</h2>
                  <button className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-sm font-medium transition-colors">
                    Add New
                  </button>
                </div>
                <Address />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-2 focus:outline-none">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>
                  <button className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-sm font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-pink-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          value={user?.userName} 
                          className="w-full p-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          value="example@email.com" 
                          className="w-full p-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-pink-50 p-5 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input type="checkbox" id="order-updates" className="mr-2" checked />
                        <label htmlFor="order-updates" className="text-gray-700">Order updates</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="promotions" className="mr-2" checked />
                        <label htmlFor="promotions" className="text-gray-700">Special promotions</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="newsletters" className="mr-2" />
                        <label htmlFor="newsletters" className="text-gray-700">Weekly newsletter</label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Sweet Surprises</h3>
              <p className="text-pink-100">Bringing joy with every sweet moment</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-lg font-medium mb-2">Connect with us</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-pink-200 transition-colors p-2 bg-white bg-opacity-10 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-pink-200 transition-colors p-2 bg-white bg-opacity-10 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="https://www.instagram.com/swweet_surprises/" target="blank" className="hover:text-pink-200 transition-colors p-2 bg-white bg-opacity-10 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-pink-400 text-center text-sm text-pink-200">
            <p>© 2025 Sweet Surprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingAccount;